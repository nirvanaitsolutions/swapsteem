import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {

  constructor(private router:Router) { }
  ngOnInit() {

  }
  onSubmit(form){
    console.log(form);
    this.router.navigate(['/home'])
    
  }
  currency = ['INR','USD','KRW'];
  ad_coin = ['STEEM','SBD'];
  payment_methods = ['Bank Transfer','In Cash', 'PayPal'];
  ad_type = ['BUY','SELL'];

}
