import { Injectable } from '@angular/core';
import {HttpClient,} from '@angular/common/http';
import {SteemconnectAuthService} from '../app/steemconnect/services/steemconnect-auth.service';
import { MessageResponse } from '../app/module/message';
import { environment } from '../environments/environment';

export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
 

  constructor(private _http: HttpClient,private auth :SteemconnectAuthService) {
    
   }
  
    token:OAuth2Token = this.auth.token;

  getMessages(order_id:string){
    //console.log("Hit service");
    //this.ws.getNotifs(order_id);
    return this._http.get<MessageResponse[]>(`${environment.API_URL}/messages/by_order/${order_id}`);
    //return this.ws.getMessages(order_id)
  }
}
