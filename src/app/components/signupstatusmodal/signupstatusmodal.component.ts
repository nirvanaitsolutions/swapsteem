/**
 *
 * @name review.component
 * @author Shubham Vijay Vargiy (Shubh1692)
 * @description
 * This component used for status of signup in modal
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-signupstatusmodal',
  templateUrl: './signupstatusmodal.component.html',
  styleUrls: ['./signupstatusmodal.component.css']
})
export class SignupstatusmodalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SignupstatusmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() { 
  }

}
