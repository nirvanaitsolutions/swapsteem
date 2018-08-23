import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import * as busy from 'busyjs'
import { SteemconnectAuthService } from '../../app/steemconnect/services/steemconnect-auth.service';
import {of} from 'rxjs'


export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  username: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  
  public busy = new busy.Client('wss://api.busy.org');
   token:OAuth2Token = this.auth.token;
   notifications :any = ['ayush', 'Agrawal'];
   today: number = Date.now();


  constructor(private auth :SteemconnectAuthService) {
    this.busy.subscribe( function(err, result) {
      // TODO - Route data to notifications page
      console.log(err, result);
    })
  }

  ngOnInit() {
      this.busy.call('get_notifications', [this.token.username], (err, result)=> {
        console.log("Notifications");
        console.log(result);
        this.notifications = result;
      })

      this.busy.call('login', [this.token.access_token], function(err, result) {
       console.log(err, result);
      })

      this.busy.call( 'subscribe', [this.token.username],function(err, result) {
        console.log(err, result);
      })
      this.busy.call('get_messages', [this.token.access_token,"0"], function(err, result) {
       console.log(err, result);
      })
  }

}
