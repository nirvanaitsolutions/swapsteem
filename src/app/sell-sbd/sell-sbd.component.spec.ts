import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellSbdComponent } from './sell-sbd.component';

describe('SellSbdComponent', () => {
  let component: SellSbdComponent;
  let fixture: ComponentFixture<SellSbdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellSbdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellSbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
