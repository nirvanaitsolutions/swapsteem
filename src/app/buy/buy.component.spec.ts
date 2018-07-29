
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyComponent } from './buy.component';

describe('BuyComponent', () => {
  let component: BuyComponent;
  let fixture: ComponentFixture<BuyComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
