import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPageComponent } from './buy-page.component';

describe('BuyPageComponent', () => {
  let component: BuyPageComponent;
  let fixture: ComponentFixture<BuyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
