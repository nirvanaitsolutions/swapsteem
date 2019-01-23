/**
 *
 * @name order.component
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This component used for view selected order status and perform escrow action by seller/buyer 
 * @requires id order id from url params
 * @requires status status for update after redirect from steemconnect
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
