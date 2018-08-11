import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,} from '@angular/common/http';
import {SteemconnectAuthService} from './../app/steemconnect/services/steemconnect-auth.service'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
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

  getMessages(){
    console.log("Hit service");
    httpOptions.headers = httpOptions.headers.append("Authorization",this.token.access_token);
    return this._http.get("http://swapsteem-api.herokuapp.com/messages",httpOptions);
  }
}
