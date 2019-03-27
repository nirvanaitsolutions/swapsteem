import { Component, OnInit } from '@angular/core';
import { takeWhile } from "rxjs/operators";
import { forkJoin } from 'rxjs';
import { each } from 'lodash';
import { APIService } from '../../service/api.service';


@Component({
  selector: 'app-banner-component',
  templateUrl: './banner-component.component.html',
  styleUrls: ['./banner-component.component.css']
})
export class BannerComponentComponent implements OnInit {
  price: any = {
    steem: {
      usd: ''
    },
    'steem-dollars': {
      usd: ''
    }
  };
  private isAlive = true;
  constructor(private _apiService: APIService, ) { }

  ngOnInit() {
    forkJoin(this._apiService.getPrice(), this._apiService.getBtcPrice())
      .pipe(takeWhile(() => this.isAlive)).subscribe((data:any) => {
        console.log(data)
        each(data[1].bitcoin, (value, key)=> {
          data[0].steem[key] = value *  data[0].steem.btc;
          data[0]['steem-dollars'][key] = value *  data[0]['steem-dollars'].btc;
        });
        this.price = data[0];
        console.log(this.price)
      });
  }
  ngOnDestroy() {
    this.isAlive = false;
  }

}
