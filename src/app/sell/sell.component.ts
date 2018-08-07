import { Component, OnInit, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  constructor(private http : HttpClient){}
  
  sellDetails : any = [];
  ngOnInit() {
       this.sellDetails = this.http.get('http://swapsteem-api.herokuapp.com/advertisements');
  }
}
