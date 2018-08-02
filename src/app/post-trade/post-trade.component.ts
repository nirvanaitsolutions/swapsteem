import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-trade',
  templateUrl: './post-trade.component.html',
  styleUrls: ['./post-trade.component.css']
})
export class PostTradeComponent implements OnInit {

  constructor() {
   }

  advertisement = {
    country: '',
    paymentMethod: '',
    currency: '',
    margin: '',
    limitFrom: '',
    limitTo: '',
    restrictedAmount: '',
    adCoin : '',
    terms: '',
    phoneNumber: '',
    minimumVolume: '',
    maxFeedCount: '',
    buyLimit: ''
  };


  ngOnInit() {
  }

  

  country = ['','1','2','3','4'];
}
