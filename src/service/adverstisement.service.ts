import { Injectable, OnInit } from '@angular/core';
import { Observable } from '../../node_modules/rxjs';
import { AdvertisementResponse } from '../app/module/advertisement';
import { HttpClient } from '@angular/common/http';
import { filter } from '../../node_modules/rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdverstisementService {
  // Declare All variable for Handling Oservable Filters
  private filterCurrency = new BehaviorSubject<any>('');
  currencyFilter = this.filterCurrency.asObservable();
  private filterAdCoin = new BehaviorSubject<any>('');
  adCoinFilter = this.filterAdCoin.asObservable();
  private filterPaymentMethod = new BehaviorSubject<any>('');
  paymentMethodFilter = this.filterPaymentMethod.asObservable();
  private filterAdType = new BehaviorSubject<any>('');
  adTypeFilter = this.filterAdType.asObservable();
  private _advertisement: Observable<AdvertisementResponse>;
  constructor(private _http: HttpClient) {

  }

  changefilter(ad_type, to, from, payment_methods) {
    // Change Value for all Observable
    this.filterCurrency.next(to);
    this.filterAdCoin.next(from);
    this.filterPaymentMethod.next(payment_methods);
    this.filterAdType.next(ad_type);
  }
  getAdvertisementApi() {
    this._advertisement = this._http.get<AdvertisementResponse>(`${environment.API_URL}/listings/`)
  }

  getAdvertisement(): Observable<AdvertisementResponse> {
    return this._advertisement;
  }


  filter(amount: string,
    paymentCurrency: string,
    market: string,
    paymentMethod: string) {

    if (amount != '') {
      this._advertisement.pipe(
        filter(data => data.ad_coin_amount == parseInt(amount))
      )
    }
    if (paymentCurrency != '') {
      this._advertisement.pipe(
        filter(data => data.from == paymentCurrency)
      )
    }
    if (market != '') {
      this._advertisement.pipe(
        filter(data => data.market == market)
      )
    }
    console.log()
  }
}
