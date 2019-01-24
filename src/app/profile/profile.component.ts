import { Component, OnInit, ViewChild } from '@angular/core';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { Observable } from 'rxjs';
import { APIService } from '../../service/api.service';
import { Router } from '@angular/router';
import { AdvertisementResponse } from '../module/advertisement';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReviewResponse } from '../module/review';
import { forkJoin } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = [];
  noOfAds = 0;
  balance_steem;
  balance_sbd;
  balance_sp;
  profile_url;
  profile;
  selectedAdId: string = '';
  noAds: boolean;
  constructor(private ngxService: NgxUiLoaderService, private _auth: SteemconnectAuthService,
    private apiSer: APIService,
    private router: Router) {
    // this.apiSer.showLoader();

    console.log('constructor called');
  }
  displayedColumns: string[] = ['order_id', 'review_text', 'review_score'];
  reviewsDataSource: MatTableDataSource<ReviewResponse>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  openAds: Observable<AdvertisementResponse[]>;
  reviews: Observable<ReviewResponse[]>;

  ngOnInit() {
    this.ngxService.start();
    this._auth.getUserData().subscribe(data => {
      this.userData = data;
      console.log(this.userData);
      this.openAds = this.apiSer.getAdsByUser(this.userData.name);
      this.reviews = this.apiSer.getReviews(this.userData._id, 'by_creator');
      forkJoin(this.openAds, this.reviews).subscribe((data) => {
        // Hack for check data existance
        if (!data || !data[0] || !data[0].length) {
          this.noAds = true;
        } else {
          this.noAds = false;
        }
        const reviews = data && data[1] && data[1].length ? data[1] : [];
        this.reviewsDataSource = new MatTableDataSource(reviews);
        this.reviewsDataSource.paginator = this.paginator;
        this.reviewsDataSource.sort = this.sort;
      });
      this.balance_sbd = this.userData.account.sbd_balance.split(" ")[0];
      this.balance_steem = this.userData.account.balance.split(" ")[0];
      this.balance_sp = this.userData.account.vesting_shares.split(" ")[0];
      this.profile = this.userData.account.json_metadata ? JSON.parse(this.userData.account.json_metadata) : {};
      this.profile_url = this.profile && this.profile.profile ? this.profile.profile.profile_image : '';
      this.ngxService.stop();
    });
  }



  /**
   *
   * @name pauseAd 
   *
   * @description
   * This method used to pause  and open selected advertisement 
   * @param id advertisement id 
   * @param currentStatus current advertisement status
   * @requires username current login username
  */
  pauseAd(id: string, currentStatus: string) {
    this.ngxService.start();
    this.apiSer.pauseAd(id, currentStatus).subscribe(res => {
      this.openAds = this.apiSer.getAdsByUser(this.userData.name);
      this.openAds.subscribe((data) => {
        if (data.length === 0) {
          this.noAds = true;
        } else {
          this.noAds = false;
        }
        this.ngxService.stop();
      })
    });
  }

  /**
   *
   * @name deleteAd 
   *
   * @description
   * This method used to delete selected advertisement 
   * @param id advertisement id 
   * @requires username current login username
  */
  deleteAd(id: string) {
    this.ngxService.start();
    this.apiSer.deleteAd(id).subscribe(res => {
      this.openAds = this.apiSer.getAdsByUser(this.userData.name);
      this.openAds.subscribe((data) => {
        if (data.length === 0) {
          this.noAds = true;
        } else {
          this.noAds = false;
        }
        this.ngxService.stop();
      })

    });
  }

}