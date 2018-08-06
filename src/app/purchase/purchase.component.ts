import { Component, OnInit } from '@angular/core';
import {buy} from '../module/buy';
import {PurchaseService} from '../../service/purchase.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {


  selectedTrade : buy;
  
  constructor(private purchaseServ : PurchaseService) { }

  ngOnInit() {
    this.selectedTrade = this.purchaseServ.getSelectedTrade();
  }

}
