import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostTradeComponent } from './post-trade/post-trade.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { WalletComponent } from './wallet/wallet.component';
import { ProfileComponent } from './profile/profile.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SteemconnectRedirectGuard } from './redirect/steemconnect-redirect.guard';
import { BuyPageComponent } from './buy-page/buy-page.component'
import { SellPageComponent } from './sell-page/sell-page.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { RedirectComponent } from './redirect/redirect.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { OrderComponent } from './order/order.component';
import { AuthGuard} from '../guards/auth-guard.service';
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'buy-online', component: BuyPageComponent },
  { path: 'sell-online', component: SellPageComponent },
  {
    path: 'post-trade',
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id', 
        component: PostTradeComponent
      },
      {
        path: '',
        component: PostTradeComponent
      },
    ]
  },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'wallet', component: WalletComponent, canActivate: [AuthGuard] },
  
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'purchase/:id', component: PurchaseComponent, canActivate: [AuthGuard] },
  { path: 'chat/:id', component: ChatPageComponent },
  {
    path: 'steemconnect/redirect',
    canActivate: [SteemconnectRedirectGuard],
    component: RedirectComponent
  },
  { path: 'order/:id', component: OrderComponent, canActivate: [AuthGuard] },
  
  {
    path: '',
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
