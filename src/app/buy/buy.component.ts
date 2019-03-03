import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private purchaseSer: APIService, private adverstisementService: AdverstisementService, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      const market = val.market ? ['FIAT', 'CRYPTO', 'TOKEN'].includes(val.market.toUpperCase()) ? val.market.toUpperCase() : 'CRYPTO' : 'CRYPTO';
      this.fetchBuySteem(market);
    });
  }

  steemPrice: any;
  sbdPrice: any;
  toFilter: any = false;
  adCoinFilter: any = false;
  buySteemDisplayedColumns: string[] = ['createdby', 'payment_method', 'from', 'to', 'price', 'buttons'];
  buySteemDataSource: MatTableDataSource<AdvertisementResponse> = new MatTableDataSource([]);
  buySteem: Array<AdvertisementResponse> = [];
  @ViewChild('buysteem') buySteemPaginator: MatPaginator;

  ngOnInit() { }
  /**
  *
  * @name fetchBuySteem 
  *
  * @description
  * This method update filter advertisement table
  * @param market market filter value
 */
  fetchBuySteem(market = 'CRYPTO') {
    this.ngxService.start();
    forkJoin(this.purchaseSer.getBuyAds(), this.purchaseSer.getPrice())
      .subscribe((data) => {
        this.buySteem = data && data[0] && data[0].length ? data[0] : [];
        this.buySteem = this.buySteem.filter((ad) => (ad.ad_status === 'open' && ad.market === market));
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
      this.toFilter = filter;
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
  * @requires toFilter filter to value 
  * @requires adCoinFilter  filter coin value
 */
  updateBuySteemDataSource() {
    console.log('this.adCoinFilter', this.adCoinFilter)
    let filterBuySteem: Array<AdvertisementResponse> = this.buySteem;
    this.toFilter ? filterBuySteem = filterBuySteem.filter((ad) => (ad.to === this.toFilter)) : '';
    //this.adCoinFilter ? filterBuySteem = filterBuySteem.filter((ad) => (ad.from === this.adCoinFilter)) : '';
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
    * @param to advertisement to value
    * @param margin advertisement margin value
    * @requires steemPrice steem price value for different to
    * @requires sbdPrice sbd price value for different to
   */
  calculatePrice(from: string, to: string, margin: number) {
    if (from == "STEEM") {
      switch (to) {
        case "USD":
          return this.steemPrice[0] * (1 + margin / 100);
        case "INR":
          return this.steemPrice[1] * (1 + margin / 100);
        case "KRW":
          return this.steemPrice[2] * (1 + margin / 100);
        case "BTC":
          return this.steemPrice[3] * (1 + margin / 100);
        case "EOS":
          return this.steemPrice[4] * (1 + margin / 100);
        case "ETH":
          return this.steemPrice[5] * (1 + margin / 100);
        case "SWEET":
          return (1 + margin / 100);
        case "SUFB":
          return (1 + margin / 100);
        case "ENG":
          return (1 + margin / 100);
        case "VEF":
          return this.steemPrice[6] * (1 + margin / 100);
      }

    }
    else if (from == "SBD") {
      switch (to) {
        case "USD":
          return this.sbdPrice[0] * (1 + margin / 100);
        case "INR":
          return this.sbdPrice[1] * (1 + margin / 100);
        case "KRW":
          return this.sbdPrice[2] * (1 + margin / 100);
        case "BTC":
          return this.sbdPrice[3] * (1 + margin / 100);
        case "EOS":
          return this.sbdPrice[4] * (1 + margin / 100);
        case "ETH":
          return this.sbdPrice[5] * (1 + margin / 100);
        case "ENG":
          return (1 + margin / 100);
        case "SWEET":
          return (1 + margin / 100);
        case "SUFB":
          return (1 + margin / 100);
        case "VEF":
          return this.steemPrice[6] * (1 + margin / 100);
      }

    }
  }
}
