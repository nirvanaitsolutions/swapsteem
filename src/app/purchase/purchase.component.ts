import { Component, OnInit, NgZone } from '@angular/core';
import { AdvertisementResponse } from '../module/advertisement';
import { OrderRequest } from '../module/order';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';
import { APIService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  constructor(private purchaseServ: APIService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public auth: SteemconnectAuthService) { }

  selectedTrade: any;
  order: OrderRequest = {
    ad_id: '',
    createdby: '',
    createdfor: '',
    order_type: '',
    escrowID: 0,
    order_coin_amount: 0,
    order_fiat_amount: 0,
    from: '',
    order_rate: 0,
    order_status: 'created',
    order_payment_method: [],
    agree_terms: true,
    market: '',
    to: '',
    escrow_rat_deadline: new Date(moment().add(2, 'hours').format('YYYY-MM-DDTHH:MM:SS')),
    escrow_exp_deadline: new Date(moment().add(3, 'days').format('YYYY-MM-DDTHH:MM:SS')),
    payment_details: {
      account_holder_name: '',
      account_number: 0,
      bank_name: '',
      bank_address: '',
      swift_bic_code: '',
      bank_code: '',
      paypal_email: '',
      place_of_exchange: '',
      upi_id: '',
      crypto_address: ''
    }
  };

  userData: any = [];
  price: any;
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedTrade = this.purchaseServ.getSelectedTradeFromAPI(id).subscribe(data => {
      this.selectedTrade = data;
      console.log(this.selectedTrade);
      this.order.ad_id = this.selectedTrade._id;
      this.order.createdfor = this.selectedTrade.createdby;
      //todo - reverse ad type
      this.order.order_type = this.selectedTrade.ad_type == "BUY" ? "sell" : "buy";
      this.order.from = this.selectedTrade.from;
      this.order.order_payment_method = this.selectedTrade.payment_methods;
      this.order.market = this.selectedTrade.market;
      this.order.to = this.selectedTrade.to;
      //todo - calculate rate from margin
      //this.order.order_rate=this.selectedTrade.margin;
      if (this.order.from == "STEEM") {
        this.purchaseServ.getPriceByPair(this.order.from, this.order.to).subscribe(data => {
          let priceResponse = data['steem'];
          console.log(data, 'data')
          console.log("price ", data['steem'], 'steem');
          if (this.order.to == "ENG" || this.order.to == "SWEET"){
            this.price =  (1 + this.selectedTrade.margin / 100) 
          } else
          if (this.order.to == "INR" || this.order.to == "KRW"){
            this.price = priceResponse['inr'] ? priceResponse['inr'] * (1 + this.selectedTrade.margin / 100) : priceResponse['krw'] * (1 + this.selectedTrade.margin / 100) 
          }
          else{
            this.price = priceResponse['btc'] ? priceResponse['btc'] * (1 + this.selectedTrade.margin / 100)  : priceResponse['eos'] * (1 + this.selectedTrade.margin / 100) ;
          }
          this.order.order_rate = this.price;
        });

      }
      else if (this.order.from == "SBD") {
        this.purchaseServ.getPriceByPair(this.order.from, this.order.to).subscribe(data => {
          let priceResponse = data['sbd'];
          console.log(data, 'data')
          console.log("price ", data['sbd'], 'sbd');
          if (this.order.to == "ENG" || this.order.to == "SWEET"){
            this.price =  (1 + this.selectedTrade.margin / 100) 
          } else
          if (this.order.to == "INR" || this.order.to == "KRW"){
            this.price = priceResponse['inr'] ? priceResponse['inr'] * (1 + this.selectedTrade.margin / 100) : priceResponse['krw'] * (1 + this.selectedTrade.margin / 100) 
          } else{
            this.price = priceResponse['btc'] ? priceResponse['btc'] * (1 + this.selectedTrade.margin / 100) : priceResponse['eos'] * (1 + this.selectedTrade.margin / 100) 
          }
          this.order.order_rate = this.price;
        });

      }


      // this.purchaseServ.getPrice().subscribe(data => {
      //   this.price = data;
      // });
    });

    console.log("selected trade" + this.selectedTrade);
    this.userData = this.auth.userData;
    this.order.createdby = this.userData.name;
    console.log(this.userData);



  }

  createOrderEvent(form) {
    console.log(form);
  }

  /**
   *
   * @name onSubmit 
   *
   * @description
   * This method used to create a new order
   * @requires order order derails
  */
  onSubmit() {
    console.log("onsubmit called")
    let now = new Date();
    this.order.escrowID = Math.floor(now.getTime() / 1000);
    this.order.escrow_rat_deadline = new Date(moment().add(2, 'hours').format());
    this.order.escrow_exp_deadline = new Date(moment().add(3, 'days').format());;
    this.purchaseServ.createOrder(this.order).subscribe((res: any) => this.zone.run(() => {
      this.router.navigate([`order/${res._id}`])
    }));
  }

  changeToFiat() {
    if (this.order.from == "STEEM") {
      this.order.order_fiat_amount = this.order.order_coin_amount * this.price;
    }
    if (this.order.from == "SBD") {
      this.order.order_fiat_amount = this.order.order_coin_amount * this.price;
    }
    console.log('this.order.order_fiat_amount', this.order.order_coin_amount, this.price)
  }

  changeToCoin() {
    if (this.order.from == "STEEM") {
      this.order.order_coin_amount = this.order.order_fiat_amount * (1 / this.price);
    }
    if (this.order.from == "SBD") {
      this.order.order_coin_amount = this.order.order_fiat_amount * (1 / this.price);
    }
  }
}
