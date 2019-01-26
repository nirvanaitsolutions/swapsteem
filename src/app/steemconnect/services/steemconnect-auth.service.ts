import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { throwError  } from 'rxjs';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SteemConnectConfig } from '../steemconnect.module';

export interface OAuth2Token {
  access_token: string;
  expires_in: number;
  username: string;
}

interface Authority {
  weight_threshold: number;
  account_auths: any[];
  key_auths: any[][];
}

interface Account {
  id: number;
  name: string;
  owner: Authority;
  active: Authority;
  posting: Authority;
  memo_key: string;
  json_metadata: string;
  proxy: string;
  last_owner_update: Date;
  last_account_update: Date;
  created: Date;
  mined: boolean;
  recovery_account: string;
  last_account_recovery: Date;
  reset_account: string;
  comment_count: number;
  lifetime_vote_count: number;
  post_count: number;
  can_vote: boolean;
  voting_power: number;
  last_vote_time: Date;
  balance: string;
  savings_balance: string;
  sbd_balance: string;
  sbd_seconds: string;
  sbd_seconds_last_update: Date;
  sbd_last_interest_payment: Date;
  savings_sbd_balance: string;
  savings_sbd_seconds: string;
  savings_sbd_seconds_last_update: Date;
  savings_sbd_last_interest_payment: Date;
  savings_withdraw_requests: number;
  reward_sbd_balance: string;
  reward_steem_balance: string;
  reward_vesting_balance: string;
  reward_vesting_steem: string;
  vesting_shares: string;
  delegated_vesting_shares: string;
  received_vesting_shares: string;
  vesting_withdraw_rate: string;
  next_vesting_withdrawal: Date;
  withdrawn: number;
  to_withdraw: number;
  withdraw_routes: number;
  curation_rewards: number;
  posting_rewards: number;
  proxied_vsf_votes: number[];
  witnesses_voted_for: number;
  last_post: Date;
  last_root_post: Date;
  average_bandwidth: string;
  lifetime_bandwidth: string;
  last_bandwidth_update: Date;
  average_market_bandwidth: number;
  lifetime_market_bandwidth: number;
  last_market_bandwidth_update: Date;
  vesting_balance: string;
  reputation: number;
  transfer_history: any[];
  market_history: any[];
  post_history: any[];
  vote_history: any[];
  other_history: any[];
  witness_votes: any[];
  tags_usage: any[];
  guest_bloggers: any[];
}

export interface UserData {
  user: string;
  _id: string;
  name: string;
  account: Account;
  scope: string[];
  user_metadata: Object;
}

@Injectable()
export class SteemconnectAuthService {
  /**
   * Observalbe is truthy if user is logged in, falsy otherwise.
   */
  public get authState(): Observable<boolean> {
    return this.authStateSubject.asObservable();
  }

  public get token(): OAuth2Token | undefined {
    return this.getCookie();
  }

  private authStateSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );

  private readonly baseURL = 'https://steemconnect.com/';
  public userData:UserData;
  constructor(
    @Inject('config') private config: SteemConnectConfig,
    @Inject(DOCUMENT) private document: Document,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

  /**
   * Fetches current user data from SteemConnect.
   */
  public getUserData(): Observable<UserData> {
    let accessToken: string;
    if (this.token) {
      accessToken = this.token.access_token;
    } else {
      return throwError('User has to be logged in!');
    }

    return this.http.get<UserData>(`${this.baseURL}api/me`, {
      headers: new HttpHeaders({
        Authorization: accessToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      })
    });
  }

  /**
   * Use this method to redirect user to SteemConnect to get logged in.
   */
  public login(): void {
    this.document.location.href = this.getAuthorizationUrl();
  }

  /**
   * Logs out current user.
   * Sets `authState` to false, deletes token from cookies and revokes `access_token` on SteemConnect.
   */
  public logout(): void {
    this.authStateSubject.next(false);
    this.http
      .post(`${this.baseURL}api/oauth2/token/revoke`, null, {
        headers: new HttpHeaders({
          Authorization: this.token.access_token,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        })
      })
      .pipe(
        tap(() => this.deleteCookie()),
        catchError(err => {
          this.authStateSubject.next(true);
          return of(err);
        })
      )
      .subscribe();
  }

  /**
   * Sets `authState`.
   * It doesn't make sense to use this method outside `SteemconnectModule`.
   * @param token If null, `authState` is set to false. If OAuth2Token, `authState` is set to true.
   */
  public setAuthState(token: OAuth2Token | null): void {
    if (token === null) {
      this.deleteCookie();
      this.authStateSubject.next(false);
    } else {
      this.setCookie(token);
      this.authStateSubject.next(true);
    }
  }

  /**
   * Checks if user is authenticated.
   */
  private isAuthenticated(): boolean {
    return !!this.getCookie();
  }

  /**
   * Gets authorization URL based on config provided in `forRoot` of the SteemconnectModule.
   */
  private getAuthorizationUrl(): string {
    const clientId = this.config.clientId;
    const redirectUrl = encodeURIComponent(
      `${this.document.location.origin}/steemconnect/redirect`
    );
    const scope = this.config.scope.join(',');
    return `${
      this.baseURL
    }oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}`;
  }

  /**
   * Sets a `access_token` cookie.
   */
  private setCookie(token: OAuth2Token): OAuth2Token {
    this.cookieService.putObject('access_token', token, {
      expires: new Date(Date.now() + token.expires_in * 1000)
    });
    return token;
  }

  /**
   * Gets a `access_token` from cookies (if exists, otherwise returns undefined).
   */
  private getCookie(): OAuth2Token | undefined {
    return this.cookieService.getObject('access_token') as OAuth2Token;
  }

  /**
   * Deletes a `access_token` cookie.
   */
  private deleteCookie(): void {
    this.cookieService.remove('access_token');
  }
}