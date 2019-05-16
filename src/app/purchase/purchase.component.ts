import { Component, OnInit, NgZone } from '@angular/core';
import { takeWhile } from "rxjs/operators";
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { each } from 'lodash';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import * as moment from 'moment';
import { OrderRequest } from '../module/order';
import { AdvertisementResponse } from '../module/advertisement';
import { APIService } from '../../service/api.service';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  constructor(private purchaseServ: APIService,
    private broadcastApi: SteemconnectBroadcastService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public auth: SteemconnectAuthService) { }

  selectedTrade: AdvertisementResponse = {
    _id: '',
    createdby: '',
    ad_type: '',
    market: '',
    payment_method: '',
    to: '',
    margin: 0,
    limit_from: 0,
    ad_status: '',
    limit_to: 0,
    restricted_amounts: [],
    from: '',
    ad_coin_amount: 0,
    terms: '',
    __v: 0,
    ad_details: {
      minimum_volume: 0,
      minimum_reputation_score: 0,
      new_buyer_limit: 0,
      track_liquidity: false
    },
    security_details: {
      identified_people_only: false,
      identify_user_before_continuing_trade: false,
      real_name_required: false,
      sms_verification_required: false,
      trusted_people_only: false
    },
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
  showTo = '';
  private isAlive = true;
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.purchaseServ.getSelectedTradeFromAPI(id).pipe(takeWhile(() => this.isAlive)).subscribe(data => {
      console.log(data);
      this.selectedTrade = data;
      const to = this.purchaseServ.coinsByMarket[this.selectedTrade.market].find((coin)=> coin.value === this.selectedTrade.to);
      this.showTo = to ? to.label : this.selectedTrade.to;
      this.order.ad_id = this.selectedTrade._id;
      this.order.createdfor = this.selectedTrade.createdby;
      //todo - reverse ad type
      this.order.order_type = this.selectedTrade.ad_type == "BUY" ? "sell" : "buy";
      this.order.from = this.selectedTrade.from;
      this.order.order_payment_method = this.selectedTrade.payment_method;
      this.order.market = this.selectedTrade.market;
      this.order.to = this.selectedTrade.to;
      //todo - calculate rate from margin
      //this.order.order_rate=this.selectedTrade.margin;
      if (this.order.from == "STEEM") {
        forkJoin(this.purchaseServ.getPrice(), this.purchaseServ.getBtcPrice())
          .pipe(takeWhile(() => this.isAlive)).subscribe((data: any) => {
            console.log('data', data)
            each(data[1].bitcoin, (value, key)=> {
              data[0].steem[key] = value *  data[0].steem.btc;
            });
            let priceResponse = data[0].steem;
            if (this.order.to == "ENG" || this.order.to == "SWEET" || this.order.to == "SUFB") {
              this.price = (1 + this.selectedTrade.margin / 100)
            } else
              this.price = (priceResponse[this.order.to.toLowerCase()] || 1) * (1 + this.selectedTrade.margin / 100)
            this.order.order_rate = this.price;
          });

      }
      else if (this.order.from == "SBD") {
        forkJoin(this.purchaseServ.getPrice(), this.purchaseServ.getBtcPrice())
          .pipe(takeWhile(() => this.isAlive)).subscribe((data: any) => {
            console.log('data', data)
            each(data[1].bitcoin, (value, key)=> {
              data[0]['steem-dollars'][key] = value *  data[0]['steem-dollars'].btc;
            });
          let priceResponse = data[0]['steem-dollars'];
          if (this.order.to == "ENG" || this.order.to == "SWEET" || this.order.to == "SUFB") {
            this.price = (1 + this.selectedTrade.margin / 100)
          } else
            this.price = (priceResponse[this.order.to.toLowerCase()] || 1) * (1 + this.selectedTrade.margin / 100)
          this.order.order_rate = this.price;
        });
      }
    });
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
  onSubmit(f: NgForm) {
    console.log("onsubmit called")
    let now = new Date();
    this.order.escrowID = Math.floor(now.getTime() / 1000);
    this.order.escrow_rat_deadline = new Date(moment().add(2, 'hours').format());
    this.order.escrow_exp_deadline = new Date(moment().add(3, 'days').format());;
    this.purchaseServ.createOrder(this.order).pipe(takeWhile(() => this.isAlive)).subscribe((res: any) => this.zone.run(() => {
      this.broadcastApi.broadcastCustomJson('swap-order', this.order)
      .pipe(takeWhile(() => this.isAlive)).subscribe(() => this.zone.run(() => {
        this.router.navigate([`order/${res._id}`])
      }))
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

  ngOnDestroy() {
    this.isAlive = false;
  }
}
