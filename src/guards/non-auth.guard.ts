import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SteemconnectAuthService } from '../app/steemconnect/services/steemconnect-auth.service';
import { APIService } from '../service/api.service';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {

  constructor(public api: APIService, public auth: SteemconnectAuthService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.mongoUserData) {
      return false;
    }
    return true;
  }
}
