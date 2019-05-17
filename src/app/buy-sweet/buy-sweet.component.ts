import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy-sweet',
  templateUrl: './buy-sweet.component.html',
  styleUrls: ['./buy-sweet.component.css']
})
export class BuySweetComponent implements OnInit {
  conversionRate = 12.5;

  constructor() {}

  ngOnInit() {}

  submitForm(data) {
    window.location.href = `https://app.steemconnect.com/sign/transfer?to=swapsteem&&amount=${data.amount} STEEM&memo=swapsteem-ieo`;
  }
}
