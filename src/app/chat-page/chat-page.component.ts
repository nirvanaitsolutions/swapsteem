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
      console.log("SelectedOrder");
    console.log(this.selectedOrder);
    this._apiSer.getSelectedTradeFromAPI(this.selectedOrder.ad_id).subscribe(res=>{
      this.selectedAd=res;
      console.log("SelectedAd");
    console.log(this.selectedAd);

    });
    });
    this.messages=this._chatService.getMessages(id);
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
    let id = this.route.snapshot.paramMap.get('id');
    this.messages=this._chatService.getMessages(id);
    this.newMessage = "";
  }
}
