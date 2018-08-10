import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _http: HttpClient) { }

  getMessages(){
    console.log("Hit service");
    return this._http.get("http://swapsteem-api.herokuapp.com/messages");
  }
}
