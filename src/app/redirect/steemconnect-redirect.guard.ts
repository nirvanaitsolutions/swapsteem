import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {
  OAuth2Token,
  SteemconnectAuthService
} from '../steemconnect/services/steemconnect-auth.service';

@Injectable()
export class SteemconnectRedirectGuard implements CanActivate {
  constructor(
    private scAuthService: SteemconnectAuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token: OAuth2Token = {
      access_token: next.queryParams.access_token,
      username: next.queryParams.username,
      expires_in: next.queryParams.expires_in
    };
    alert(0)
    if (token.access_token) {
      this.scAuthService.setAuthState(token);
      // this.router.navigate(['/home'], {
      //   queryParams: {
      //     logInUser: true
      //   }
      // });
      this.scAuthService.getUserData().map((auth) => {
        if (auth) {
          this.scAuthService.userData = auth;
          console.log(this.scAuthService.userData, 'this.auth.userData')
          // this.api.setUserData
        }
      });
      
      
      this.router.navigate(['']);
      return true;
    }

    this.router.navigate(['']);
    return false;
  }
}