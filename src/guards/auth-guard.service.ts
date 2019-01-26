import { SteemconnectAuthService } from '../app/steemconnect/services/steemconnect-auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(public auth: SteemconnectAuthService, private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.auth.token && this.auth.token.access_token) {
      return this.auth.getUserData().map((auth) => {
        if (auth) {
          this.auth.userData = auth;
          console.log('authenticated');
          return true;
        }
        this.auth.login();
        console.log('not authenticated');
        return false;
      }); // this might not be necessary - ensure `first` is imported if you use it
    } else {
      this.auth.login();
      return false
    }

  }

}