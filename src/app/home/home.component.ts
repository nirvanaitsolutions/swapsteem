import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeWhile } from "rxjs/operators";
import { APIService } from '../../service/api.service';
import { ChartComponent } from '../chart/chart.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedFrom = 'STEEM';
  isAlive = true;
  coinsByMarket = {};
  selectedMarket = 'CRYPTO';
  selectedCoin = '';
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private route: ActivatedRoute, private api: APIService) {
    this.coinsByMarket = this.api.coinsByMarket;
    route.params.pipe(takeWhile(() => this.isAlive)).subscribe(val => {
      this.selectedMarket = val.market ? ['FIAT'].includes(val.market.toUpperCase()) ? val.market.toUpperCase() : 'FIAT' : 'FIAT';
    });
    route.queryParams.pipe(takeWhile(() => this.isAlive)).subscribe(val => {
      this.selectedFrom = val.from ? val.from : 'STEEM';
      this.selectedCoin = val.coin ? val.coin : this.coinsByMarket[this.selectedMarket][0].value;
    });
  }

  ngOnInit() {
  }
  updateQuery(from, coin) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          from,
          coin,
        },
        queryParamsHandling: "merge", // remove to replace all query params by provided
      });
  }
  ngOnDestroy() {
    this.isAlive = false;
  }
}
