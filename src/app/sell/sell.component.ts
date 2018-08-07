import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PurchaseService} from '../../service/purchase.service';
import { Router } from '@angular/router';
import { Advertisement } from '../module/advertisement';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  constructor(private http : HttpClient,
               private purchaseSer : PurchaseService,
               private router : Router){}
  
  sellDetails : Observable<Advertisement> ;
  
  ngOnInit() {
       this.sellDetails = this.http.get<Advertisement>('http://swapsteem-api.herokuapp.com/advertisements');
  }

  sellTrade(trade: Advertisement){
    this.purchaseSer.selectTradeEvent(trade);
    this.router.navigate(['purchase']);
  }
}
