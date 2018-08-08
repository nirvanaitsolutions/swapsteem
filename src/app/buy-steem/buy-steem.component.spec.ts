import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySteemComponent } from './buy-steem.component';

describe('BuySteemComponent', () => {
  let component: BuySteemComponent;
  let fixture: ComponentFixture<BuySteemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuySteemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuySteemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
