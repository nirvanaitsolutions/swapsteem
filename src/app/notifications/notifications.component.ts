import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import * as busy from 'busyjs'
import { SteemconnectAuthService } from '../../app/steemconnect/services/steemconnect-auth.service';
import {of} from 'rxjs'
import { Notification } from './../module/notification';


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
   notifications :Notification[] =[] ;
   today: number = Date.now();


  constructor(private auth :SteemconnectAuthService) {
    
  }

  ngOnInit() {

    this.busy.subscribe( function(err, result) {
      if(result.type=='notification'){
        
        let notif:Notification={
          type:'',
          from:'',
          text:'',
          timestamp:0
        };
          notif.type=result.notification.type;
          notif.from=result.notification.follower;
          notif.text="You have a new "+result.notification.type;
          notif.timestamp=result.notification.timestamp;
          //console.log(this.notifications);
          // TODO - Push new notif to array
          //this.notifications.push(notif);
          
      }
      // TODO - Route data to notifications page
      console.log(err, result);

    })

      this.busy.call('get_notifications', [this.token.username], (err, result)=> {
        console.log("Notifications");
        console.log(result);
        result.forEach(element => {
          let notif:Notification={
            type:'',
            from:'',
            text:'',
            timestamp:0
          };
          console.log("element : "+element.type);
          notif.type=element.type;
          notif.from=element.follower;
          notif.text="You have a new "+element.type;
          notif.timestamp=element.timestamp;
          this.notifications.push(notif);

        });
        //this.notifications = result;
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
