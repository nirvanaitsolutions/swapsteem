import { Component, OnInit, NgZone } from '@angular/core';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';
import { AdvertisementRequest } from '../module/advertisement';
import { APIService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-post-trade',
  templateUrl: './post-trade.component.html',
  styleUrls: ['./post-trade.component.css']
})
export class PostTradeComponent implements OnInit {

  constructor(private ngxService: NgxUiLoaderService, public api: APIService, private router: Router, private zone: NgZone, private auth: SteemconnectAuthService, private route: ActivatedRoute) {
  }

  advertisement: AdvertisementRequest = {
    createdby: '',
    ad_type: '',
    country: '',
    payment_methods: '',
    currency: 'USD',
    margin: 0,
    limit_from: 0,
    limit_to: 0,
    restricted_amounts: [],
    ad_coin: 'STEEM',
    ad_status: 'open',
    ad_coin_amount: 0,
    terms: '',
    ad_details: {
      minimum_volume: 0,
      minimum_reputation_score: 25,
      new_buyer_limit: 0,
      track_liquidity: true
    },
    security_details: {
      identified_people_only: true,
      identify_user_before_continuing_trade: true,
      real_name_required: true,
      sms_verification_required: true,
      trusted_people_only: true
    },
    payment_details: {
      account_holder_name: '',
      account_number: 0,
      bank_name: '',
      bank_address: '',
      swift_bic_code: '',
      bank_code: '',
    }
  };
  objectKeys = Object.keys;
  userData: any = [];
  cryptos: any;
  effectivePrice: any;
  adId: string = '';

  ngOnInit() {
    this.adId = this.route.snapshot.paramMap.get('id');
    this.getSelectedTradeFromAPI(this.adId);
    this.ngxService.start();
    this.userData = this.auth.userData;
    this.advertisement.createdby = this.userData.name;
    console.log(this.userData);
    this.api.getPriceByPair(this.advertisement.ad_coin, this.advertisement.currency).subscribe(data => {
      this.cryptos = data;
      console.log(data)
      this.ngxService.stop();
    });
  }


  getSelectedTradeFromAPI(id: string) {
    if (id) {
      this.ngxService.start();
      this.api.getSelectedTradeFromAPI(id).subscribe((res) => this.zone.run(() => {
        this.advertisement = {
          ...this.advertisement, ...{
            createdby: res.createdby,
            ad_type: res.ad_type,
            country: res.country,
            payment_methods: res.payment_methods[0],
            currency: res.currency,
            margin: res.margin,
            limit_from: res.limit_from,
            limit_to: res.limit_to,
            restricted_amounts: res.restricted_amounts,
            ad_coin: res.ad_coin,
            ad_status: res.ad_status,
            ad_coin_amount: res.ad_coin_amount,
            terms: res.terms,
            ad_details: {
              minimum_volume: res.ad_details.minimum_volume,
              minimum_reputation_score: res.ad_details.minimum_reputation_score,
              new_buyer_limit: res.ad_details.new_buyer_limit,
              track_liquidity: res.ad_details.track_liquidity
            },
            security_details: {
              identified_people_only: res.security_details.identified_people_only,
              identify_user_before_continuing_trade: res.security_details.identify_user_before_continuing_trade,
              real_name_required: res.security_details.real_name_required,
              sms_verification_required: res.security_details.sms_verification_required,
              trusted_people_only: res.security_details.trusted_people_only
            },
            payment_details: {
              account_holder_name: res.payment_details.account_holder_name,
              account_number: res.payment_details.account_number,
              bank_name: res.payment_details.bank_name,
              bank_address: res.payment_details.bank_address,
              swift_bic_code: res.payment_details.swift_bic_code,
              bank_code: res.payment_details.bank_code,
            }
          }
        };
        this.ngxService.stop();
      }));
    }
  }

  onSubmit() {
    this.ngxService.start();
    this.api.createAd(this.advertisement, this.adId).subscribe(res => this.zone.run(() => {
      this.router.navigate(['profile'])
      this.ngxService.stop();
    }));
  }
  currency = ['INR', 'USD', 'KRW'];
  ad_type = ['BUY', 'SELL'];
  ad_coin = ['STEEM', 'SBD'];
  payment_methods = ['Bank Transfer', 'In Cash', 'PayPal'];
}
