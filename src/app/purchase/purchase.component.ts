import { Component, OnInit } from '@angular/core';
import {AdvertisementResponse} from '../module/advertisement';
import {OrderRequest} from '../module/order';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';
import {PurchaseService} from '../../service/purchase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  constructor(private purchaseServ : PurchaseService,
    private router : Router,public broadcast: SteemconnectBroadcastService) { }

  selectedTrade :AdvertisementResponse;
  order: OrderRequest =  {
    ad_id:'',
    createdby:'',
    createdfor:'',
    order_type:'',
    order_coin_amount:0,
    order_fiat_amount:0,
    order_coin:'',
    order_rate:0,
    order_payment_method: [],
    agree_terms: true,
    country:'',
    currency:''
  };

  ngOnInit() {
    if(this.purchaseServ.getSelectedTrade() == null){
      this.router.navigate(['home']);
    }
    this.selectedTrade = this.purchaseServ.getSelectedTrade();
    console.log("selected trade"+this.selectedTrade);
  }

  createOrderEvent(form){
    console.log(form);
  }
  onSubmit(form){
    this.order.ad_id=this.selectedTrade._id;
    this.order.createdfor=this.selectedTrade.createdby;
    //todo - reverse ad type
    this.order.order_type=this.selectedTrade.ad_type;
    this.order.order_coin=this.selectedTrade.ad_coin;
    //todo - calculate rate from margin
    this.order.order_rate=this.selectedTrade.margin;
    this.order.order_payment_method=this.selectedTrade.payment_methods;
    this.order.country=this.selectedTrade.country;
    this.order.currency=this.selectedTrade.currency;
    console.log(this.order)
    this.broadcast.broadcastCustomJson('swapsteem','order',this.order)
    .subscribe(res => console.log(res));
  }
}
