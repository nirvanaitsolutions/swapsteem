import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../module/order';
import { APIService } from '../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(private apiSer : APIService,
    private router : Router) { }
  openOrders : Observable<OrderResponse[]> ;
  closedOrders : Observable<OrderResponse[]>;

  ngOnInit() {
    this.openOrders = this.apiSer.getOpenOrdersForUser('aneilpatel');
    this.closedOrders = this.apiSer.getClosedOrdersForUser('aneilpatel');
  }

}
