import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
//import {take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {PurchaseService} from '../../service/purchase.service';
import { Router } from '../../../node_modules/@angular/router';
import {Advertisement} from '../module/advertisement';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  constructor(private http : HttpClient,
               private purchaseSer : PurchaseService,
               private router : Router){}
  
  buyDetails : Observable<Advertisement> ;
  
  ngOnInit() {
    this.buyDetails =  this.http.get<Advertisement>('http://swapsteem-api.herokuapp.com/advertisements');
    //this.buyDetails =  this.http.get<Advertisement>('../../assets/sample-buy-online.json');

    console.log("Advertisement"+ this.buyDetails);
  }

  buyTrade(trade: Advertisement){
    this.purchaseSer.selectTradeEvent(trade);
    console.log(trade);
    this.router.navigate(['purchase']);
  }
}
