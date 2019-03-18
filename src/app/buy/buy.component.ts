import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from "rxjs/operators";
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { each } from 'lodash';
import { APIService } from '../../service/api.service';
import { AdvertisementResponse } from '../module/advertisement';
import { AdverstisementService } from '../../service/adverstisement.service'



@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  private isAlive = true;
  constructor(private ngxService: NgxUiLoaderService,
    private purchaseSer: APIService, private adverstisementService: AdverstisementService, private route: ActivatedRoute) {
    route.params.pipe(takeWhile(() => this.isAlive)).subscribe(val => {
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
    forkJoin(this.purchaseSer.getBuyAds(), this.purchaseSer.getPrice(), this.purchaseSer.getBtcPrice())
      .pipe(takeWhile(() => this.isAlive)).subscribe((data:any) => {
        this.buySteem = data && data[0] && data[0].length ? data[0] : [];
        this.buySteem = this.buySteem.filter((ad) => (ad.ad_status === 'open' && ad.market === market));
        this.buySteemDataSource = new MatTableDataSource(this.buySteem);
        this.buySteemDataSource.paginator = this.buySteemPaginator;
        each(data[2].bitcoin, (value, key)=> {
          data[1].steem[key] = value *  data[1].steem.btc;
          data[1]['steem-dollars'][key] = value *  data[1]['steem-dollars'].btc;
        });
        this.steemPrice = data[1].steem;
        this.sbdPrice = data[1]['steem-dollars'];
        this.ngxService.stop();
      });

    // Added suscribe for all filter(Observable) for real time data change 
    this.adverstisementService.currencyFilter.pipe(takeWhile(() => this.isAlive)).subscribe(filter => {
      this.toFilter = filter;
      this.updateBuySteemDataSource();
    })
    this.adverstisementService.adCoinFilter.pipe(takeWhile(() => this.isAlive)).subscribe(filter => {
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
    console.log( this.steemPrice)
    if (from == "STEEM") {
      return (this.steemPrice[to.toLowerCase()] || 0) * (1 + margin / 100);
    }
    else if (from == "SBD") {
      return (this.sbdPrice[to.toLowerCase()] || 0) * (1 + margin / 100);
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
