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

  price : any;
    
  constructor(private breakpointObserver: BreakpointObserver,
              public auth: SteemconnectAuthService,
              private _apiService : APIService) 
  {}

  ngOnInit(){
    this._apiService.getPrice().subscribe(data => {
      console.log(data);
      this.price = data;
    })
  }
}
