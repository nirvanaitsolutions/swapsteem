import { Component, OnInit } from '@angular/core';
// import 
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
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {

  constructor(private scAuthService: SteemconnectAuthService) {
    console.log('constructor called');
    this.scAuthService.getUserData().map((auth) => {
      console.log(auth);
    })
  }

  ngOnInit() {

  }

}
