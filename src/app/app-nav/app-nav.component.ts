import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { APIService } from '../../service/api.service';
import { AuthService } from '../../service/auth.service';
import { SignupComponent } from '../components/signup/signup.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CookieService } from 'ngx-cookie';
import { takeWhile } from 'rxjs/operators';

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
  isAlive = true;
  public getUserDataSubscribe = null;
  logoutSubscribe = null;
  constructor(
    public auth: AuthService,
    private _apiService: APIService, public dialog: MatDialog, private ngxService: NgxUiLoaderService, private snackBar: MatSnackBar, private cookieService: CookieService, private router: Router) {

    /**
     *
     * @name getUserData 
     *
     * @description
     * Use fro getting user info like name and profile Image URL
    */

    this.getUserDataSubscribe = this._apiService.getUser().subscribe((userData) => {
      this.auth.userData = userData;
      this.userData = userData;
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

  logout() {
    this.ngxService.start();
    this.logoutSubscribe = this._apiService.logout().pipe(takeWhile(() => this.isAlive)).subscribe(() => {
      this.ngxService.stop();
      this.cookieService.remove('user_token');
      this.snackBar.open('Successfully logout', null, {
        duration: 2000
      });
      this.auth.userData = null;
      this.router.navigate(['/home'])
    });
  }

  ngOnDestroy() {
    this.isAlive = false;
    if (this.getUserDataSubscribe && this.getUserDataSubscribe.unsubscribe)
      this.getUserDataSubscribe.unsubscribe();
    if (this.logoutSubscribe && this.logoutSubscribe.unsubscribe)
      this.logoutSubscribe.unsubscribe();
    this.ngxService.stop();
  }
}
