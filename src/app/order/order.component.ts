import { Component, OnInit, NgZone } from '@angular/core';
import { ChatService } from '../../service/chat.service';
import { APIService } from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';

import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  private selectedOrder: any = {
    order_coin_amount: '',
    order_fiat_amount: '',
    order_status: '',
    escrowID: '',
  };
  private selectedAd: any = {
    terms: '',
    payment_methods: [''],
  };
  private sender: string = '';
  private reciever: string = '';
  private userData: any = '';
  constructor(private _chatService: ChatService, private auth: SteemconnectAuthService,
    private _apiSer: APIService,
    private router: Router,
    private zone: NgZone,
    private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.auth)
    this.auth.getUserData().subscribe(data => {
      this.userData = data;
      const id: string = this.route.snapshot.paramMap.get('id');
      this._apiSer.getSelectedOrderFromAPI(id).subscribe(data => {
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
        });
      });
    });

  }

  transferEscrow() {
    const now = new Date();
    const rDeadline: string = new Date(now.setHours(now.getHours() + 2)).toUTCString();
    const eDeadline: string = new Date(now.setDate(now.getDate() + 3)).toUTCString();
    const steemAmount: number = this.selectedOrder.order_coin == "STEEM" ? this.selectedOrder.order_coin_amount : 0;
    const sbdAmount: number = this.selectedOrder.order_coin == "SVD" ? this.selectedOrder.order_coin_amount : 0;
    const agent: string = 'swapsteem';
    console.log(rDeadline, eDeadline, steemAmount, sbdAmount);
    window.location.href = 'https://steemconnect.com/sign/escrow-transfer?from=' + this.sender + '&to=' + this.reciever + '&agent=' + agent + '&escrow_id=' + this.selectedOrder.escrowID + '&sbd_amount=' + sbdAmount + '%20SBD&steem_amount=' + steemAmount + '%20STEEM&fee=' + 0.001 + '%20STEEM&ratification_deadline=' + rDeadline + '&escrow_expiration=' + eDeadline + '&json_meta={"memo":"testing escrow transaction 2334305953"}'
  }

  updateOrderStatus(order_status) {
    this._apiSer.updateSelectedOrderFromAPI(this.selectedOrder._id, JSON.stringify({
      order_status
    })).subscribe(() => {
      this.selectedOrder.order_status = 'canceled';
    });
  }
}
