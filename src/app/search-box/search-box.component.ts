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

  constructor(public adverstisementService:AdverstisementService,private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form) {
    this.router.navigate(['/home'])
  }

  searchResult(ad_type, currency, ad_coin, payment_methods) {
    this.adverstisementService.changefilter(ad_type, currency, ad_coin, payment_methods)
  }
}
