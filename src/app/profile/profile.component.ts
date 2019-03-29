import { Component, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from "rxjs/operators";
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../service/api.service';
import { AdvertisementResponse } from '../module/advertisement';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReviewResponse } from '../module/review';
import { forkJoin } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { calculateReputation } from '../../utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = { name: '', account: { reputationScore: 0, reputation: 0 } };
  noOfOpenAds: number = 0;
  balance_steem;
  balance_sbd;
  balance_sp;
  profile_url;
  profile;
  selectedAdId: string = '';
  noAds: boolean;
  userNameFromParams: string | undefined = '';
  private isAlive = true;
  constructor(private ngxService: NgxUiLoaderService, private _auth: SteemconnectAuthService,
    private apiSer: APIService, private route: ActivatedRoute, private router: Router) {
    route.params.pipe(takeWhile(() => this.isAlive)).subscribe(val => {
      const hasButtons = this.advertisementDisplayedColumns.indexOf('buttons');
      console.log(val)
      if (val && val.id && val.id[0] === '@') {
        if (hasButtons === this.advertisementDisplayedColumns.length - 1) {
          this.advertisementDisplayedColumns.pop()
        }
        this.userNameFromParams = val.id.substring(1);
        this.getReviewsAndAdvt(this.userNameFromParams);
      } else if (val && val.id) {
        this.router.navigate(['/home']);
      } else {
        this.userNameFromParams = '';
        if (hasButtons === -1) {
          this.advertisementDisplayedColumns.push('buttons');
        }
        this.getReviewsAndAdvt('');
      }
    });
  }
  reviewsDisplayedColumns: string[] = ['order_id', 'review_text', 'review_score'];
  advertisementDisplayedColumns: string[] = ['payment_method', 'ad_type', 'from', 'to', 'ad_coin_amount'];
  advertisementsDataSource: MatTableDataSource<AdvertisementResponse> = new MatTableDataSource([]);
  reviewsDataSource: MatTableDataSource<ReviewResponse> = new MatTableDataSource([]);
  @ViewChild('reviews') reviewsPaginator: MatPaginator;
  @ViewChild('advertisements') advertisementsPaginator: MatPaginator;
  openAds: Observable<AdvertisementResponse[]>;
  reviews: Observable<ReviewResponse[]>;



  /**
   *
   * @name getReviewsAndAdvt 
   *
   * @description
   * This method used to get user reviews on order and advertisement
   * @requires username current login username
  */
  getReviewsAndAdvt(username) {
    this.ngxService.start();
    if (username) {
      this.userData = {
        user: username,
        _id: username,
        name: username,
        scope: [],
        user_metadata: {},
        account: {
          reputationScore: 0
        }
      }

    } else {
      this.userData = this._auth.userData;
      if (this.userData.account)
        this.userData.account.reputationScore = calculateReputation(this.userData.account.reputation);
      
    }

    console.log(this.userData);
    this.openAds = this.apiSer.getAdsByUser(this.userData.name);
    this.reviews = this.apiSer.getReviews(this.userData._id, 'by_creator');
    forkJoin(this.openAds, this.reviews).pipe(takeWhile(() => this.isAlive)).subscribe((data) => {
      // Hack for check data existance
      const advertisements = data && data[0] && data[0].length ? data[0] : [];
      this.advertisementsDataSource = new MatTableDataSource(advertisements);
      this.advertisementsDataSource.paginator = this.advertisementsPaginator;
      this.noOfOpenAds = advertisements.filter((ad) => (ad.ad_status === 'open')).length;
      const reviews = data && data[1] && data[1].length ? data[1] : [];
      this.reviewsDataSource = new MatTableDataSource(reviews);
      this.reviewsDataSource.paginator = this.reviewsPaginator;
    });
    if (!this.userNameFromParams && this.userData.account) {
      this.balance_sbd = this.userData.account.sbd_balance.split(" ")[0];
      this.balance_steem = this.userData.account.balance.split(" ")[0];
      this.balance_sp = this.userData.account.vesting_shares.split(" ")[0];
      this.profile = this.userData.account.json_metadata ? JSON.parse(this.userData.account.json_metadata) : {};
    }
    this.profile_url = `https://steemitimages.com/u/${this.userData.name}/avatar`;
    this.ngxService.stop();
  }

  ngOnInit() {

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
    this.apiSer.pauseAd(id, currentStatus).pipe(takeWhile(() => this.isAlive)).subscribe(res => {
      this.openAds = this.apiSer.getAdsByUser(this.userData.name);
      this.openAds.pipe(takeWhile(() => this.isAlive)).subscribe((data) => {
        const advertisements = data || [];
        this.advertisementsDataSource = new MatTableDataSource(advertisements);
        this.noOfOpenAds = advertisements.filter((ad) => (ad.ad_status === 'open')).length;
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
    this.apiSer.deleteAd(id).pipe(takeWhile(() => this.isAlive)).subscribe(res => {
      this.openAds = this.apiSer.getAdsByUser(this.userData.name);
      this.openAds.pipe(takeWhile(() => this.isAlive)).subscribe((data) => {
        const advertisements = data || [];
        this.advertisementsDataSource = new MatTableDataSource(advertisements);
        this.noOfOpenAds = advertisements.filter((ad) => (ad.ad_status === 'open')).length;
        this.ngxService.stop();
      })

    });
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

}