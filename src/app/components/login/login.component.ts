/**
 *
 * @name signup.component
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This component used for sign-up new user
 */
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { SteemKeychainService } from '@steeveproject/ngx-steem-keychain';
import { SteemconnectAuthService } from '../../steemconnect/services/steemconnect-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userData: { username: string; } = {
    username: ''
  };

  constructor(private cookieService: CookieService, private router: Router, public auth: SteemconnectAuthService, private steemKeychain: SteemKeychainService) { }


  ngOnInit() {
  }


  onLoginWithKeychain() {
    //DO Keychain Login
    console.log("callled");
    this.steemKeychain.requestHandshake();
    this.steemKeychain.requestVerifyKey(this.userData.username, 'smmsg', 'Active')
      .subscribe(
        (data) => {
          //Called when success
          console.log(data);
        },
        (error) => {
          //Called when error
          console.log(error);
        }
      ).add(() => {
        console.log("done")
        this.steemKeychain.requestSignBuffer(this.userData.username, 'smmsg', 'Active')
          .subscribe(
            (data) => {
              console.log(data)
              if (data && data.success && data.result) {
                const expires = new Date(Date.now() + 604800 * 1000);
                this.cookieService.putObject('access_token_key_chain', data.result, {
                  expires
                });
                this.cookieService.putObject('username_key_chain', this.userData.username, {
                  expires
                });
              }
              this.router.navigate([`profile`])
            },
            (error) => {
              //Called when error
              console.log(error);
            }
          );
      });
  }



}
