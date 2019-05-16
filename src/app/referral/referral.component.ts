/**
 *
 * @name referral.component
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This component used for copy referral link
 */
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SteemconnectAuthService } from '../steemconnect/services/steemconnect-auth.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {
  referralLink: string = '';
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private auth: SteemconnectAuthService) {
    iconRegistry.addSvgIcon(
      'clippy',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clippy.svg'));
    this.referralLink = `${window.location.origin}/home?ref=${auth.userData.name}`;
  }

  ngOnInit() {
  }

  /**
   *
   * @name copyToClipboard 
   *
   * @description
   * This method used to copy to clipboard action
  */
  copyToClipboard(elementId) {
    document.getElementById(elementId)['select']();
    document.execCommand('copy');
  }
}
