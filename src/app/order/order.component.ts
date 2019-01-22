import { Component, OnInit, NgZone } from '@angular/core';
import { ChatService } from '../../service/chat.service';
import { APIService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import * as moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  };
  public selectedAd: any = {
    terms: '',
    payment_methods: [''],
  };
  public sender: string = '';
  public reciever: string = '';
  public userData: any = '';
  public agent: string = 'swapsteem';
  constructor(public ngxService: NgxUiLoaderService, public _chatService: ChatService, public auth: SteemconnectAuthService,
    public _apiSer: APIService,
    public router: Router,
    public zone: NgZone,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.ngxService.start();
    this.auth.getUserData().subscribe(data => {
      this.userData = data;
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
        if (data.order_type === 'buy') {
          this.sender = data.createdfor;
          this.reciever = data.createdby;
        } else if (data.order_type === 'sell') {
          this.sender = data.createdby;
          this.reciever = data.createdfor
        }
        console.log(this.selectedOrder, this.userData);
        this._apiSer.getSelectedTradeFromAPI(this.selectedOrder.ad_id).subscribe(res => {
          this.selectedAd = res;
          console.log(this.selectedAd);
          this.ngxService.stop();
        });
      }));
    });

  }

  transferEscrow() {
    const now = moment();
    const rDeadline: string = now.add(2, 'hours').format('YYYY-MM-DDTHH:MM:SS');
    const eDeadline: string = now.add(3, 'days').format('YYYY-MM-DDTHH:MM:SS');
    const steemAmount: number = this.selectedOrder.order_coin == "STEEM" ? this.selectedOrder.order_coin_amount : 0;
    const sbdAmount: number = this.selectedOrder.order_coin == "SBD" ? this.selectedOrder.order_coin_amount : 0;
    console.log(rDeadline, eDeadline, steemAmount, sbdAmount);
    window.location.href = `https://steemconnect.com/sign/escrow-transfer?from=${this.sender}&to=${this.reciever}&agent=${this.agent}&escrow_id=${this.selectedOrder.escrowID}&sbd_amount=${sbdAmount}%20SBD&steem_amount=${steemAmount}%20STEEM&fee=${0.001}%20STEEM&ratification_deadline=${rDeadline}&escrow_expiration=${eDeadline}&json_meta={"terms":"${this.selectedAd.terms}", "order_id": "${this.selectedOrder._id}"}&redirect_uri=${window.location.origin}/order/${this.selectedOrder._id}?status=escrow_transfer`;
  }

  approveRejectEscrow(approve: number) {
    window.location.href = `https://steemconnect.com/sign/escrow-approve?from=${this.sender}&to=${this.reciever}&agent=${this.agent}&who=${this.userData._id}&escrow_id=${this.selectedOrder.escrowID}&approve=${approve}&json_meta={"terms":"${this.selectedAd.terms}", "order_id": "${this.selectedOrder._id}"}&redirect_uri=${window.location.origin}/order/${this.selectedOrder._id}?status=escrow_${approve ? 'approve' : 'reject'}`;
  }

  releaseEscrow() {
    const steemAmount: number = this.selectedOrder.order_coin == "STEEM" ? this.selectedOrder.order_coin_amount : 0;
    const sbdAmount: number = this.selectedOrder.order_coin == "SBD" ? this.selectedOrder.order_coin_amount : 0;
    window.location.href = `https://steemconnect.com/sign/escrow-release?from=${this.sender}&to=${this.reciever}&agent=${this.agent}&who=${this.userData._id}&receiver=${this.reciever}&escrow_id=${this.selectedOrder.escrowID}&sbd_amount=${sbdAmount}%20SBD&steem_amount=${steemAmount}%20STEEM&json_meta={"terms":"${this.selectedAd.terms}", "order_id": "${this.selectedOrder._id}"}&redirect_uri=${window.location.origin}/order/${this.selectedOrder._id}?status=escrow_release`;
  }

  raiseDispute(disputeType) {
    window.location.href = `https://steemconnect.com/sign/escrow-dispute?from=${this.sender}&to=${this.reciever}&agent=${this.agent}&who=${this.userData._id}&escrow_id=${this.selectedOrder.escrowID}&json_meta={"terms":"${this.selectedAd.terms}", "order_id": "${this.selectedOrder._id}"}&redirect_uri=${window.location.origin}/order/${this.selectedOrder._id}?status=${disputeType}_escrow_dispute`
  }


  updateOrderStatus(order_status: string, getAdd?: boolean) {
    this._apiSer.updateSelectedOrderFromAPI(this.selectedOrder._id, JSON.stringify({
      order_status
    })).subscribe((data) => this.zone.run(() => {
      this.selectedOrder = data;
      this.selectedOrder.order_status = order_status;
      if (data.order_type === 'buy') {
        this.sender = data.createdfor;
        this.reciever = data.createdby;
      } else if (data.order_type === 'sell') {
        this.sender = data.createdby;
        this.reciever = data.createdfor
      }
      if (getAdd) {
        this._apiSer.getSelectedTradeFromAPI(this.selectedOrder.ad_id).subscribe(res => {
          this.selectedAd = res;
          console.log(this.selectedAd, 'afjsfhj');
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
}
