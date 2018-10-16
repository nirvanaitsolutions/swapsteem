import { Component, OnInit,NgZone } from '@angular/core';
import {AdvertisementResponse} from '../module/advertisement';
import {OrderRequest} from '../module/order';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';
import {APIService} from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  constructor(private purchaseServ : APIService,
              private router : Router,
              private route : ActivatedRoute,
              private zone : NgZone,
              public auth: SteemconnectAuthService) { }

  selectedTrade :any;
  order: OrderRequest =  {
    ad_id:'',
    createdby:'',
    createdfor:'',
    order_type:'',
    order_coin_amount:0,
    order_fiat_amount:0,
    order_coin:'',
    order_rate:0,
    order_status:'created',
    order_payment_method: [],
    agree_terms: true,
    country:'',
    currency:''
  };

  userData: any = [];
  price : any;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedTrade = this.purchaseServ.getSelectedTradeFromAPI(id).subscribe(data => {
      this.selectedTrade = data;
      console.log(this.selectedTrade);
      this.order.ad_id=this.selectedTrade._id;
      this.order.createdfor=this.selectedTrade.createdby;
      //todo - reverse ad type
      this.order.order_type=this.selectedTrade.ad_type == "buy" ? "sell" : "buy" ;
      this.order.order_coin=this.selectedTrade.ad_coin;
      //todo - calculate rate from margin
      //this.order.order_rate=this.selectedTrade.margin;
      if(this.order.order_coin == "STEEM"){
        this.order.order_rate = this.price.STEEM.USD;
      }
      if(this.order.order_coin == "SBD"){
        this.order.order_rate =  this.price["SBD*"].USD;
      }
      this.order.order_payment_method=this.selectedTrade.payment_methods;
      this.order.country=this.selectedTrade.country;
      this.order.currency=this.selectedTrade.currency;
    });
    
    console.log("selected trade"+this.selectedTrade);
    this.auth.getUserData().subscribe(data => {
      this.userData = data;
      this.order.createdby=this.userData.name;
      console.log(this.userData);
    });

    this.purchaseServ.getPrice().subscribe(data => {
      this.price = data;
    });
    
  }

  createOrderEvent(form){
    console.log(form);
  }

  onSubmit(form){
    // this.order.ad_id=this.selectedTrade._id;
    // this.order.createdfor=this.selectedTrade.createdby;
    // //todo - reverse ad type
    // this.order.order_type=this.selectedTrade.ad_type;
    // this.order.order_coin=this.selectedTrade.ad_coin;
    // //todo - calculate rate from margin
    // this.order.order_rate=this.selectedTrade.margin;
    // this.order.order_payment_method=this.selectedTrade.payment_methods;
    // this.order.country=this.selectedTrade.country;
    // this.order.currency=this.selectedTrade.currency;
    //this.order.createdby=this.userData.name;
    console.log("order : "+this.order)
    // this.broadcast.broadcastCustomJson('swapsteem','order',this.order)
    // .subscribe(res => this.router.navigate(['profile']));
    this.purchaseServ.createOrder(this.order).subscribe(res=>this.zone.run(() => {
      this.router.navigate(['wallet'])
    }));
    // .subscribe(res => this.router.navigate(['profile']));
    
  }

  changeToFiat(){
    if(this.order.order_coin == "STEEM"){
      this.order.order_fiat_amount = this.order.order_coin_amount * this.price.STEEM.USD;
    }
    if(this.order.order_coin == "SBD"){
      this.order.order_fiat_amount = this.order.order_coin_amount * this.price["SBD*"].USD;
    }
  }

  changeToCoin(){
    if(this.order.order_coin == "STEEM"){
      this.order.order_coin_amount = this.order.order_fiat_amount * (1/this.price.STEEM.USD);
    }
    if(this.order.order_coin == "SBD"){
      this.order.order_coin_amount = this.order.order_fiat_amount * (1/this.price["SBD*"].USD);
    }
  }
}
