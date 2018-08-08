import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySbdComponent } from './buy-sbd.component';

describe('BuySbdComponent', () => {
  let component: BuySbdComponent;
  let fixture: ComponentFixture<BuySbdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuySbdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuySbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
