import { Component, OnInit,NgZone } from '@angular/core';
import {ChatService} from '../../service/chat.service';
import {OrderService} from '../../service/order.service';
import {APIService} from '../../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageRequest,MessageResponse } from '../module/message';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})

export class ChatPageComponent implements OnInit {

  
  constructor(private _chatService: ChatService,
              private _orderService: OrderService,
              private _apiSer: APIService,
              private router : Router,
              private zone : NgZone,
              private route: ActivatedRoute) { 
  }

  messages:Observable<MessageResponse[]>;
  newMessage;
  selectedAd;
  selectedOrder;
  token;
  escrowid;
  isSender=false;
  sender;
  reciever;
  agent='swapsteem';
  fee:0.001;
  rDeadline;
  eDeadline;
  steemAmount=0;
  sbdAmount=0 ;

  message: MessageRequest =  {
    ad_id:'',
    createdby:'',
    createdfor:'',
    message_type:'',
    message_text:'',
    order_id:''
  };
  ngOnInit() {

    let id = this.route.snapshot.paramMap.get('id');
    this._apiSer.getSelectedOrderFromAPI(id).subscribe(data=>{
      this.selectedOrder=data;
      //this.selectedOrder.order_sbd_amount=data.order_sbd_amount||0.001;
      //this.selectedOrder.order_steem_amount=data.order_steem_amount||0.001;
      console.log("SelectedOrder");
      console.log(this.selectedOrder);
      // milliseconds since Jan 1, 1970, 00:00:00.000 GMT
      if(this.selectedOrder.createdby==this.token.username && this.selectedOrder.order_type =='buy'){
        this.sender=this.selectedOrder.createdfor;
        this.reciever=this.selectedOrder.createdby;
        this.isSender=false;
      }
      else if (this.selectedOrder.createdby==this.token.username && this.selectedOrder.order_type =='sell'){
        this.sender=this.selectedOrder.createdby;
        this.reciever=this.selectedOrder.createdfor;
        this.isSender=true;
      }
      else if (this.selectedOrder.createdfor==this.token.username && this.selectedOrder.order_type =='buy'){
        this.sender=this.selectedOrder.createdfor;
        this.reciever=this.selectedOrder.createdby;
        this.isSender=true;
      }
      else if (this.selectedOrder.createdfor==this.token.username && this.selectedOrder.order_type =='sell'){
        this.sender=this.selectedOrder.createdby;
        this.reciever=this.selectedOrder.createdfor;
        this.isSender=false;
      }
      console.log("sender : ",this.sender);
        console.log("reciever : ",this.reciever);
        console.log("isSender : ",this.isSender);
        if (this.selectedOrder.order_coin =="STEEM"){
          this.steemAmount=this.selectedOrder.order_coin_amount;
        }
        else if(this.selectedOrder.order_coin =="SBD"){
          this.sbdAmount=this.selectedOrder.order_coin_amount;
        }
      this._apiSer.getSelectedTradeFromAPI(this.selectedOrder.ad_id).subscribe(res=>{
        this.selectedAd=res;
        console.log("SelectedAd");
        console.log(this.selectedAd);
      });
    });
    this.token = this._chatService.token;
    this.messages=this._chatService.getMessages(id);
    console.log(this.message);
  }

  sendMessage(){
    
    this.message.ad_id=this.selectedAd._id;    
    this.message.order_id=this.selectedOrder._id;    
    this.message.createdby=this.token.username;    
    this.message.message_text=this.newMessage;    
    this.message.message_type='message';    
    console.log(this.message);
    this._apiSer.createMessage(this.message).subscribe(res => {
      let id = this.route.snapshot.paramMap.get('id');
      this.messages=this._chatService.getMessages(id);
      this.newMessage = "";
    }
    );
    
  }

  transferEscrow(){
    let now = new Date();
    this.rDeadline= now.setHours(now.getHours()+2);
    let temprDeadline= new Date(this.rDeadline);
    this.rDeadline=temprDeadline.toISOString();
    this.eDeadline=now.setDate(now.getDate()+3);
    let tempeDeadline= new Date(this.eDeadline);
    this.eDeadline=tempeDeadline.toISOString();
    
    
    window.location.href = 'https://steemconnect.com/sign/escrow-transfer?from=' + this.sender + '&to=' + this.reciever + '&agent=' + this.agent + '&escrow_id=' + this.selectedOrder.escrowID + '&sbd_amount=' + this.sbdAmount + '%20SBD&steem_amount=' + this.steemAmount + '%20STEEM&fee=' + 0.001 + '%20STEEM&ratification_deadline=' + this.rDeadline + '&escrow_expiration=' + this.eDeadline + '&json_meta={"memo":"testing escrow transaction 2334305953"}'    
  }
  releaseEscrow(){
    window.location.href = 'https://steemconnect.com/sign/escrow-release?from=' + this.sender + '&to=' + this.reciever + '&agent=' + this.agent + '&who=' + this.token.username + '&receiver=' + this.sender + '&escrow_id=' + this.selectedOrder.escrowID + '&sbd_amount=' + this.selectedOrder.order_sbd_amount + '%20SBD&steem_amount=' + this.selectedOrder.order_steem_amount + '%20STEEM'
  }
  raiseDispute(){
    window.location.href = 'https://steemconnect.com/sign/escrow-dispute?from=' + this.sender + '&to=' + this.reciever + '&agent=' + this.agent + '&who=' + this.token.username + '&escrow_id=' + this.selectedOrder.escrowID 
  }
  approveEscrow(){
    window.location.href = 'https://steemconnect.com/sign/escrow-approve?from=' + this.sender + '&to=' + this.reciever + '&agent=' + this.agent + '&who=' + this.token.username + '&escrow_id=' + this.selectedOrder.escrowID + '&approve=1'
  }
  rejectEscrow(){
    window.location.href = 'https://steemconnect.com/sign/escrow-approve?from=' + this.sender + '&to=' + this.reciever + '&agent=' + this.agent + '&who=' + this.token.username + '&escrow_id=' + this.selectedOrder.escrowID + '&approve=0'
  }
}
