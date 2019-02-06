import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AdvertisementResponse, AdvertisementRequest } from '../app/module/advertisement';
import { SteemconnectAuthService, MongoUserData } from '../app/steemconnect/services/steemconnect-auth.service'
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
export interface UserData {
  user: string;
  _id: string;
  name: string;
  account: Account;
  scope: string[];
  user_metadata: Object;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private _http: HttpClient, private auth: SteemconnectAuthService) {

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
    return this._http.post<OrderRequest>("https://swapsteem-api.herokuapp.com/orders", JSON.stringify(order));

  }

  createMessage(message: MessageRequest): Observable<MessageRequest> {
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    console.log(JSON.stringify(message));
    return this._http.post<MessageRequest>("https://swapsteem-api.herokuapp.com/messages", JSON.stringify(message));

  }

  createAd(ad: AdvertisementRequest, id?: string): Observable<AdvertisementRequest> {
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    console.log(JSON.stringify(ad));
    return this._http[id ? 'put' : 'post']<AdvertisementRequest>(`https://swapsteem-api.herokuapp.com/listings/${id || ''}`, JSON.stringify(ad));

  }

  getBuyAds() {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    return this._http.get<AdvertisementResponse[]>("https://swapsteem-api.herokuapp.com/listings/sell", { headers: headers });
  }

  getAdsByUser(user: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<AdvertisementResponse[]>("https://swapsteem-api.herokuapp.com/listings/by_user/" + user);
  }
  getUser(user: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get("https://swapsteem-api.herokuapp.com/users/" + user);
  }
  setUserData(user: MongoUserData, access_token: string): Observable<MongoUserData> {
    console.log(user);
    const headers = new HttpHeaders({ 'No-Auth': 'True', 'Authorization': access_token, 'Content-Type':  'application/json' });
    return this._http.post<MongoUserData>('https://swapsteem-api.herokuapp.com/users/', JSON.stringify(user), {headers});
  }
  getOpenOrdersForUser(user: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<OrderResponse[]>("https://swapsteem-api.herokuapp.com/orders/by_reciever/" + user);
  }

  getOpenOrdersByUser(user: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get<OrderResponse[]>("https://swapsteem-api.herokuapp.com/orders/by_creator/" + user);
  }

  getSellAds() {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    return this._http.get<AdvertisementResponse[]>("https://swapsteem-api.herokuapp.com/listings/buy", { headers: headers });
  }

  getPrice() {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    //return this._http.get<AdvertisementResponse[]>("https://swapsteem-api.herokuapp.com/price/"+coin);
    return this._http.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=,STEEM,SBD*&tsyms=USD,INR,KRW", { headers: headers }).map(result => this.result = result);
  }

  getPriceByPair(coin: string, fiat: string) {
    //httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    const headers = new HttpHeaders({ 'No-Auth': 'True' });
    if (coin == "SBD") {
      coin = 'SBD*'
    }
    //return this._http.get<AdvertisementResponse[]>("https://swapsteem-api.herokuapp.com/price/"+coin);
    return this._http.get('https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=' + fiat, { headers: headers }).map(result => this.result = result);
  }

  getSelectedTrade() {
    return this.selectedTrade;
  }

  getSelectedAd() {
    return this.selectedAd;
  }

  getSelectedTradeFromAPI(id: string) {
    return this._http.get<AdvertisementResponse>("https://swapsteem-api.herokuapp.com/listings/" + id);
  }

  getSelectedOrderFromAPI(id: string) {
    return this._http.get<OrderResponse>("https://swapsteem-api.herokuapp.com/orders/" + id);
  }

  deleteAd(id: string): Observable<AdvertisementRequest> {
    // httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.delete<AdvertisementRequest>(`https://swapsteem-api.herokuapp.com/listings/${id}`);
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
    return this._http.put<AdvertisementRequest>(`https://swapsteem-api.herokuapp.com/listings/${id}`, JSON.stringify({
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
    return this._http.put<OrderResponse>(`https://swapsteem-api.herokuapp.com/orders/${id}`, body);
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
    return this._http[id ? 'put' : 'post']<ReviewResponse>(`https://swapsteem-api.herokuapp.com/reviews/${id || ''}`, JSON.stringify(body));
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
  getReviews(id: string, by_type: string) {
    return this._http.get<[ReviewResponse]>(`https://swapsteem-api.herokuapp.com/reviews/${by_type}/${id || ''}`);
  }

}
