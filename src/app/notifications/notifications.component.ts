import { Component, OnInit } from '@angular/core';
import { takeWhile } from "rxjs/operators";
import * as busy from 'busyjs'
import { SteemconnectAuthService } from '../../app/steemconnect/services/steemconnect-auth.service';
import { Notification } from './../module/notification';
import { NgxUiLoaderService } from 'ngx-ui-loader';

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
  token: OAuth2Token = this.auth.token;
  notifications: Notification[] = [];
  today: number = Date.now();
  private isAlive = true;

  constructor(private ngxService: NgxUiLoaderService, private auth: SteemconnectAuthService) {

  }

  ngOnInit() {
    this.ngxService.start();
    this.busy.pipe(takeWhile(() => this.isAlive)).subscribe((err, result) => {
      if (result.type == 'notification') {

        let notif: Notification = {
          type: '',
          from: '',
          text: '',
          timestamp: 0
        };
        notif.type = result.notification.type;
        notif.from = result.notification.follower;
        notif.text = "You have a new " + result.notification.type;
        notif.timestamp = result.notification.timestamp;
        // TODO - Push new notif to array
        //this.notifications.push(notif);

      }
      // TODO - Route data to notifications page
      
    })

    this.busy.call('get_notifications', [this.token.username], (err, result) => {
      this.ngxService.stop();
      result.forEach(element => {
        let notif: Notification = {
          type: '',
          from: '',
          text: '',
          timestamp: 0
        };
        notif.type = element.type;
        notif.from = element.follower;
        notif.text = "You have a new " + element.type;
        notif.timestamp = element.timestamp;
        this.notifications.push(notif);

      });
      //this.notifications = result;
    })

    this.busy.call('login', [this.token.access_token], function (err, result) {
    })

    this.busy.call('subscribe', [this.token.username], function (err, result) {
    })
    this.busy.call('get_messages', [this.token.access_token, "0"], function (err, result) {
    })
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}
