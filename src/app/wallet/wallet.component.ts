import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../module/order';
import { APIService } from '../../service/api.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { OrderService } from '../../service/order.service';
import { HttpClient } from '@angular/common/http';
import { AdvertisementResponse } from '../module/advertisement';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {


  userData: any = [];

  constructor(private ngxService: NgxUiLoaderService, private _auth: SteemconnectAuthService,
    private apiSer: APIService,
    private _router: Router,
    private _http: HttpClient,
    private _orderService: OrderService) { }
  openOrders: Observable<OrderResponse[]>;
  closedOrders: Observable<OrderResponse[]>;
  emptyOpenOrder: boolean;
  emptyCloseOrders : boolean;

  ngOnInit() {
    this.ngxService.start();
    this.userData = this._auth.getUserData().subscribe(data => {
      this.userData = data;
      this.openOrders = this.apiSer.getOpenOrdersForUser(this.userData.name);
      this.openOrders.subscribe((data) => {
        // Hack for check data existance
        if (data.length) {
          this.emptyOpenOrder = false
        } else {
          this.emptyOpenOrder = true;
        }
      })
      this.closedOrders = this.apiSer.getOpenOrdersByUser(this.userData.name);
      this.closedOrders.subscribe((data)=>{
        if(data.length){
          this.emptyCloseOrders = false
        }else{
          this.emptyCloseOrders = true;
        }
        this.ngxService.stop();
      })
     
    });
  }


  viewOrder(orderClick: OrderResponse) {
    this._router.navigate([`order/${orderClick._id}`]);
  }

}
