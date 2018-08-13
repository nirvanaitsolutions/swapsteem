import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders, HttpParams} from '@angular/common/http';
import { AdvertisementResponse } from '../app/module/advertisement';
import {SteemconnectAuthService} from '../app/steemconnect/services/steemconnect-auth.service'
import { OrderResponse } from '../app/module/order';


export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private _http: HttpClient,private auth :SteemconnectAuthService, ) {  
   }

  selectedTrade : AdvertisementResponse = null;
  token:OAuth2Token = this.auth.token;
  
  selectTradeEvent(trade: AdvertisementResponse
  ){
    this.selectedTrade = trade;
  }

  createOrder(order){
   // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    console.log(JSON.stringify(order));
    return this._http.post("http://swapsteem-api.herokuapp.com/orders",JSON.stringify(order));
    
  }

  createAd(ad){
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
     console.log(JSON.stringify(ad));
     return this._http.post("http://swapsteem-api.herokuapp.com/advertisements",JSON.stringify(ad));
     
   }

  getBuyAds(){
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<AdvertisementResponse>("http://swapsteem-api.herokuapp.com/advertisements/buy-sbd");
  }

  getAdsByUser(user){
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<AdvertisementResponse>("http://swapsteem-api.herokuapp.com/advertisements");
  }

  getOpenOrdersForUser(user){
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<OrderResponse>("http://swapsteem-api.herokuapp.com/orders");
  }

  getClosedOrdersForUser(user){
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<OrderResponse>("http://swapsteem-api.herokuapp.com/orders");
  }

  getSellAds(){
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<AdvertisementResponse>("http://swapsteem-api.herokuapp.com/advertisements/sell-sbd");
  }

  getSelectedTrade(){
    return this.selectedTrade;
  }

}
