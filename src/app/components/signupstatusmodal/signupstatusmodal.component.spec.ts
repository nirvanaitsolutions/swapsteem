import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupstatusmodalComponent } from './signupstatusmodal.component';

describe('SignupstatusmodalComponent', () => {
  let component: SignupstatusmodalComponent;
  let fixture: ComponentFixture<SignupstatusmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupstatusmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupstatusmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
