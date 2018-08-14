import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
//import {take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {APIService} from '../../service/api.service';
import { Router } from '@angular/router';
import {AdvertisementResponse} from '../module/advertisement';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  constructor(private http : HttpClient,
               private purchaseSer : APIService,
               private router : Router){}
  
  buyDetails : Observable<AdvertisementResponse[]> ;
  
  ngOnInit() {
    this.buyDetails = this.purchaseSer.getBuyAds();
    //this.buyDetails =  this.http.get<AdvertisementResponse>('http://swapsteem-api.herokuapp.com/advertisements');
    //this.buyDetails =  this.http.get<Advertisement>('../../assets/sample-buy-online.json');
  }

  buyTrade(trade: AdvertisementResponse){
    this.purchaseSer.selectTradeEvent(trade);
    console.log(trade);
    this.router.navigate(['purchase']);
  }
}
