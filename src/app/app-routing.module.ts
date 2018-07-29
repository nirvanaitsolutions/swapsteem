import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostTradeComponent } from './post-trade/post-trade.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { WalletComponent } from './wallet/wallet.component';
import { ProfileComponent } from './profile/profile.component';
import { HelpComponent } from './help/help.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'buy-online',      component: BuyComponent },
  { path: 'sell-online',      component: SellComponent },
  { path: 'post-trade',      component: PostTradeComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'wallet',      component: WalletComponent },
  { path: 'profile',      component: ProfileComponent },
  { path: 'help',      component: HelpComponent },
  { path: 'dashboard',      component: DashboardComponent },
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
