import { Component, OnInit, NgZone } from '@angular/core';
import { AdvertisementResponse } from '../module/advertisement';
import { OrderRequest } from '../module/order';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';
import { APIService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';

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
    order_coin: '',
    order_rate: 0,
    order_status: 'created',
    order_payment_method: [],
    agree_terms: true,
    country: '',
    currency: ''
  };

  userData: any = [];
  price: any;
  account_details: {
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    bank_address?: string;
    swift_bic_code?: string;
    bank_code?: string;
  } = {
      account_holder_name: '',
      account_number: '',
      bank_name: '',
      bank_address: '',
      swift_bic_code: '',
      bank_code: '',
    }
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.selectedTrade = this.purchaseServ.getSelectedTradeFromAPI(id).subscribe(data => {
      this.selectedTrade = data;
      console.log(this.selectedTrade);
      this.order.ad_id = this.selectedTrade._id;
      this.order.createdfor = this.selectedTrade.createdby;
      //todo - reverse ad type
      this.order.order_type = this.selectedTrade.ad_type == "buy" ? "sell" : "buy";
      this.order.order_coin = this.selectedTrade.ad_coin;
      this.order.order_payment_method = this.selectedTrade.payment_methods;
      this.order.country = this.selectedTrade.country;
      this.order.currency = this.selectedTrade.currency;
      //todo - calculate rate from margin
      //this.order.order_rate=this.selectedTrade.margin;
      if (this.order.order_coin == "STEEM") {
        this.purchaseServ.getPriceByPair(this.order.order_coin, this.order.currency).subscribe(data => {
          let priceResponse = Object.values(data);
          this.price = Math.round(priceResponse[0] * (1 + this.selectedTrade.margin / 100) * 100) / 100;
          console.log("price " + this.price)
          this.order.order_rate = this.price;
        });

      }
      else if (this.order.order_coin == "SBD") {
        this.purchaseServ.getPriceByPair(this.order.order_coin, this.order.currency).subscribe(data => {
          let priceResponse = Object.values(data);
          this.price = Math.round(priceResponse[0] * (1 + this.selectedTrade.margin / 100) * 100) / 100;
          this.order.order_rate = this.price;
        });

      }


      // this.purchaseServ.getPrice().subscribe(data => {
      //   this.price = data;
      // });
    });

    console.log("selected trade" + this.selectedTrade);
    this.auth.getUserData().subscribe(data => {
      this.userData = data;
      this.order.createdby = this.userData.name;
      console.log(this.userData);
    });



  }

  createOrderEvent(form) {
    console.log(form);
  }

  onSubmit(form) {
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
    let now = new Date();
    this.order.escrowID = Math.floor(now.getTime() / 1000)

    console.log("escrow : " + this.order.escrowID)
    // this.broadcast.broadcastCustomJson('swapsteem','order',this.order)
    // .subscribe(res => this.router.navigate(['profile']));
    this.purchaseServ.createOrder(this.order).subscribe((res: any) => this.zone.run(() => {
      this.router.navigate([`order/${res._id}`])
    }));
    // .subscribe(res => this.router.navigate(['profile']));

  }

  changeToFiat() {
    if (this.order.order_coin == "STEEM") {
      this.order.order_fiat_amount = this.order.order_coin_amount * this.price;
    }
    if (this.order.order_coin == "SBD") {
      this.order.order_fiat_amount = this.order.order_coin_amount * this.price;
    }
    console.log('this.order.order_fiat_amount', this.order.order_coin_amount , this.price)
  }

  changeToCoin() {
    if (this.order.order_coin == "STEEM") {
      this.order.order_coin_amount = this.order.order_fiat_amount * (1 / this.price);
    }
    if (this.order.order_coin == "SBD") {
      this.order.order_coin_amount = this.order.order_fiat_amount * (1 / this.price);
    }
  }
}
