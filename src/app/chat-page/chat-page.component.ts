import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../service/chat.service';
import {OrderService} from '../../service/order.service';
import {APIService} from '../../service/api.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})

export class ChatPageComponent implements OnInit {

  
  constructor(private _chatService: ChatService,
              private _orderService: OrderService,
              private _apiSer: APIService) { 
  }

  messages;
  newMessage;
  selectedAd;
  
  ngOnInit() {
    this.selectedAd = this._apiSer.getSelectedTrade();
    console.log("SelectedAd");
    console.log(this.selectedAd);
    //this.selectedOrder = this._orderService.getSelectedOrder();
    //console.log(this.selectedOrder);
    this.messages =  this._chatService.getMessages();
  
  }

  sendMessage(){
    console.log(this.newMessage);
    this.newMessage = "";
  }
}
