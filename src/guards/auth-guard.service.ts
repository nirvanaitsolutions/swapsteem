import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { APIService } from '../service/api.service'

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(public api: APIService, public auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.auth.userData) {
      return true;
    }
    if (this.auth.token()) {
      return this.api.getUser().map((userData) => {
        this.auth.userData = userData;
        return true;
      });
    }
    this.router.navigate(['/login']);
    return false

  }

}