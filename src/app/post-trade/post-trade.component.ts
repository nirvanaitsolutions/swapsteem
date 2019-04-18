import { Component, OnInit, NgZone } from '@angular/core';
import { takeWhile } from "rxjs/operators";
import { AdvertisementRequest } from '../module/advertisement';
import { APIService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';

@Component({
  selector: 'app-post-trade',
  templateUrl: './post-trade.component.html',
  styleUrls: ['./post-trade.component.css']
})
export class PostTradeComponent implements OnInit {

  constructor(private broadcastApi: SteemconnectBroadcastService, private ngxService: NgxUiLoaderService, public api: APIService, private router: Router, private zone: NgZone, private auth: SteemconnectAuthService, private route: ActivatedRoute) {
  }

  advertisement: AdvertisementRequest = {
    createdby: '',
    ad_type: '',
    market: '',
    payment_method: '',
    to: 'USD',
    margin: 0,
    limit_from: 0,
    limit_to: 0,
    restricted_amounts: [],
    from: 'STEEM',
    ad_status: 'open',
    ad_coin_amount: 0,
    terms: '',
    // ad_details: {
    //   minimum_volume: 0,
    //   minimum_reputation_score: 25,
    //   new_buyer_limit: 0,
    //   track_liquidity: true
    // },
    // security_details: {
    //   identified_people_only: true,
    //   identify_user_before_continuing_trade: true,
    //   real_name_required: true,
    //   sms_verification_required: true,
    //   trusted_people_only: true
    // },
    // payment_details: {
    //   account_holder_name: '',
    //   account_number: 0,
    //   bank_name: '',
    //   bank_address: '',
    //   swift_bic_code: '',
    //   bank_code: '',
    //   paypal_email: '',
    //   place_of_exchange: '',
    //   upi_id: ''
    // }
  };
  objectKeys = Object.keys;
  userData: any = [];
  cryptos: any;
  effectivePrice: any;
  adId: string = '';
  private isAlive = true;
  public coinsByMarket = {};
  ngOnInit() {
    this.adId = this.route.snapshot.paramMap.get('id');
    this.getSelectedTradeFromAPI(this.adId);
    this.userData = this.auth.userData;
    this.advertisement.createdby = this.userData.name;
    this.coinsByMarket = this.api.coinsByMarket;
  }


  getSelectedTradeFromAPI(id: string) {
    if (id) {
      this.ngxService.start();
      this.api.getSelectedTradeFromAPI(id).pipe(takeWhile(() => this.isAlive)).subscribe((res) => this.zone.run(() => {
        this.advertisement = {
          ...this.advertisement, ...{
            createdby: res.createdby,
            ad_type: res.ad_type,
            market: res.market,
            payment_method: res.payment_method,
            to: res.to,
            margin: res.margin,
            limit_from: res.limit_from,
            limit_to: res.limit_to,
            restricted_amounts: res.restricted_amounts,
            from: res.from,
            ad_status: res.ad_status,
            ad_coin_amount: res.ad_coin_amount,
            terms: res.terms,
            // ad_details: {
            //   minimum_volume: res.ad_details.minimum_volume,
            //   minimum_reputation_score: res.ad_details.minimum_reputation_score,
            //   new_buyer_limit: res.ad_details.new_buyer_limit,
            //   track_liquidity: res.ad_details.track_liquidity
            // },
            // security_details: {
            //   identified_people_only: res.security_details.identified_people_only,
            //   identify_user_before_continuing_trade: res.security_details.identify_user_before_continuing_trade,
            //   real_name_required: res.security_details.real_name_required,
            //   sms_verification_required: res.security_details.sms_verification_required,
            //   trusted_people_only: res.security_details.trusted_people_only
            // },
            // payment_details: {
            //   account_holder_name: res.payment_details.account_holder_name,
            //   account_number: res.payment_details.account_number,
            //   bank_name: res.payment_details.bank_name,
            //   bank_address: res.payment_details.bank_address,
            //   swift_bic_code: res.payment_details.swift_bic_code,
            //   bank_code: res.payment_details.bank_code,
            //   paypal_email: res.payment_details.paypal_email,
            //   upi_id: res.payment_details.upi_id,
            //   crypto_address: res.payment_details.crypto_address
            // }
          }
        };
        this.ngxService.stop();
      }));
    }
  }

  onSubmit(tradeForm) {
    console.log('tradeForm', tradeForm)
    this.ngxService.start();
    this.api.createAd(this.advertisement, this.adId).pipe(takeWhile(() => this.isAlive)).subscribe(res => this.zone.run(() => {
      this.createListing()
    }));
  }
  changeCurrency(value) {
    if (value === 'USD' || value === 'KRW'|| value === 'NGN' || value === 'CAD' || value === 'AUD' || value === 'GBP' || value === 'EUR' || value === 'CNY') {
      this.fiat_payment_methods = ['Bank Transfer', 'PayPal'];
    } else {
      this.fiat_payment_methods = ['Bank Transfer', 'PayPal', 'UPI'];
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
  market = ['FIAT', 'CRYPTO', 'TOKEN', 'ERC20', 'EOS', 'TRC20', 'BTS-UIA'];
  fiat_options = ['USD', 'INR', 'KRW', 'NGN', 'CAD', 'AUD', 'GBP', 'EUR', 'CNY']; // 'USD', 'KRW'
  ad_type = ['BUY', 'SELL'];
  from = ['STEEM', 'SBD', 'SWEET'];
  agents = ['swapsteem', 'firepower', 'bobinson'];
  fiat_payment_methods = ['Bank Transfer', 'PayPal'];
  inr_payment_methods = ['Bank Transfer','PayPal', 'UPI'];
  crypto_payment_methods = ['Crypto Transfer']; //
  token_options = [ 'ENG', 'SUFB']
  crypto_options = ['BTC', 'EOS', 'XRP', 'LTC', 'BCH', 'XLM', 'ENU']
  erc20_options = ['BNB']
  eos_options = ['KARMA'];
  trc20_options = ['ANTE'];
  btsuia_options = ['bitUSD'];

    /**
   *
   * @name createListing 
   *
   * @description
   * This method used to generate escrow-transfer link for transfer escrow from seller to buyer
   * @requires sender Seller username
   * @requires reciever  Buyer username
   * @requires id order id 
   * @requires order_coin coin type STEEM/SBD from order details
   * @requires order_coin_amount coin amount from order details
   * @requires terms Terms from advertisement detail
   * @requires agent agent name
  */

 createListing() {
 
  window.location.href = `https://app.steemconnect.com/sign/custom-json?required_auths=[]&required_posting_auths=[]&id=ssc-mainnet1&json=${JSON.stringify(this.advertisement)}&redirect_uri=${window.location.origin}/profile&auto_return=1`;
}
}
