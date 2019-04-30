import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySweetComponent } from './buy-sweet.component';

describe('BuySweetComponent', () => {
  let component: BuySweetComponent;
  let fixture: ComponentFixture<BuySweetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuySweetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuySweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
