import { Component, OnInit,NgZone } from '@angular/core';
import {ChatService} from '../../service/chat.service';
import {OrderService} from '../../service/order.service';
import {APIService} from '../../service/api.service';
import { Router } from '@angular/router';
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
              private zone : NgZone,) { 
  }

  messages:Observable<MessageResponse[]>;
  newMessage;
  selectedAd;
  selectedOrder;
  message: MessageRequest =  {
    ad_id:'',
    createdby:'',
    createdfor:'',
    message_type:'',
    message_text:'',
    order_id:''
  };
  ngOnInit() {
    this.selectedAd = this._apiSer.getSelectedAd();
    console.log("SelectedAd");
    console.log(this.selectedAd);
    this.selectedOrder = this._orderService.getSelectedOrder();
    console.log("SelectedOrder");
    console.log(this.selectedOrder);
    this.messages=this._chatService.getMessages()
  
  }

  sendMessage(){
    
    this.message.ad_id=this.selectedAd._id;    
    this.message.order_id=this.selectedOrder._id;    
    this.message.createdby=this.selectedOrder.createdby;    
    this.message.createdfor=this.selectedAd.createdby;    
    this.message.message_text=this.newMessage;    
    this.message.message_type='message';    
    console.log(this.message);
    this._apiSer.createMessage(this.message).subscribe(
    );
    this.newMessage = "";
  }
}
