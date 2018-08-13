import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../module/order';
import { APIService } from '../../service/api.service';
import { Router } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  constructor(private apiSer : APIService, private auth:SteemconnectAuthService,
    private router : Router) { }
  openOrders : Observable<OrderResponse[]> ;
  closedOrders : Observable<OrderResponse[]>;
  userData: any = [];

  ngOnInit() {
    this.auth.getUserData().subscribe(data => {
      this.userData = data;
      console.log(this.userData);
      this.openOrders = this.apiSer.getOpenOrdersForUser(this.userData.name);
      this.closedOrders = this.apiSer.getOpenOrdersByUser(this.userData.name);
    })
    
  }

}
