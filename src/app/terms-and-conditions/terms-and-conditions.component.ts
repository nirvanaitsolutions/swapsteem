import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SteemconnectAuthService, MongoUserData } from '../steemconnect/services/steemconnect-auth.service';
import { APIService  } from '../../service/api.service'
@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TermsAndConditionsComponent>,  public auth: SteemconnectAuthService, private api: APIService) { }

  ngOnInit() {
  }

  onAccept() {
    this.api.setUserData({
      username: this.auth.mongoUserData.username,
      tos_accepted: true
    }).subscribe((user:MongoUserData)=>{
      this.auth.mongoUserData = user;
      this.dialogRef.close();
    });
  }

  logout() {
    this.auth.logout();
    this.dialogRef.close();
  }

}
