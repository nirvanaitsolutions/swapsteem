import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';
import { SignupComponent } from '../components/signup/signup.component';
import { LoginComponent } from '../components/login/login.component';
@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent implements OnInit {

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
  showProfileDropDown: boolean = false
  constructor(private breakpointObserver: BreakpointObserver,
    public auth: SteemconnectAuthService,
    private _apiService: APIService, public dialog: MatDialog) {

    /**
     *
     * @name getUserData 
     *
     * @description
     * Use fro getting user info like name and profile Image URL
    */
   
    this.auth.authState.subscribe((authState)=> {
      console.log('authState', authState)
      if(!authState) return;
      this.auth.getUserData().subscribe((auth) => {
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
    this._apiService.getPrice().subscribe(data => {
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

   /**
    *
    * @name openLoginDialog 
    *
    * @description
    * This method used to open login component in modal
   */

  openLoginDialog(): void {
    this.dialog.open(LoginComponent, {
      width: '700px',
      disableClose: true
    });
  }
}
