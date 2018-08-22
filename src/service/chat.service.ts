import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,} from '@angular/common/http';
import {SteemconnectAuthService} from '../app/steemconnect/services/steemconnect-auth.service'
import { AdvertisementResponse } from '../app/module/advertisement';
import { MessageResponse } from '../app/module/message';
import { WebsocketsService } from './websockets.service';

export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
 

  constructor(private _http: HttpClient,private auth :SteemconnectAuthService,private ws :WebsocketsService) {
    
   }
  
    token:OAuth2Token = this.auth.token;

  getMessages(order_id:string){
    //console.log("Hit service");
    this.ws.getNotifs(order_id);
    return this._http.get<MessageResponse[]>("http://swapsteem-api.herokuapp.com/messages/by_order/"+order_id);
    //return this.ws.getMessages(order_id)
  }
}
