import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpRequest ,HttpParams,HttpInterceptor,HttpHandler} from '@angular/common/http';
import {SteemconnectAuthService} from '../app/steemconnect/services/steemconnect-auth.service'

export interface OAuth2Token {
    access_token: string;
    expires_in: number;
    username: string;
  }

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: SteemconnectAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken:OAuth2Token = this.auth.token;

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken.access_token)
      .set('Content-Type',  'application/json')
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}