import { Component, OnInit } from '@angular/core';
import {Advertisement} from '../module/advertisement';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';
import {PurchaseService} from '../../service/purchase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {


  selectedTrade :Advertisement;
  order =  {
    ad_id:'',
    createdby:'',
    createdfor:'',
    order_type:'',
    order_coin_amount:'',
    order_fiat_amount:'',
    order_coin:'',
    order_rate:'',
    order_payment_method: [],
    agree_terms: true,
    country:'',
    currency:''
  };
  
  constructor(private purchaseServ : PurchaseService,
              private router : Router,public broadcast: SteemconnectBroadcastService) { }

  ngOnInit() {
    if(this.purchaseServ.getSelectedTrade() == null){
      this.router.navigate(['home']);
    }
    this.selectedTrade = this.purchaseServ.getSelectedTrade();
    console.log("selected trade"+this.selectedTrade);
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
  }

  createOrderEvent(form){
    console.log(form);
  }
  onSubmit(form){
    console.log(form);
    

    this.broadcast.broadcastCustomJson('swapsteem','order',this.order)
    .subscribe(res => console.log(res));
  }
}
