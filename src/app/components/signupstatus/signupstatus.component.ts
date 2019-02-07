/**
 *
 * @name review.component
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This component used for status of signup
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import {SignupstatusmodalComponent} from '../signupstatusmodal/signupstatusmodal.component';
@Component({
  selector: 'app-signupstatus',
  templateUrl: './signupstatus.component.html',
  styleUrls: ['./signupstatus.component.css']
})
export class SignupstatusComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.openSignUpStatusDialog();
  }

  /**
    *
    * @name openSignUpStatusDialog 
    *
    * @description
    * This method used to open signup status in modal
   */

  openSignUpStatusDialog(): void {
    this.dialog.open(SignupstatusmodalComponent, {
      width: '300px',
      disableClose: true,
      data: {
        url: this.router.url
      }
    });
    //this.router.navigate(['/home']);
  }
}
