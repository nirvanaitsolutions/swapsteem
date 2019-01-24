/**
 *
 * @name order.component
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This component used for view selected order status and perform escrow action by seller/buyer 
 * @requires id order id from url params
 * @requires status status for update after redirect from steemconnect
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReviewRequest } from '../../module/review';
import { APIService } from '../../../service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export interface ReviewDialogData {
  ad_id: string;
  order_id: string;
  createdby: string;
  createdFor: string
}


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  public reviewData: ReviewRequest = {
    createdby: '',
    ad_id: '',
    createdfor: '',
    order_id: '',
    review_score: 1,
    review_text: ''
  }
  constructor(public dialogRef: MatDialogRef<ReviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData, public apiService: APIService, public ngxService: NgxUiLoaderService, ) { }

  ngOnInit() {
  }

  submitReview(form) {
    if (form.valid) {
      this.ngxService.start();
      this.apiService.createReview(Object.assign({}, this.reviewData, this.data)).subscribe((res) => {
        this.ngxService.stop();
        this.dialogRef.close(res);
      })
    }
  }
}
