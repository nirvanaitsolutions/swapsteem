import { Component, OnInit } from '@angular/core';
import {Advertisement} from '../module/advertisement';
import {PurchaseService} from '../../service/purchase.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {


  selectedTrade :Advertisement;
  create_order =  {
    coin: '',
    fiat: ''
  };
  
  constructor(private purchaseServ : PurchaseService) { }

  ngOnInit() {
    this.selectedTrade = this.purchaseServ.getSelectedTrade();
  }

  createOrderEvent(form){
    console.log(form);
  }
}
