import { Injectable } from '@angular/core';
import { Advertisement } from '../app/module/advertisement';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor() { }

  selectedTrade : Advertisement = null;

  selectTradeEvent(trade: Advertisement){
    this.selectedTrade = trade;
  }

  getSelectedTrade(){
    return this.selectedTrade;
  }

}
