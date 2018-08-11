import { Component, OnInit } from '@angular/core';
import {SteemconnectAuthService} from '../steemconnect/services/steemconnect-auth.service';
//import {map,tap} from 'rxjs/operators'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = [];
  constructor(private _auth: SteemconnectAuthService) { }

  
  ngOnInit() {
    this._auth.getUserData().subscribe(data => {
     this.userData = data;
    });
  }

}
