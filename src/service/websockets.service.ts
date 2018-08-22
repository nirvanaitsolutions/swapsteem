import { Injectable } from '@angular/core';
import {WebSocketSubject,WebSocketSubjectConfig} from 'rxjs/observable/dom/WebSocketSubject';
import * as busy from 'busyjs'

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  public busy = new busy.Client('wss://api.busy.org');;

  constructor() {
    
    this.busy.call('get_notifications', ['aneilpatel'], function(err, result) {
      console.log(err, result);
    })
    this.busy.call('login', ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBwIiwicHJveHkiOiJzdGVlbWxpbmtlZC5hcHAiLCJ1c2VyIjoiYW5laWxwYXRlbCIsInNjb3BlIjpbImN1c3RvbV9qc29uIl0sImlhdCI6MTUzNDU3OTI0NywiZXhwIjoxNTM1MTg0MDQ3fQ.SskNKp8Uu00oBwfz7nUgtAIwRZX_3N_dux4wDpGhclM'], function(err, result) {
      console.log(err, result);
    })
    this.busy.call( 'subscribe', ['aneilpatel'],function(err, result) {
      console.log(err, result);
    })
    this.busy.subscribe( function(err, result) {
      console.log(err, result);
    })
   }

   getNotifs(){
    
  }
  
}
