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
  
  sellDetails : Observable<AdvertisementResponse[]> ;
  steemPrice : any;
  sbdPrice:any;
  
  ngOnInit() {
    this.sellDetails = this.purchaseSer.getSellAds();
       //this.sellDetails = this.http.get<AdvertisementResponse>('http://swapsteem-api.herokuapp.com/advertisements');
    this.purchaseSer.getPrice().subscribe( data => {
      let resPrice = Object.values(data);
      let calSteemPrice = Object.values(resPrice[0]);
      let calSBDPrice = Object.values(resPrice[1])
      this.steemPrice = calSteemPrice;
      this.sbdPrice = calSBDPrice;
      
    })
  }
  calculatePrice(from:String,to:String){
    if(from=="STEEM"){
      switch(to){
        case  "USD":
        return this.steemPrice[0];
        case "INR":
        return this.steemPrice[1];
        case "KRW":
        return this.sbdPrice[2];
      }
      
    }
    else if (from=="SBD"){
      switch(to){
        case  "USD":
        return this.sbdPrice[0];
        case "INR":
        return this.sbdPrice[1];
        case "KRW":
        return this.sbdPrice[2];
      }
      
    }
  }

  sellTrade(trade: AdvertisementResponse){
    this.purchaseSer.selectTradeEvent(trade);
    this.router.navigate(['purchase/'+trade._id]);
  }
}
