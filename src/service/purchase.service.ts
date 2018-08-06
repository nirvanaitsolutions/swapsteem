import { Injectable } from '@angular/core';
import { buy } from '../app/module/buy';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor() { }

  selectedTrade : buy = null;

  selectTradeEvent(trade: buy){
    this.selectedTrade = trade;
  }

  getSelectedTrade(){
    return this.selectedTrade;
  }

}
