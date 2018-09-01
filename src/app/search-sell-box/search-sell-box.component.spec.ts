import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSellBoxComponent } from './search-sell-box.component';

describe('SearchSellBoxComponent', () => {
  let component: SearchSellBoxComponent;
  let fixture: ComponentFixture<SearchSellBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSellBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSellBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
