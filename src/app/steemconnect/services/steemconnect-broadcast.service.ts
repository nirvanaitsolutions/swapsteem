import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { SteemconnectAuthService } from './steemconnect-auth.service';

export interface Operation extends Array<string | { [K: string]: any }> {
  0: string;
  1: { [K: string]: any };
}

export interface BroadcastResult {
  id: string;
  block_num: number;
  trx_num: number;
  expired: boolean;
  ref_block_num: number;
  ref_block_prefix: number;
  expiration: Date;
  operations: Array<Operation>;
  extensions: Array<any>;
  signatures: Array<string>;
}

@Injectable()
export class SteemconnectBroadcastService {
  private readonly broadcastURL = 'https://steemconnect.com/api/broadcast';

  constructor(
    private scAuthService: SteemconnectAuthService,
    private http: HttpClient
  ) { }

  public broadcastOperations(
    operations: Array<Operation>
  ): Observable<BroadcastResult> {
    let accessToken: string;
    if (this.scAuthService.token) {
      accessToken = this.scAuthService.token.access_token;
    } else {
      return throwError('User has to be logged in to broadcast!');
    }

    return this.http
      .post(
        this.broadcastURL,
        {
          operations
        },
        {
          headers: new HttpHeaders({
            Authorization: `${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          })
        }
      )
      .pipe(map((response: { result: BroadcastResult }) => response.result));
  }

  public broadcastCustomJson(
    id: string,
    jsonType: string,
    customJson: Object
  ): Observable<BroadcastResult> {
    let username: string;
    if (this.scAuthService.token) {
      username = this.scAuthService.token.username;
    } else {
      return throwError('User has to be logged in to broadcast!');
    }

    return this.broadcastOperations([
      [
        'custom_json',
        {
          required_auths: [username],
          required_posting_auths: [],
          id,
          json: JSON.stringify([jsonType, JSON.stringify(customJson)])
        }
      ]
    ]);
  }
}