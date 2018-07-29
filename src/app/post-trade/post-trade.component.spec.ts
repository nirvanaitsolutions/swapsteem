import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTradeComponent } from './post-trade.component';

describe('PostTradeComponent', () => {
  let component: PostTradeComponent;
  let fixture: ComponentFixture<PostTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
