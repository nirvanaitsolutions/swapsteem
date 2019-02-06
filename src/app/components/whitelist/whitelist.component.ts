import { Component, OnInit } from '@angular/core';
import { SteemconnectAuthService } from '../../steemconnect/services/steemconnect-auth.service';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.css']
})
export class WhitelistComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<WhitelistComponent>, public auth: SteemconnectAuthService, ) { }

  ngOnInit() {
  }

  logout() {
    this.dialogRef.close();
  }

}
