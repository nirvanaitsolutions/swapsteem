import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import {
  SteemconnectAuthService, MongoUserData
} from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import { WhitelistComponent } from '../components/whitelist/whitelist.component';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private scAuthService: SteemconnectAuthService, public dialog: MatDialog, private api: APIService, private router: Router) {

  }

  ngOnInit() {
    console.log('constructor called');
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params)
      this.showTermsAndConditionsModal({
        username: params['username'],
        access_token: params['access_token'],
        expires_in: params['expires_in']
      });
    });
  }
  /**
  *
  * @name showTermsAndConditionsModal 
  *
  * @description
  * This method used to open terms and condition modal
 */
  showTermsAndConditionsModal(userInfo) {
    this.api.setUserData({
      username: userInfo.username
    }, userInfo.access_token).subscribe((user: MongoUserData) => {
      this.scAuthService.mongoUserData = user;
      if (!this.scAuthService.mongoUserData.whitelisted) {
        this.showWhitelistModal();
      } else if (!this.scAuthService.mongoUserData.tos_accepted) {
        this.dialog.open(TermsAndConditionsComponent, {
          width: '2000px',
          disableClose: true,
          data: userInfo
        });
      }
      this.router.navigate(['/home']);
    });
  }
  /**
  *
  * @name showWhitelistModal 
  *
  * @description
  * This method used to open whitelist modal
 */
  showWhitelistModal() {
    this.dialog.open(WhitelistComponent, {
      width: '450px',
      disableClose: true,
    });
  }


}
