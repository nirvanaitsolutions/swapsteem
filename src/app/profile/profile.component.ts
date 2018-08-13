import { Component, OnInit } from '@angular/core';
import {SteemconnectAuthService} from '../steemconnect/services/steemconnect-auth.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {APIService} from '../../service/api.service';
import { Router } from '@angular/router';
import {AdvertisementResponse} from '../module/advertisement';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = [];
  noOfAds =  0;
  constructor(private _auth: SteemconnectAuthService,
              private apiSer : APIService,
              private router : Router) { }
    openAds : Observable<AdvertisementResponse> ;
  
  ngOnInit() {
    this._auth.getUserData().subscribe(data => {
     this.userData = data;
     console.log(this.userData);
    });
    this.openAds = this.apiSer.getAdsByUser('aneilpatel');
    //this.openAds.subscribe(data => console.log(data))
  }

}
