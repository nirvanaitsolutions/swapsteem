import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { SteemconnectAuthService } from './services/steemconnect-auth.service';
import { SteemconnectRedirectGuard } from '../redirect/steemconnect-redirect.guard';
import { RedirectComponent } from '../redirect/redirect.component';
import { SteemconnectBroadcastService } from './services/steemconnect-broadcast.service';

export interface SteemConnectConfig {
  clientId: string;
  scope: Array<string>;
}

const routes: Routes = [
  {
    path: 'steemconnect/redirect',
    canActivate: [SteemconnectRedirectGuard],
    component: RedirectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    SteemconnectAuthService,
    SteemconnectRedirectGuard,
    SteemconnectBroadcastService
  ],
  declarations: []
})
export class SteemconnectModule {
  static forRoot(config: SteemConnectConfig): ModuleWithProviders {
    return {
      ngModule: SteemconnectModule,
      providers: [{ provide: 'config', useValue: config }]
    };
  }
}