import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../module/order';
import { APIService } from '../../service/api.service';
import {tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import {SteemconnectAuthService} from '../steemconnect/services/steemconnect-auth.service';



@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {


  userData :any =[];

  constructor( private _auth: SteemconnectAuthService,
              private apiSer : APIService,
               private router : Router) { }
  openOrders : Observable<OrderResponse[]> ;
  closedOrders : Observable<OrderResponse[]>;
  

  ngOnInit() {
    this.userData = this._auth.getUserData().subscribe( data => {
      this.userData = data;
      this.openOrders = this.apiSer.getOpenOrdersForUser(this.userData.name);
      this.closedOrders = this.apiSer.getOpenOrdersByUser(this.userData.name);
    });

    // this.userData = this._auth.getUserData().pipe(
    //                                         tap(data =>  )
    // )
  }

    
}
