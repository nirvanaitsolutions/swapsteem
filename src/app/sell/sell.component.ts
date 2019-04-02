import { Component, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from "rxjs/operators";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { forkJoin } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { each } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../../service/api.service';
import { AdvertisementResponse } from '../module/advertisement';
import { AdverstisementService } from '../../service/adverstisement.service'

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  private isAlive = true;
  constructor(private ngxService: NgxUiLoaderService,
    private purchaseSer: APIService, private adverstisementService: AdverstisementService, private route: ActivatedRoute) {
    route.params.pipe(takeWhile(() => this.isAlive)).subscribe(val => {
      const market = val.market ?  ['FIAT', 'CRYPTO', 'TOKEN','ERC20','EOS', 'TRC20', 'BTS-UIA'].includes(val.market.toUpperCase()) ? val.market.toUpperCase() : 'CRYPTO' : 'CRYPTO';
      this.fetchSellSteem(market);
    });
  }

  steemPrice: any;
  sbdPrice: any;
  currencyFilter: any = false;
  adCoinFilter: any = false;
  sellSteemDisplayedColumns: string[] = ['createdby', 'payment_method', 'from', 'to', 'price', 'buttons'];
  sellSteemDataSource: MatTableDataSource<AdvertisementResponse> = new MatTableDataSource([]);
  sellSteem: Array<AdvertisementResponse> = [];
  @ViewChild('sellsteem') sellSteemPaginator: MatPaginator;

  ngOnInit() {

  }

  /**
 *
 * @name fetchSellSteem 
 *
 * @description
 * This method update filter advertisement table
 * @param market market filter value
*/
  fetchSellSteem(market = 'CRYPTO') {
    this.ngxService.start();
    forkJoin(this.purchaseSer.getSellAds(), this.purchaseSer.getPrice(), this.purchaseSer.getBtcPrice())
    .pipe(takeWhile(() => this.isAlive)).subscribe((data:any) => {
        this.sellSteem = data && data[0] && data[0].length ? data[0] : [];
        this.sellSteem = this.sellSteem.filter((ad) => (ad.ad_status === 'open' && ad.market === market))
        this.sellSteemDataSource = new MatTableDataSource(this.sellSteem);
        this.sellSteemDataSource.paginator = this.sellSteemPaginator;
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
      this.currencyFilter = filter;
      this.updateSellSteemDataSource();
    })
    this.adverstisementService.adCoinFilter.pipe(takeWhile(() => this.isAlive)).subscribe(filter => {
      this.adCoinFilter = filter;
      this.updateSellSteemDataSource();
    });
  }

  /**
  *
  * @name updateSellSteemDataSource 
  *
  * @description
  * This method update filter advertisement table
  * @requires sellSteem open advertisement list
  * @requires currencyFilter filter to value 
  * @requires adCoinFilter  filter coin value
 */
  updateSellSteemDataSource() {
    let filterSellSteem: Array<AdvertisementResponse> = this.sellSteem;
    this.currencyFilter ? filterSellSteem = filterSellSteem.filter((ad) => (ad.to === this.currencyFilter)) : '';
    this.adCoinFilter ? filterSellSteem = filterSellSteem.filter((ad) => (ad.from === this.adCoinFilter)) : '';
    this.sellSteemDataSource = new MatTableDataSource(filterSellSteem);
    this.sellSteemDataSource.paginator = this.sellSteemPaginator;
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
