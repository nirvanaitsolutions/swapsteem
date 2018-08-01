import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  constructor(private http : HttpClient){}
  buyDetails : any = [];
  ngOnInit() {
       this.buyDetails = this.http.get('../../assets/sample-buy-online.json');
  }

}
