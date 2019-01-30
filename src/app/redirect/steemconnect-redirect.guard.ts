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
import { APIService } from '../../service/api.service';
import { Observable } from 'rxjs';
@Injectable()
export class SteemconnectRedirectGuard implements CanActivate {
  constructor(
    private scAuthService: SteemconnectAuthService,
    private router: Router,
    private apiSer: APIService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const token: OAuth2Token = {
      access_token: next.queryParams.access_token,
      username: next.queryParams.username,
      expires_in: next.queryParams.expires_in
    };
    if (token.access_token) {
      this.scAuthService.setAuthState(token);
      return this.scAuthService.getUserData().map((scAuthService) => {
        if (scAuthService) {
          this.scAuthService.userData = scAuthService;
          return true;
        }
        this.router.navigate(['']);
        return false;
      }); // this might not be necessary - ensure `first` is imported if you use it
    }
    this.router.navigate(['']);
    return false
  }
}