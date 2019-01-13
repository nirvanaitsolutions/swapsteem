import { Injectable, OnInit } from '@angular/core';
import { Observable } from '../../node_modules/rxjs';
import {AdvertisementResponse} from '../app/module/advertisement';
import {HttpClient} from '@angular/common/http';
import { filter } from '../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdverstisementService {

  private _advertisement : Observable<AdvertisementResponse>;
  constructor(private _http : HttpClient) {
  }


  getAdvertisementApi(){
    this._advertisement = this._http.get<AdvertisementResponse>('http://swapsteem-api.herokuapp.com/listings')
  }

  getAdvertisement(): Observable<AdvertisementResponse>{
   return this._advertisement;
  }


  filter(amount:string,
          paymentCurrency: string,
          location: string,
          paymentMethod:string){

            if(amount != ''){
              this._advertisement.pipe(
                filter(data => data.ad_coin_amount == parseInt(amount))
              )
            }
            if(paymentCurrency != ''){
              this._advertisement.pipe(
                filter(data => data.ad_coin == paymentCurrency)
              )
            }
            if(location != ''){
              this._advertisement.pipe(
                filter(data => data.country == location)
              )
            }
  }
}
