import { Component, OnInit } from '@angular/core';
import {SteemconnectAuthService} from '../steemconnect/services/steemconnect-auth.service';
//import {take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {APIService} from '../../service/api.service';
import { Router } from '@angular/router';
import {AdvertisementResponse} from '../module/advertisement';
//import {map,tap} from 'rxjs/operators'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = [];
  constructor(private _auth: SteemconnectAuthService,
    private purchaseSer : APIService,
    private router : Router) { }
    openAds : Observable<AdvertisementResponse> ;
  
  ngOnInit() {
    this._auth.getUserData().subscribe(data => {
     this.userData = data;
     this.openAds = this.purchaseSer.getAdsByUser("aneilpatel");
    });
  }

}
