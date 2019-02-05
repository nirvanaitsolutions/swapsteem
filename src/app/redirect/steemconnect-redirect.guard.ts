import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {
  OAuth2Token
} from '../steemconnect/services/steemconnect-auth.service';
import { Observable } from 'rxjs';
@Injectable()
export class SteemconnectRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
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
      return true;
    }
    this.router.navigate(['']);
    return false
  }
}