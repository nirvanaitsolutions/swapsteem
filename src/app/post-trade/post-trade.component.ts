import { Component, OnInit } from '@angular/core';
import { SteemconnectBroadcastService } from '../steemconnect/services/steemconnect-broadcast.service';

@Component({
  selector: 'app-post-trade',
  templateUrl: './post-trade.component.html',
  styleUrls: ['./post-trade.component.css']
})
export class PostTradeComponent implements OnInit {

  constructor(public broadcast: SteemconnectBroadcastService) {
   }

  advertisement = {
    createdby: '',
    ad_type:'',
    country: '',
    payment_methods: [],
    currency: '',
    margin: '',
    limit_from: '',
    limit_to: '',
    restricted_amounts: [],
    ad_coin : '',
    ad_coin_amount : '',
    terms: '',
    ad_details:{
      minimum_volume: '',
      minimum_reputation_score:'',
      new_buyer_limit: '',
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


  ngOnInit() {
  }

  onSubmit(){
    console.log(this.advertisement);
    this.broadcast.broadcastCustomJson('swapsteem',["advertisement",this.advertisement])
  }

  country = ['','India','USA','South Korea','Indonesia','Nigeria'];
  ad_type = ['buy','sell'];
  ad_coin = ['Steem','SBD'];
  payment_methods = ['Bank Transfer','Wallet Transfer', 'PayPal'];
}
