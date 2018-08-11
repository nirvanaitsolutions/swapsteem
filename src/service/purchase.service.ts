import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,} from '@angular/common/http';
import { AdvertisementResponse } from '../app/module/advertisement';
import {SteemconnectAuthService} from './../app/steemconnect/services/steemconnect-auth.service'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private _http: HttpClient,private auth :SteemconnectAuthService, ) {
    httpOptions.headers = httpOptions.headers.set("Authorization",this.token.access_token)
  
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
    return this._http.post("http://swapsteem-api.herokuapp.com/orders",JSON.stringify(order),httpOptions);
    
  }

  getBuyAds(){
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<AdvertisementResponse>("http://swapsteem-api.herokuapp.com/advertisements",httpOptions);
  }

  getSellAds(){
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<AdvertisementResponse>("http://swapsteem-api.herokuapp.com/advertisements",httpOptions);
  }

  getSelectedTrade(){
    return this.selectedTrade;
  }

}
