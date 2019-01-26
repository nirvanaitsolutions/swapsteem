import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from '../../service/api.service';
import { AdvertisementResponse } from '../module/advertisement';
import { AdverstisementService } from '../../service/adverstisement.service'
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  constructor(private ngxService: NgxUiLoaderService, 
    private purchaseSer: APIService, private adverstisementService: AdverstisementService) { }

  steemPrice: any;
  sbdPrice: any;
  currencyFilter: any = false;
  adCoinFilter: any = false;
  buySteemDisplayedColumns: string[] = ['createdby', 'payment_methods', 'ad_coin', 'currency', 'limits', 'price', 'buttons'];
  buySteemDataSource: MatTableDataSource<AdvertisementResponse> = new MatTableDataSource([]);
  buySteem: Array<AdvertisementResponse> = [];
  @ViewChild('buysteem') buySteemPaginator: MatPaginator;


  ngOnInit() {
    this.ngxService.start();
    forkJoin(this.purchaseSer.getBuyAds(), this.purchaseSer.getPrice())
      .subscribe((data) => {
        this.buySteem = data && data[0] && data[0].length ? data[0] : [];
        this.buySteem = this.buySteem.filter((ad) => (ad.ad_status === 'open'))
        this.buySteemDataSource = new MatTableDataSource(this.buySteem);
        this.buySteemDataSource.paginator = this.buySteemPaginator;
        const resPrice = Object.values(data[1]);
        const calSteemPrice = Object.values(resPrice[0]);
        const calSBDPrice = Object.values(resPrice[1])
        this.steemPrice = calSteemPrice;
        this.sbdPrice = calSBDPrice;
        this.ngxService.stop();
      });

    // Added suscribe for all filter(Observable) for real time data change 
    this.adverstisementService.currencyFilter.subscribe(filter => {
      this.currencyFilter = filter;
      this.updateBuySteemDataSource();
    })
    this.adverstisementService.adCoinFilter.subscribe(filter => {
      this.adCoinFilter = filter;
      this.updateBuySteemDataSource();
    });
  }

  /**
  *
  * @name updateBuySteemDataSource 
  *
  * @description
  * This method update filter advertisement table
  * @requires buySteem open advertisement list
  * @requires currencyFilter filter currency value 
  * @requires adCoinFilter  filter coin value
 */
  updateBuySteemDataSource() {
    let filterBuySteem: Array<AdvertisementResponse> = this.buySteem;
    this.currencyFilter ? filterBuySteem = filterBuySteem.filter((ad) => (ad.currency === this.currencyFilter)) : '';
    this.adCoinFilter ? filterBuySteem = filterBuySteem.filter((ad) => (ad.ad_coin === this.adCoinFilter)) : '';
    this.buySteemDataSource = new MatTableDataSource(filterBuySteem);
    this.buySteemDataSource.paginator = this.buySteemPaginator;
  }

  /**
    *
    * @name calculatePrice 
    *
    * @description
    * This method used to calculate price using advertisement margin
    * @param from advertisement coin value
    * @param to advertisement currency value
    * @param margin advertisement margin value
    * @requires steemPrice steem price value for different currency
    * @requires sbdPrice sbd price value for different currency
   */
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
          return Math.round(this.sbdPrice[2] * (1 + margin / 100) * 100) / 100;
      }

    }
  }
}
