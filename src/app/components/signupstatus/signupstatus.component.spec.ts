import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupstatusComponent } from './signupstatus.component';

describe('SignupstatusComponent', () => {
  let component: SignupstatusComponent;
  let fixture: ComponentFixture<SignupstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
