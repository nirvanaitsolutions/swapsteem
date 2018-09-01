import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBuyBoxComponent } from './search-buy-box.component';

describe('SearchBuyBoxComponent', () => {
  let component: SearchBuyBoxComponent;
  let fixture: ComponentFixture<SearchBuyBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBuyBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBuyBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
