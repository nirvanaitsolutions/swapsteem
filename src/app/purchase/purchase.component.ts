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
  
  constructor(private purchaseServ : PurchaseService) { }

  ngOnInit() {
    this.selectedTrade = this.purchaseServ.getSelectedTrade();
  }

}
