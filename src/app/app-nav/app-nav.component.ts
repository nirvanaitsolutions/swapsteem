import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeWhile } from "rxjs/operators";
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';
@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent implements OnInit {
  loginTooltipInfo: string = `Users need to have a Steem account to be able to trade on swapSteem. Please click "Sign Up" button to create a new steem account if you don't have one already. 
  `;
  SignUpTooltipInfo: string = `Users need to have a Steem account to be able to trade on swapSteem. Please click "Log In" button if you already have a Steem account. 
  Note : Account creation fee = $2.50`;

  userData: any = {};
  profile: any = {};
  profile_url: string = '';
  showProfileDropDown: boolean = false;
  showMarketDropDown: boolean = false;
  private isAlive = true;
  constructor(
    public auth: SteemconnectAuthService,
    private _apiService: APIService, public dialog: MatDialog) {

    /**
     *
     * @name getUserData 
     *
     * @description
     * Use fro getting user info like name and profile Image URL
    */

    this.auth.authState.pipe(takeWhile(() => this.isAlive)).subscribe((authState) => {
      console.log('authState', authState)
      if (!authState) return;
      this.auth.getUserData().pipe(takeWhile(() => this.isAlive)).subscribe((auth) => {
        if (auth) {
          this.auth.userData = auth;
          this.userData = auth;
          this.profile = this.userData.account.json_metadata ? JSON.parse(this.userData.account.json_metadata) : {};
          this.profile_url = `https://steemitimages.com/u/${this.userData.name}/avatar`;
        }
      });
    })
  }
  ngOnInit() {
  
  }
  showDropDown() {
    this.showProfileDropDown = !this.showProfileDropDown;
  }
  showmDropDown() {
    this.showProfileDropDown = !this.showProfileDropDown;
  }


  ngOnDestroy() {
    this.isAlive = false;
  }
}
