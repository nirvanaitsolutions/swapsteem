import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SteemconnectModule } from './steemconnect/steemconnect.module';
import { AppRoutingModule } from './app-routing.module';
import { CookieModule } from 'ngx-cookie';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HomeComponent } from './home/home.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostTradeComponent } from './post-trade/post-trade.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { WalletComponent } from './wallet/wallet.component';
import { ProfileComponent } from './profile/profile.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { RedirectComponent } from './redirect/redirect.component';
import { environment } from '../environments/environment';
import { SearchBoxComponent } from './search-box/search-box.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { SellPageComponent } from './sell-page/sell-page.component';
import { FormsModule } from '@angular/forms';
import { PurchaseComponent } from './purchase/purchase.component';
import { BuySteemComponent } from './buy-steem/buy-steem.component';
import { BuySbdComponent } from './buy-sbd/buy-sbd.component';
import { SellSbdComponent } from './sell-sbd/sell-sbd.component';
import { SellSteemComponent } from './sell-steem/sell-steem.component';
import { AuthInterceptor } from './../service/auth.intercepter';
import { MomentModule } from 'angular2-moment';
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
import { TradePipePipe } from '../pipes/trade-pipe.pipe';
import { OrderComponent } from './order/order.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReviewComponent } from './components/review/review.component';
import { BarRatingModule } from "ngx-bar-rating";
import { CountdownModule } from 'ngx-countdown';
import { AuthGuard } from '../guards/auth-guard.service';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { WhitelistComponent } from './components/whitelist/whitelist.component';
import { HelppageComponent } from './helppage/helppage.component';
import { DemoMaterialModule } from './material-module';
import { SignupstatusComponent } from './components/signupstatus/signupstatus.component';
import { SignupstatusmodalComponent } from './components/signupstatusmodal/signupstatusmodal.component';
import { BannerComponentComponent } from './banner-component/banner-component.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReferralComponent } from './referral/referral.component';
import { InstaComponent } from './insta/insta.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ChartComponent } from './chart/chart.component';
const config: SocketIoConfig = { url: environment.API_URL, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    AppNavComponent,
    HomeComponent,
    BuyComponent,
    SellComponent,
    DashboardComponent,
    PostTradeComponent,
    NotificationsComponent,
    WalletComponent,
    ProfileComponent,
    PagenotfoundComponent,
    RedirectComponent,
    SearchBoxComponent,
    BuyPageComponent,
    SellPageComponent,
    PurchaseComponent,
    BuySteemComponent,
    BuySbdComponent,
    SellSbdComponent,
    SellSteemComponent,
    TradePipePipe,
    OrderComponent,
    ReviewComponent,
    HelppageComponent,
    SignupstatusComponent,
    SignupstatusmodalComponent,
    TermsAndConditionsComponent,
    WhitelistComponent,
    BannerComponentComponent,
    ReferralComponent,
    InstaComponent,
    LandingPageComponent,
    ChartComponent,
  ],
  entryComponents: [ReviewComponent,TermsAndConditionsComponent, WhitelistComponent, SignupstatusmodalComponent],
  imports: [
    NgxAutoScrollModule,
    MomentModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    LayoutModule,
    HttpClientModule,
    SteemconnectModule.forRoot(environment.steemconnectConfig),
    CookieModule.forRoot(),
    FormsModule,
    NgxUiLoaderModule,
    SocketIoModule.forRoot(config),
    BarRatingModule,
    CountdownModule,
    DemoMaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
