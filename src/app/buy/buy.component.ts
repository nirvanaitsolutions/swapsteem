import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {take, tap} from 'rxjs/operators';
import {pipe, Observable} from 'rxjs';
import {buy} from '../module/buy';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  constructor(private http : HttpClient){}
  buyDetails ;
  ngOnInit() {
    this.buyDetails =  this.http.get<buy>('../../assets/sample-buy-online.json');
  }

}
