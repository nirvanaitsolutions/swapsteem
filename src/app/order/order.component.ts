/**
 *
 * @name order.component
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This component used for view selected order status and perform escrow action by seller/buyer 
 * @requires id order id from url params
 * @requires status status for update after redirect from steemconnect
 */

import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ChatService } from '../../service/chat.service';
import { APIService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material';
import { ReviewComponent } from '../components/review/review.component';
import { forkJoin } from 'rxjs';
import { ReviewResponse } from '../module/review';
import { CountdownComponent } from 'ngx-countdown';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public selectedOrder: any = {
    order_coin_amount: '',
    order_fiat_amount: '',
    order_status: '',
    escrowID: '',
    escrow_rat_deadline: '',
    escrow_exp_deadline: ''
  };
  public selectedAd: any = {
    terms: '',
    payment_methods: [''],
  };
  public sender: string = '';
  public reciever: string = '';
  public userData: any = '';
  public agent: string = 'swapsteem';
  public reviews: Array<ReviewResponse> = [];
  public rDeadline = moment().add(2, "hours");
  public eDeadline = moment().add(3, 'days');
  public progressBarStatus: number = 0;
  public payment_details: {
    account_holder_name: string;
    account_number: number;
    bank_name: string;
    bank_address?: string;
    swift_bic_code?: string;
    bank_code: string;
  } = {
      account_holder_name: '',
      account_number: 0,
      bank_name: '',
      bank_address: '',
      swift_bic_code: '',
      bank_code: '',
    }
  @ViewChild('transfercountdown') transferCountdown: CountdownComponent;
  @ViewChild('relesecountdown') releseCountdown: CountdownComponent;
  constructor(public ngxService: NgxUiLoaderService, public _chatService: ChatService, public auth: SteemconnectAuthService,
    public _apiSer: APIService,
    public router: Router,
    public zone: NgZone,
    public route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    this.ngxService.start();
    this.userData = this.auth.userData;
    const id: string = this.route.snapshot.paramMap.get('id');
    const status = this.route.snapshot.queryParams["status"];
    this.selectedOrder = {
      _id: id
    }
    if (['escrow_transfer', 'escrow_approve', 'escrow_reject', 'escrow_release', 'agent_escrow_approved', 'buyer_escrow_dispute', 'seller_escrow_dispute'].indexOf(status) > -1) {
      this.updateOrderStatus(status, true);
      return;
    }
    this._apiSer.getSelectedOrderFromAPI(id).subscribe(data => this.zone.run(() => {
      this.selectedOrder = data;
      this.selectedOrder.escrow_rat_deadline ? this.rDeadline = moment(this.selectedOrder.escrow_rat_deadline) : '';
      this.selectedOrder.escrow_exp_deadline ? this.eDeadline = moment(this.selectedOrder.escrow_exp_deadline) : '';
      if(this.selectedOrder.order_type === 'sell' && this.selectedOrder.payment_details) {
        this.payment_details = this.selectedOrder.payment_details;
      }
      this.updateProgressBarStatus(this.selectedOrder.order_status);
      if (data.order_type === 'buy') {
        this.sender = data.createdfor;
        this.reciever = data.createdby;
      } else if (data.order_type === 'sell') {
        this.sender = data.createdby;
        this.reciever = data.createdfor
      }
      console.log(this.selectedOrder, this.userData);
      forkJoin(this._apiSer.getSelectedTradeFromAPI(this.selectedOrder.ad_id), this._apiSer.getReviews(this.selectedOrder._id, 'by_order'))
        .subscribe(res => {
          this.selectedAd = res[0] || {
            terms: '',
            payment_methods: [''],
          };
          console.log(this.selectedAd)
          if(this.selectedAd.ad_type === 'SELL' && this.selectedAd.payment_details) {
            this.payment_details = this.selectedAd.payment_details;
            console.log(this.payment_details)
          }
          console.log('  this.selectedAd', this.selectedAd)
          if (res && res[1]) {
            this.reviews = res[1];
            if (this.selectedOrder.order_status === 'escrow_release' && res && res[1] && res[1].findIndex((review) => review.createdby === this.userData._id) === -1) {
              this.openReviewDialog();
            }
          }
          this.ngxService.stop();
        });
    }));

  }
  /**
   *
   * @name transferEscrow 
   *
   * @description
   * This method used to generate escrow-transfer link for transfer escrow from seller to buyer
   * @requires sender Seller username
   * @requires reciever  Buyer username
   * @requires id order id 
   * @requires order_coin coin type STEEM/SBD from order details
   * @requires order_coin_amount coin amount from order details
   * @requires terms Terms from advertisement detail
   * @requires agent agent name
  */

  transferEscrow() {
    const now = moment();
    const rDeadline: string = moment(this.selectedOrder.escrow_rat_deadline).format('YYYY-MM-DDTHH:MM:SS');
    const eDeadline: string = moment(this.selectedOrder.escrow_exp_deadline).format('YYYY-MM-DDTHH:MM:SS');
    const steemAmount: number = this.selectedOrder.order_coin == "STEEM" ? this.selectedOrder.order_coin_amount : 0;
    const sbdAmount: number = this.selectedOrder.order_coin == "SBD" ? this.selectedOrder.order_coin_amount : 0;
    window.location.href = `https://steemconnect.com/sign/escrow-transfer?from=${this.sender}&to=${this.reciever}&agent=${this.agent}&escrow_id=${this.selectedOrder.escrowID}&sbd_amount=${sbdAmount}%20SBD&steem_amount=${steemAmount}%20STEEM&fee=${0.001}%20STEEM&ratification_deadline=${rDeadline}&escrow_expiration=${eDeadline}&json_meta={"terms":"${this.selectedAd.terms}", "order_id": "${this.selectedOrder._id}"}&redirect_uri=${window.location.origin}/order/${this.selectedOrder._id}?status=escrow_transfer&auto_return=1`;
  }

  /**
   *
   * @name approveRejectEscrow 
   *
   * @description
   * This method used to approve/reject escrow-approve link for approve/reject escrow from buyer
   * @requires sender Buyer username
   * @requires reciever  Seller username
   * @requires id order id 
   * @requires userData logged in user detail
   * @requires order_coin_amount coin amount from order details
   * @requires terms Terms from advertisement detail
   * @requires agent agent name
  */

  approveRejectEscrow(approve: number) {
    window.location.href = `https://steemconnect.com/sign/escrow-approve?from=${this.sender}&to=${this.reciever}&agent=${this.agent}&who=${this.userData._id}&escrow_id=${this.selectedOrder.escrowID}&approve=${approve}&json_meta={"terms":"${this.selectedAd.terms}", "order_id": "${this.selectedOrder._id}"}&redirect_uri=${window.location.origin}/order/${this.selectedOrder._id}?status=escrow_${approve ? 'approve' : 'reject'}&auto_return=1`;
  }

  /**
   *
   * @name releaseEscrow 
   *
   * @description
   * This method used to relese escrow-release link for relese escrow from seller
   * @requires sender Seller username
   * @requires reciever  Buyer username
   * @requires id order id 
   * @requires order_coin coin type STEEM/SBD from order details
   * @requires order_coin_amount coin amount from order details
   * @requires terms Terms from advertisement detail
   * @requires agent agent name
  */

  releaseEscrow() {
    const steemAmount: number = this.selectedOrder.order_coin == "STEEM" ? this.selectedOrder.order_coin_amount : 0;
    const sbdAmount: number = this.selectedOrder.order_coin == "SBD" ? this.selectedOrder.order_coin_amount : 0;
    window.location.href = `https://steemconnect.com/sign/escrow-release?from=${this.sender}&to=${this.reciever}&agent=${this.agent}&who=${this.userData._id}&receiver=${this.reciever}&escrow_id=${this.selectedOrder.escrowID}&sbd_amount=${sbdAmount}%20SBD&steem_amount=${steemAmount}%20STEEM&json_meta={"terms":"${this.selectedAd.terms}", "order_id": "${this.selectedOrder._id}"}&redirect_uri=${window.location.origin}/order/${this.selectedOrder._id}?status=escrow_release&auto_return=1`;
  }

  /**
   *
   * @name releaseEscrow 
   *
   * @description
   * This method used to relese escrow-release link for relese escrow from seller/buyer
   * @requires sender sender username
   * @requires reciever  reciver username
   * @requires id order id 
   * @requires agent agent name
   * @param disputeType buyer/seller who are raising a dispute
  */
  raiseDispute(disputeType) {
    window.location.href = `https://steemconnect.com/sign/escrow-dispute?from=${this.sender}&to=${this.reciever}&agent=${this.agent}&who=${this.userData._id}&escrow_id=${this.selectedOrder.escrowID}&json_meta={"terms":"${this.selectedAd.terms}", "order_id": "${this.selectedOrder._id}"}&redirect_uri=${window.location.origin}/order/${this.selectedOrder._id}?status=${disputeType}_escrow_dispute&auto_return=1`
  }


  /**
   *
   * @name updateOrderStatus 
   *
   * @description
   * This method used to update order status
   * @param order_status for update
   * @param getAdd A flag for fetch order and advertisement detail 
   * @requires id order id
  */
  updateOrderStatus(order_status: string, getAdd?: boolean) {
    this._apiSer.updateSelectedOrderFromAPI(this.selectedOrder._id, JSON.stringify({
      order_status
    })).subscribe((data) => this.zone.run(() => {
      this.selectedOrder = data;
      this.selectedOrder.order_status = order_status;
      this.selectedOrder.escrow_rat_deadline ? this.rDeadline = moment(this.selectedOrder.escrow_rat_deadline) : '';
      this.selectedOrder.escrow_exp_deadline ? this.eDeadline = moment(this.selectedOrder.escrow_exp_deadline) : '';
      if(this.selectedOrder.order_type === 'sell' && this.selectedOrder.payment_details) {
        this.payment_details = this.selectedOrder.payment_details;
      }
      this.updateProgressBarStatus(this.selectedOrder.order_status);
      if (data.order_type === 'buy') {
        this.sender = data.createdfor;
        this.reciever = data.createdby;
      } else if (data.order_type === 'sell') {
        this.sender = data.createdby;
        this.reciever = data.createdfor
      }
      if (getAdd) {
        forkJoin(this._apiSer.getSelectedTradeFromAPI(this.selectedOrder.ad_id), this._apiSer.getReviews(this.selectedOrder._id, 'by_order'))
          .subscribe(res => {
            this.selectedAd = res[0] || {
              terms: '',
              payment_methods: [''],
            };
            if(this.selectedAd.ad_type === 'SELL' && this.selectedAd.payment_details) {
              this.payment_details = this.selectedAd.payment_details;
            }
            if (res && res[1]) {
              this.reviews = res[1];
              if (this.selectedOrder.order_status === 'escrow_release' && res && res[1] && res[1].findIndex((review) => review.createdby === this.userData._id) === -1) {
                this.openReviewDialog();
              }
            }

            this.router.navigate([`/order/${this.selectedOrder._id}`], {
              queryParams: {
                status: ''
              }
            });
            this.ngxService.stop();
          });
      }
    }));
  }

  /**
    *
    * @name openReviewDialog 
    *
    * @description
    * This method used to open review component in modal
   */

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(ReviewComponent, {
      width: '300px',
      disableClose: true,
      data: {
        ad_id: this.selectedAd._id,
        order_id: this.selectedOrder._id,
        createdby: this.userData._id,
        createdFor: this.reciever
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reviews.push(result);
      if (result && result._id && this.reviews.findIndex((review) => review.createdby === this.reciever) > -1 && this.reviews.findIndex((review) => review.createdby === this.sender) > -1)
        this.updateOrderStatus('order_complete', true);
    });
  }
  /**
   *
   * @name openReviewDialog 
   *
   * @description
   * This method used to open review component in modal
   * @param countdownInstance countdown timer instance
  */
  onFinished(countdownInstance) {
    console.log('countdownInstance', countdownInstance);
    if (this.selectedOrder._id && this.selectedOrder.order_status !== 'canceled') {
      this.updateOrderStatus('canceled');
    }
  }
  /**
   *
   * @name updateProgressBarStatus 
   *
   * @description
   * This method used update progress bar status according to order status
   * @param order_status order status
  */
  updateProgressBarStatus(order_status) {
    switch (order_status) {
      case 'created':
        this.progressBarStatus = 0;
        break;
      case 'escrow_transfer':
        this.progressBarStatus = 20;
        break;
      case 'escrow_approve':
        this.progressBarStatus = 40;
        break;
      case 'agent_escrow_approved':
        this.progressBarStatus = 50;
        break;
      case 'buyer_escrow_dispute':
        this.progressBarStatus = 60;
        break;
      case 'seller_escrow_dispute':
        this.progressBarStatus = 60;
        break;
      case 'buyer_payment_done':
        this.progressBarStatus = 60;
        break;
      case 'escrow_release':
        this.progressBarStatus = 80;
        break;
      case 'escrow_reject':
        this.progressBarStatus = 100;
        break;
      case 'order_complete':
        this.progressBarStatus = 100;
        break;
      case 'canceled':
        this.progressBarStatus = 100;
        break;
      default:
        this.progressBarStatus = 0;
        break;
    }
  }
}
