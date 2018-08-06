import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostTradeComponent } from './post-trade/post-trade.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { WalletComponent } from './wallet/wallet.component';
import { ProfileComponent } from './profile/profile.component';
import { HelpComponent } from './help/help.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SteemconnectRedirectGuard } from './redirect/steemconnect-redirect.guard';
import {BuyPageComponent} from './buy-page/buy-page.component'
import {SellPageComponent} from './sell-page/sell-page.component';
import {PurchaseComponent} from './purchase/purchase.component';
import {RedirectComponent} from './redirect/redirect.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'buy-online',      component: BuyPageComponent},
  { path: 'sell-online',      component: SellPageComponent },
  { path: 'post-trade',      component: PostTradeComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'wallet',      component: WalletComponent },
  { path: 'profile',      component: ProfileComponent },
  { path: 'help',      component: HelpComponent },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'purchase', component: PurchaseComponent},
  {
    path: 'steemconnect/redirect',
    canActivate: [SteemconnectRedirectGuard],
    component: RedirectComponent
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PagenotfoundComponent }
];;

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
