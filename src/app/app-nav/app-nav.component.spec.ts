
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppNavComponent } from './app-nav.component';

describe('AppNavComponent', () => {
  let component: AppNavComponent;
  let fixture: ComponentFixture<AppNavComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [AppNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
