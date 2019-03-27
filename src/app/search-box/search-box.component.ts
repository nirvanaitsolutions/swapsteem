import { Component, OnInit } from '@angular/core';
import { takeWhile } from "rxjs/operators";
import { Router } from '@angular/router';
import { AdverstisementService } from '../../service/adverstisement.service'

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  to_options = ['INR','KRW','BTC','EOS'];//, 'USD', 'KRW'
  from_options = ['STEEM', 'SBD'];
  payment_methods_options = ['Bank Transfer', 'PayPal', 'Crypto Transfer'];
  ad_type_options = ['BUY', 'SELL'];
  from: any = ''
  to: any = ''
  payment_methods: any = '';
  ad_type: any = '';
  private isAlive = true;
  constructor(public adverstisementService: AdverstisementService, private router: Router) {
    this.adverstisementService.currencyFilter.pipe(takeWhile(() => this.isAlive)).subscribe(filter => this.from = filter)
    this.adverstisementService.adCoinFilter.pipe(takeWhile(() => this.isAlive)).subscribe(filter => this.from = filter)
    this.adverstisementService.paymentMethodFilter.pipe(takeWhile(() => this.isAlive)).subscribe(filter => this.payment_methods = filter)
    this.adverstisementService.adTypeFilter.pipe(takeWhile(() => this.isAlive)).subscribe(filter => this.ad_type = filter)
  }

  ngOnInit() {
  }

  searchResult(ad_type, from, to, payment_methods) {
    if (ad_type === 'SELL') {
      this.router.navigate(['/sell-online'])
    }
    else if (ad_type === 'BUY') {
      this.router.navigate(['/buy-online'])
    }
    this.adverstisementService.changefilter(ad_type, from, to, payment_methods)
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
