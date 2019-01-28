import { Component, OnInit, ViewChild } from '@angular/core';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
import { Observable } from 'rxjs';
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
  userData: any = { account: { reputationScore: 0, reputation: 0 } };
  noOfOpenAds: number = 0;
  balance_steem;
  balance_sbd;
  balance_sp;
  profile_url;
  profile;
  selectedAdId: string = '';
  noAds: boolean;
  constructor(private ngxService: NgxUiLoaderService, private _auth: SteemconnectAuthService,
    private apiSer: APIService) {
  }
  reviewsDisplayedColumns: string[] = ['order_id', 'review_text', 'review_score'];
  advertisementDisplayedColumns: string[] = ['payment_methods', 'ad_type', 'ad_coin', 'currency', 'ad_coin_amount', 'limits', 'buttons'];
  advertisementsDataSource: MatTableDataSource<AdvertisementResponse> = new MatTableDataSource([]);
  reviewsDataSource: MatTableDataSource<ReviewResponse> = new MatTableDataSource([]);
  @ViewChild('reviews') reviewsPaginator: MatPaginator;
  @ViewChild('advertisements') advertisementsPaginator: MatPaginator;
  openAds: Observable<AdvertisementResponse[]>;
  reviews: Observable<ReviewResponse[]>;

  ngOnInit() {
    this.getReviewsAndAdvt();
  }


  /**
   *
   * @name getReviewsAndAdvt 
   *
   * @description
   * This method used to get user reviews on order and advertisement
   * @requires username current login username
  */
  getReviewsAndAdvt() {
    this.ngxService.start();
    this.userData = this._auth.userData;
    this.userData.account.reputationScore = calculateReputation(this.userData.account.reputation);
    console.log(this.userData);
    this.openAds = this.apiSer.getAdsByUser(this.userData.name);
    this.reviews = this.apiSer.getReviews(this.userData._id, 'by_creator');
    forkJoin(this.openAds, this.reviews).subscribe((data) => {
      // Hack for check data existance
      const advertisements = data && data[0] && data[0].length ? data[0] : [];
      this.advertisementsDataSource = new MatTableDataSource(advertisements);
      this.advertisementsDataSource.paginator = this.advertisementsPaginator;
      this.noOfOpenAds = advertisements.filter((ad) => (ad.ad_status === 'open')).length;
      const reviews = data && data[1] && data[1].length ? data[1] : [];
      this.reviewsDataSource = new MatTableDataSource(reviews);
      this.reviewsDataSource.paginator = this.reviewsPaginator;
    });
    this.balance_sbd = this.userData.account.sbd_balance.split(" ")[0];
    this.balance_steem = this.userData.account.balance.split(" ")[0];
    this.balance_sp = this.userData.account.vesting_shares.split(" ")[0];
    this.profile = this.userData.account.json_metadata ? JSON.parse(this.userData.account.json_metadata) : {};
    this.profile_url = this.profile && this.profile.profile ? this.profile.profile.profile_image : '';
    this.ngxService.stop();
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
    this.apiSer.deleteAd(id).subscribe(res => {
      this.openAds = this.apiSer.getAdsByUser(this.userData.name);
      this.openAds.subscribe((data) => {
        const advertisements = data || [];
        this.advertisementsDataSource = new MatTableDataSource(advertisements);
        this.noOfOpenAds = advertisements.filter((ad) => (ad.ad_status === 'open')).length;
        this.ngxService.stop();
      })

    });
  }

}