import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdverstisementService } from '../../service/adverstisement.service'

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  currency_options = ['INR', 'USD', 'KRW'];
  ad_coin_options = ['STEEM', 'SBD'];
  payment_methods_options = ['Bank Transfer', 'In Cash', 'PayPal'];
  ad_type_options = ['BUY', 'SELL'];
  currency: any = ''
  ad_coin: any = ''
  payment_methods: any = '';
  ad_type: any = '';
  constructor(public adverstisementService: AdverstisementService, private router: Router) {
    this.adverstisementService.currencyFilter.subscribe(filter => this.currency = filter)
    this.adverstisementService.adCoinFilter.subscribe(filter => this.ad_coin = filter)
    this.adverstisementService.paymentMethodFilter.subscribe(filter => this.payment_methods = filter)
    this.adverstisementService.adTypeFilter.subscribe(filter => this.ad_type = filter)
  }

  ngOnInit() {
  }

  searchResult(ad_type, ad_coin, currency, payment_methods) {
    if (ad_type === 'SELL') {
      this.router.navigate(['/sell-online'])
    }
    else if (ad_type === 'BUY') {
      this.router.navigate(['/buy-online'])
    }
    this.adverstisementService.changefilter(ad_type, currency, ad_coin, payment_methods)
  }
}
