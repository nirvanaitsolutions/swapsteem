import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { APIService } from '../../service/api.service';
import { AuthService, MongoUserData } from '../../service/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CookieService } from 'ngx-cookie';
import { takeWhile } from 'rxjs/operators';
@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  public isAlive = true;
  public logoutSubscribe = null;
  public setUserDataSubscribe = null;
  constructor(private snackBar: MatSnackBar, private cookieService: CookieService, public ngxService: NgxUiLoaderService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TermsAndConditionsComponent>, public auth: AuthService, private api: APIService) { }

  ngOnInit() {
  }

  onAccept() {
    this.setUserDataSubscribe = this.api.setUserData({
      email: this.auth.userData.email,
      tos_accepted: true
    }).pipe(takeWhile(() => this.isAlive)).subscribe((user: MongoUserData) => {
      this.auth.userData = user;
      this.dialogRef.close();
    });
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
    if (this.setUserDataSubscribe && this.setUserDataSubscribe.unsubscribe)
      this.setUserDataSubscribe.unsubscribe();
    this.ngxService.stop();
  }

}
