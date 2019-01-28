import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';
import { MatDialog } from '@angular/material';
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

  constructor(private breakpointObserver: BreakpointObserver,
    public auth: SteemconnectAuthService,
    private _apiService: APIService, public dialog: MatDialog) {
    const dialogRef = this.dialog.open(ReviewComponent, {
      width: '300px',
      disableClose: true,
    });


  }

  ngOnInit() {
    this._apiService.getPrice().subscribe(data => {
      console.log(data);
      this.price = data;
    })
  }
}
