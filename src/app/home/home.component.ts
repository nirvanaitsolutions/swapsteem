import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private auth: SteemconnectAuthService) {
    this.route.queryParamMap.subscribe(params => {
      if (!this.auth.userData)
        this.auth.refUserName = params.get('ref') || '';
    });

  }
  ngOnInit() {
  }
}
