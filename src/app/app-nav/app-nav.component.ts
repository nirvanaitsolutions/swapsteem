import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { APIService } from '../../service/api.service';
import { MatDialog } from '@angular/material';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component'
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
    const dialogRef = this.dialog.open(TermsAndConditionsComponent, {
      width: '2000px',
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
