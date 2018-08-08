import { Injectable } from '@angular/core';
import { AdvertisementResponse } from '../app/module/advertisement';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor() { }

  selectedTrade : AdvertisementResponse = null;

  selectTradeEvent(trade: AdvertisementResponse){
    this.selectedTrade = trade;
  }

  getSelectedTrade(){
    return this.selectedTrade;
  }

}
