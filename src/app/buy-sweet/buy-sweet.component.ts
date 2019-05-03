import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy-sweet',
  templateUrl: './buy-sweet.component.html',
  styleUrls: ['./buy-sweet.component.css'],
})
export class BuySweetComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  submitForm(data) {
    window.location.href = `https://app.steemconnect.com/?amount=${data.amount}&token=${data.amount*1.5}`;
  }
}
