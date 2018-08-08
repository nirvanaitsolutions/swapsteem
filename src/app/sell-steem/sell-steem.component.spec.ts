import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellSteemComponent } from './sell-steem.component';

describe('SellSteemComponent', () => {
  let component: SellSteemComponent;
  let fixture: ComponentFixture<SellSteemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellSteemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellSteemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
