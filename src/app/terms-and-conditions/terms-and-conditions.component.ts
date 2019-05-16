import { Component, OnInit, Inject } from '@angular/core';
import { takeWhile } from "rxjs/operators";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SteemconnectAuthService, MongoUserData } from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  private isAlive = true;
  constructor(public ngxService: NgxUiLoaderService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TermsAndConditionsComponent>, public auth: SteemconnectAuthService, private api: APIService) { }

  ngOnInit() {
  }

  onAccept() {
    this.api.setUserData({
      username: this.auth.mongoUserData.username,
      tos_accepted: true
    }, this.data.access_token).pipe(takeWhile(() => this.isAlive)).subscribe((user: MongoUserData) => {
      this.auth.mongoUserData = user;
      this.auth.setAuthState({
        access_token:this.data.access_token,
        username: this.data.username,
        expires_in:this.data.expires_in
      });
      this.ngxService.start();
      this.auth.getUserData().pipe(takeWhile(() => this.isAlive)).subscribe((scAuthService) => {
        this.ngxService.stop();
        if (scAuthService) {
          this.auth.userData = scAuthService;
        }
        this.dialogRef.close();
      })
    });
  }

  logout() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
