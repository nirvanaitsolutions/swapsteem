import { SteemconnectAuthService } from '../app/steemconnect/services/steemconnect-auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { APIService } from '../service/api.service'

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(public api: APIService, public auth: SteemconnectAuthService, private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.auth.userData) {
      return true;
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