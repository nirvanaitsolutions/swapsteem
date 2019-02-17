import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponentComponent } from './banner-component.component';

describe('BannerComponentComponent', () => {
  let component: BannerComponentComponent;
  let fixture: ComponentFixture<BannerComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
