import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css'],
})
export class AppNavComponent implements OnInit {

  price: any = {
    STEEM: {
      USD: ''
    },
    'SBD*': {
      USD: ''
    }
  };
  userData: any = {};
  profile: any = {};
  profile_url: string = '';
  constructor(private breakpointObserver: BreakpointObserver,
    public auth: SteemconnectAuthService,
    private _apiService: APIService) {
/**
 *
 * @name getUserData 
 *
 * @description
 * Use fro getting user info like name and profile Image URL
*/
    this.auth.getUserData().subscribe((auth) => {
      if (auth) {
        this.userData = auth;
        this.profile = this.userData.account.json_metadata ? JSON.parse(this.userData.account.json_metadata) : {};
        this.profile_url = this.profile && this.profile.profile ? this.profile.profile.profile_image : '';
      }
    });

  }

  ngOnInit() {
    this._apiService.getPrice().subscribe(data => {
      console.log(data);
      this.price = data;
    })
  }
}
