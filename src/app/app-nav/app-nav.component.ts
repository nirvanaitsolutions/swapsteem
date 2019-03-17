import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { takeWhile } from "rxjs/operators";
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';
import { SignupComponent } from '../components/signup/signup.component';
@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent implements OnInit {
  loginTooltipInfo: string = `Users need to have a Steem account to be able to trade on swapSteem. Please click sign up if you don't have a Steem account. 
  Note : Account creation fee = $2.50`;
  price: any = {
    steem: {
      usd: ''
    },
    'steem-dollars': {
      usd: ''
    }
  };
  userData: any = {};
  profile: any = {};
  profile_url: string = '';
  showProfileDropDown: boolean = false;
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
          this.profile_url = this.profile && this.profile.profile ? this.profile.profile.profile_image : '';
        }
      });
    })
  }
  ngOnInit() {
    this._apiService.getPrice().pipe(takeWhile(() => this.isAlive)).subscribe(data => {
      console.log(data);
      this.price = data;
    });
  }
  showDropDown() {
    this.showProfileDropDown = !this.showProfileDropDown;
  }

  /**
    *
    * @name openSignupDialog 
    *
    * @description
    * This method used to open signup component in modal
   */

  openSignupDialog(): void {
    this.dialog.open(SignupComponent, {
      width: '700px',
      disableClose: true
    });
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
