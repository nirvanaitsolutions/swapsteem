import { Injectable } from '@angular/core';
import {OrderResponse} from '../app/module/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  selectedOrder : OrderResponse ;
  constructor() { }

  setSelectedOrder(order){
    this.selectedOrder = order;
  }

  getSelectedOrder(){
    return this.selectedOrder;
  }
}
