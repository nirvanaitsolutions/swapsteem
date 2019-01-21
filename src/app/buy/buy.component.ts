import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import {take, tap} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { APIService } from '../../service/api.service';
import { Router } from '@angular/router';
import { AdvertisementResponse } from '../module/advertisement';
import { AdverstisementService } from '../../service/adverstisement.service'
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  constructor(private ngxService: NgxUiLoaderService,private http: HttpClient,
    private purchaseSer: APIService,
    private router: Router, private adverstisementService: AdverstisementService) { }

  buyDetails: Observable<AdvertisementResponse[]>;
  steemPrice: any;
  sbdPrice: any;
  currenyFilter: any = ''
  adCoinFilter: any = ''
  paymentMethodFilter: any = '';
  adTypeFilter: any = '';
  totalBuy: any = [];
  emptyBuy: boolean;
  showElement(buySteem) {
    // Hack for show hide data In Table according to filter
    if (this.adTypeFilter && this.adTypeFilter !== 'BUY') {
      return true;
    }
    if (this.currenyFilter && buySteem.currency !== this.currenyFilter) {
      return false;
    }
    if (this.adCoinFilter && buySteem.ad_coin !== this.adCoinFilter) {
      return false;
    }
    if (this.paymentMethodFilter && buySteem.payment_methods.indexOf(this.paymentMethodFilter) === -1) {
      return false;
    }
    return true;
  }
  ngOnInit() {
    this.ngxService.start();
    this.buyDetails = this.purchaseSer.getBuyAds();
    this.buyDetails.subscribe((data) => {
      this.ngxService.stop();
      if(data.length){
        this.emptyBuy = false
      }else{
        this.emptyBuy = true
      }
    })
    //this.buyDetails =  this.http.get<AdvertisementResponse>('http://swapsteem-api.herokuapp.com/advertisements');
    //this.buyDetails =  this.http.get<Advertisement>('../../assets/sample-buy-online.json');
    this.purchaseSer.getPrice().subscribe(data => {
      let resPrice = Object.values(data);
      let calSteemPrice = Object.values(resPrice[0]);
      let calSBDPrice = Object.values(resPrice[1])
      this.steemPrice = calSteemPrice;
      this.sbdPrice = calSBDPrice;
    })
    // Added suscribe for all filter(Observable) for real time data change 
    this.adverstisementService.currenyFilter.subscribe(filter => this.currenyFilter = filter)
    this.adverstisementService.adCoinFilter.subscribe(filter => this.adCoinFilter = filter)
    this.adverstisementService.paymentMethodFilter.subscribe(filter => this.paymentMethodFilter = filter)
    this.adverstisementService.adTypeFilter.subscribe(filter => this.adTypeFilter = filter)
  }
  calculatePrice(from: string, to: string, margin: number) {
    if (from == "STEEM") {
      switch (to) {
        case "USD":
          return Math.round(this.steemPrice[0] * (1 + margin / 100) * 100) / 100;
        case "INR":
          return Math.round(this.steemPrice[1] * (1 + margin / 100) * 100) / 100;
        case "KRW":
          return Math.round(this.steemPrice[2] * (1 + margin / 100) * 100) / 100;
      }

    }
    else if (from == "SBD") {
      switch (to) {
        case "USD":
          return Math.round(this.sbdPrice[0] * (1 + margin / 100) * 100) / 100;
        case "INR":
          return Math.round(this.sbdPrice[1] * (1 + margin / 100) * 100) / 100;
        case "KRW":
          return Math.round(this.steemPrice[2] * (1 + margin / 100) * 100) / 100;
      }

    }
  }

  buyTrade(trade: AdvertisementResponse) {
    //this.purchaseSer.selectTradeEvent(trade);
    //console.log(trade);
    this.router.navigate(['purchase/' + trade._id]);
  }
}
