import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APIService} from '../../service/api.service';
import { Router } from '@angular/router';
import { AdvertisementResponse } from '../module/advertisement';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  constructor(private http : HttpClient,
               private purchaseSer : APIService,
               private router : Router){}
  
  sellDetails : Observable<AdvertisementResponse> ;
  
  ngOnInit() {
    this.sellDetails = this.purchaseSer.getSellAds();
       //this.sellDetails = this.http.get<AdvertisementResponse>('http://swapsteem-api.herokuapp.com/advertisements');
  }

  sellTrade(trade: AdvertisementResponse){
    this.purchaseSer.selectTradeEvent(trade);
    this.router.navigate(['purchase']);
  }
}
