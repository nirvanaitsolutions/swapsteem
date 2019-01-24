import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AdvertisementResponse, AdvertisementRequest } from '../app/module/advertisement';
import { SteemconnectAuthService } from '../app/steemconnect/services/steemconnect-auth.service'
import { WebsocketsService } from './websockets.service'
import { OrderResponse, OrderRequest } from '../app/module/order';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { MessageRequest } from '../app/module/message';
import { hostReportError } from 'rxjs/internal-compatibility';
import { ReviewRequest, ReviewResponse } from '../app/module/review';

export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private _http: HttpClient, private auth: SteemconnectAuthService, private ws: WebsocketsService) {

  }

  selectedTrade: any = null;
  selectedAd: any = null;
  token: OAuth2Token = this.auth.token;
  result: any;

  selectTradeEvent(trade: AdvertisementResponse
  ) {
    this.selectedTrade = trade;
  }

  selectAdEvent(trade: AdvertisementResponse
  ) {
    this.selectedAd = trade;
  }

  createOrder(order: OrderRequest): Observable<OrderRequest> {
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    console.log(JSON.stringify(order));
    return this._http.post<OrderRequest>("http://swapsteem-api.herokuapp.com/orders", JSON.stringify(order));

  }

  createMessage(message: MessageRequest): Observable<MessageRequest> {
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    console.log(JSON.stringify(message));
    return this._http.post<MessageRequest>("http://swapsteem-api.herokuapp.com/messages", JSON.stringify(message));

  }

  createAd(ad: AdvertisementRequest, id?: string): Observable<AdvertisementRequest> {
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    console.log(JSON.stringify(ad));
    return this._http[id ? 'put' : 'post']<AdvertisementRequest>(`http://swapsteem-api.herokuapp.com/listings/${id || ''}`, JSON.stringify(ad));

  }

  getBuyAds() {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    return this._http.get<AdvertisementResponse[]>("http://swapsteem-api.herokuapp.com/listings/sell", { headers: headers });
  }

  getAdsByUser(user: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<AdvertisementResponse[]>("http://swapsteem-api.herokuapp.com/listings/by_user/" + user);
  }

  getOpenOrdersForUser(user: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<OrderResponse[]>("http://swapsteem-api.herokuapp.com/orders/by_reciever/" + user);
  }

  getOpenOrdersByUser(user: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<OrderResponse[]>("http://swapsteem-api.herokuapp.com/orders/by_creator/" + user);
  }

  getSellAds() {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    return this._http.get<AdvertisementResponse[]>("http://swapsteem-api.herokuapp.com/listings/buy", { headers: headers });
  }

  getPrice() {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    //return this._http.get<AdvertisementResponse[]>("http://swapsteem-api.herokuapp.com/price/"+coin);
    return this._http.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=,STEEM,SBD*&tsyms=USD,INR,KRW", { headers: headers }).map(result => this.result = result);
  }

  getPriceByPair(coin: string, fiat: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    if (coin == "SBD") {
      coin = 'SBD*'
    }
    //return this._http.get<AdvertisementResponse[]>("http://swapsteem-api.herokuapp.com/price/"+coin);
    return this._http.get('https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=' + fiat, { headers: headers }).map(result => this.result = result);
  }

  getSelectedTrade() {
    return this.selectedTrade;
  }

  getSelectedAd() {
    return this.selectedAd;
  }

  getSelectedTradeFromAPI(id: string) {
    return this._http.get<AdvertisementResponse>("http://swapsteem-api.herokuapp.com/listings/" + id);
  }

  getSelectedOrderFromAPI(id: string) {
    return this._http.get<OrderResponse>("http://swapsteem-api.herokuapp.com/orders/" + id);
  }

  deleteAd(id: string): Observable<AdvertisementRequest> {
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.delete<AdvertisementRequest>(`http://swapsteem-api.herokuapp.com/listings/${id}`);
  }

  /**
   *
   * @name pauseAd 
   *
   * @description
   * This method used to open/paused a advertisement
   * @param id advertisement id
   * @param currentStatus current ad_status
   * @returns {Api response}
  */
  pauseAd(id: string, currentStatus: string): Observable<AdvertisementRequest> {
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.put<AdvertisementRequest>(`http://swapsteem-api.herokuapp.com/listings/${id}`, JSON.stringify({
      ad_status: currentStatus === "pause" ? "open" : "pause"
    }));
  }

  /**
   *
   * @name updateSelectedOrderFromAPI 
   *
   * @description
   * This method used to update order details
   * @param id order id
   * @param body order details in json stringify format
   * @returns {Api response}
  */
  updateSelectedOrderFromAPI(id: string, body: any) {
    return this._http.put<OrderResponse>(`http://swapsteem-api.herokuapp.com/orders/${id}`, body);
  }


  /**
   *
   * @name createReview 
   *
   * @description
   * This method used to add review details
   * @param body review details
   * @returns {Api response}
  */
  createReview(body: any, id?: string): Observable<ReviewRequest> {
    return this._http[id ? 'put' : 'post']<ReviewResponse>(`http://swapsteem-api.herokuapp.com/reviews/${id || ''}`, JSON.stringify(body));
  }

  /**
   *
   * @name getReviews 
   *
   * @description
   * This method used to get review details
   * @param body review details
   * @returns {Api response}
  */
  getReviews(id:string, by_type:string) {
    return this._http.get<[ReviewResponse]>(`http://swapsteem-api.herokuapp.com/reviews/${by_type}/${id || ''}`);
  }

}
