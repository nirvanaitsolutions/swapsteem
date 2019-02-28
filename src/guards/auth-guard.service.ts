import { SteemconnectAuthService } from '../app/steemconnect/services/steemconnect-auth.service';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { SteemKeychainService } from '@steeveproject/ngx-steem-keychain';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import 'rxjs/add/observable/of';
import { APIService } from '../service/api.service'
import { delay } from 'rxjs/operators/delay';
@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private steemKeychain: SteemKeychainService, private cookieService: CookieService, public api: APIService, public auth: SteemconnectAuthService, private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const keychainSignInToken = this.cookieService.getObject('access_token_key_chain');
    const keychainSignInTokenString: string = keychainSignInToken ? JSON.stringify(keychainSignInToken) : ''
    if (this.auth.userData) {
      return true;
    }
    if (keychainSignInToken) {
      console.log('tt')
      return Observable.create(() => {
        console.log( window['steem_keychain'])
        return this.steemKeychain.requestVerifyKey('svijay1692', keychainSignInTokenString, 'Active').map((data) => {
          console.log(data)
          return true
        })
      }
      ).pipe(delay(5000))


    }
    if (this.auth.token && this.auth.token.access_token) {
      return this.auth.getUserData().map((auth) => {
        if (auth) {
          this.auth.userData = auth;
          console.log(this.auth.userData, 'this.auth.userData')
          // this.api.setUserData
          return true;
        }
        this.auth.login();
        return false;
      }); // this might not be necessary - ensure `first` is imported if you use it
    }
    this.auth.login();
    return false

  }



}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(1000);
  return fn(...args);
}