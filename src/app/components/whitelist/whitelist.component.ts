import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, } from '@angular/material';
import { APIService } from '../../../service/api.service';
import { AuthService } from '../../../service/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CookieService } from 'ngx-cookie';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.css']
})
export class WhitelistComponent implements OnInit {
  public isAlive = true;
  public logoutSubscribe = null;
  constructor(private auth: AuthService, private api: APIService, public dialogRef: MatDialogRef<WhitelistComponent>, private ngxService: NgxUiLoaderService, private snackBar: MatSnackBar, private cookieService: CookieService) { }

  ngOnInit() {
  }

  logout() {
    this.ngxService.start();
    this.logoutSubscribe = this.api.logout().pipe(takeWhile(() => this.isAlive)).subscribe(() => {
      this.ngxService.stop();
      this.cookieService.remove('user_token');
      this.snackBar.open('Successfully logout', null, {
        duration: 2000
      });
      this.auth.userData = null;
      this.dialogRef.close();
    });
  }


  ngOnDestroy() {
    this.isAlive = false;
    if (this.logoutSubscribe && this.logoutSubscribe.unsubscribe)
      this.logoutSubscribe.unsubscribe();
    this.ngxService.stop();
  }

}
