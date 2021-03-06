import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from "rxjs/operators";
import { CookieService } from 'ngx-cookie';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  isAlive = true;
  constructor(private route: ActivatedRoute, private auth: SteemconnectAuthService, private cookieService: CookieService) {
    this.route.queryParamMap.pipe(takeWhile(() => this.isAlive)).subscribe(params => {
      if (!this.auth.userData)
        this.cookieService.put('ref', params.get('ref') || '');
      else
        this.cookieService.remove('ref');
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
