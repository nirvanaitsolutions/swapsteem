import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import {
  SteemconnectAuthService, MongoUserData
} from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';
import {
  Router
} from '@angular/router';
import { WhitelistComponent } from '../components/whitelist/whitelist.component';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private scAuthService: SteemconnectAuthService, public dialog: MatDialog, private api: APIService, private router: Router) {

  }

  ngOnInit() {
    console.log('constructor called');
    this.showTermsAndConditionsModal();
  }

  showTermsAndConditionsModal() {
    this.api.setUserData({
      username: this.scAuthService.userData._id
    }).subscribe((user: MongoUserData) => {
      this.scAuthService.mongoUserData = user;
      if (!this.scAuthService.mongoUserData.whitelisted) {
        this.showWhitelistModal();
      } else if (!this.scAuthService.mongoUserData.tos_accepted) {
        const dialogRef = this.dialog.open(TermsAndConditionsComponent, {
          width: '2000px',
          disableClose: true,
        });
      }
      this.router.navigate(['/home']);
    });
  }

  showWhitelistModal() {
    const dialogRef = this.dialog.open(WhitelistComponent, {
      width: '2000px',
      disableClose: true,
    });
  }


}
