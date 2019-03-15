import { Component, OnInit } from '@angular/core';
import { APIService } from '../../service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { takeWhile } from 'rxjs/operators';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import {
  AuthService
} from '../../service/auth.service';
import { environment } from '../../environments/environment';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import { WhitelistComponent } from '../components/whitelist/whitelist.component';
@Component({

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userData: { email: string; password: String } = {
    email: '',
    password: ''
  };
  public loginSubscribe;
  public isAlive = true;
  public currentUrl: string;
  constructor(private dialog: MatDialog, private authService: AuthService, private cookieService: CookieService, private api: APIService, private ngxService: NgxUiLoaderService, private snackBar: MatSnackBar, private router: Router, ) {
    router.events.subscribe((event: any) => {
      console.log(event)
      this.currentUrl = event.url || '';
      console.log(this.currentUrl)
    });
  }

  ngOnInit() {
  }

  onLogin() {
    this.ngxService.start();
    this.loginSubscribe = this.api.login(this.userData).pipe(takeWhile(() => this.isAlive)).subscribe((user: any) => {
      this.cookieService.put('user_token', user.token)
      this.ngxService.stop();
      this.snackBar.open(user && user.msg ? user.msg : 'Successfully login', null, {
        duration: 2000
      });
      this.afterLoginRegister(user.user)
    }, error => {
      console.log(error)
      this.snackBar.open(error && error.error && error.error.msg ? error.error.msg : 'Error on login', null, {
        duration: 2000
      });
      this.ngxService.stop();
    });
  }


  ngOnDestroy() {
    this.isAlive = false;
    if (this.loginSubscribe && this.loginSubscribe.unsubscribe)
      this.loginSubscribe.unsubscribe();
    this.ngxService.stop();
  }

  onRegister() {
    this.ngxService.start();
    this.loginSubscribe = this.api.login(this.userData).pipe(takeWhile(() => this.isAlive)).subscribe((user: any) => {
      this.cookieService.put('user_token', user.token)
      this.ngxService.stop();
      this.snackBar.open(user && user.msg ? user.msg : 'Successfully signup', null, {
        duration: 2000
      });
      this.afterLoginRegister(user.user)
    }, error => {
      console.log(error)
      this.snackBar.open(error && error.error && error.error.msg ? error.error.msg : 'Error on signup', null, {
        duration: 2000
      });
      this.ngxService.stop();
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

  afterLoginRegister(user) {
    this.authService.userData = user;
    console.log(this.authService)
    if (!this.authService.userData.whitelisted && !environment.SKIP_WHITE_LIST) {
      this.showWhitelistModal();
      this.router.navigate(['/home']);
    } else if (!this.authService.userData.tos_accepted) {
      this.dialog.open(TermsAndConditionsComponent, {
        width: '2000px',
        disableClose: true,
        data: this.authService.userData
      });
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/profile']);
    }
  }

}
