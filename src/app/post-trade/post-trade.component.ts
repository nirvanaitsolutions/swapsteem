import { Component, OnInit, NgZone } from '@angular/core';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';
import {AdvertisementRequest} from '../module/advertisement';
import {APIService} from '../../service/api.service';
import { Router } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';

@Component({
  selector: 'app-post-trade',
  templateUrl: './post-trade.component.html',
  styleUrls: ['./post-trade.component.css']
})
export class PostTradeComponent implements OnInit {

  constructor(public api: APIService, private router:Router, private zone:NgZone,private auth:SteemconnectAuthService) {
   }

  advertisement : AdvertisementRequest = {
    createdby: '',
    ad_type:'',
    country: '',
    payment_methods: [''],
    currency: '',
    margin: 0,
    limit_from: 0,
    limit_to: 0,
    restricted_amounts: [],
    ad_coin : '',
    ad_status : 'open',
    ad_coin_amount : 0,
    terms: '',
    ad_details:{
      minimum_volume:0,
      minimum_reputation_score:25,
      new_buyer_limit: 0,
      track_liquidity:true
    },
    security_details:{
      identified_people_only:true,
      identify_user_before_continuing_trade:true,
      real_name_required:true,
      sms_verification_required:true,
      trusted_people_only:true
    }
    
  };
  objectKeys = Object.keys;
  userData: any = [];
  cryptos:any;
  effectivePrice:any;


  ngOnInit() {
    this.auth.getUserData().subscribe(data => {
      this.userData = data;
      this.advertisement.createdby=this.userData.name;
      console.log(this.userData);
     });
     this.api.getPrice().subscribe(data => {
      this.cryptos=data;
      console.log(data)
     });
  }

  onSubmit(form){
    console.log(form);
    // this.broadcast.broadcastCustomJson('swapsteem','advertisement',this.advertisement)
    // .subscribe(res => console.log(res));
    //this.advertisement.createdby=this.userData.name;
    this.api.createAd(this.advertisement).subscribe(res=>this.zone.run(() => {
      this.router.navigate(['profile'])
    }));
  }

  country = ['','India','USA','South Korea','Indonesia','Nigeria'];
  ad_type = ['buy','sell'];
  ad_coin = ['STEEM','SBD'];
  payment_methods = ['Bank Transfer','Wallet Transfer', 'PayPal'];
}
