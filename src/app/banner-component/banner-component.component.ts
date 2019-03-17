import { Component, OnInit } from '@angular/core';
import { takeWhile } from "rxjs/operators";
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
  constructor(private _apiService: APIService,) { }

  ngOnInit() {
    this._apiService.getPrice().pipe(takeWhile(() => this.isAlive)).subscribe(data => {
      console.log(data);
      this.price = data;
    });
  }
  ngOnDestroy() {
    this.isAlive = false;
  }

}
