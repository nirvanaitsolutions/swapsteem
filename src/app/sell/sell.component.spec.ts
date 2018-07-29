
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellComponent } from './sell.component';

describe('SellComponent', () => {
  let component: SellComponent;
  let fixture: ComponentFixture<SellComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
