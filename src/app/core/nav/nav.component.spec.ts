import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NavComponent } from './nav.component';
import { MockProvider } from 'ng-mocks';
import { EMPTY, Subject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CollectionService } from '../../collections/collection.service';
import { User } from 'src/app/auth/user';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        HttpClientModule,
        RouterTestingModule
      ],
      providers: [
        MockProvider(AuthService, {
          userEvent: new Subject<User>()
        }),
        MockProvider(CollectionService, {
          getDefaultMovieCollection: () => EMPTY,
          getViewableMovieCollections: () => EMPTY,
          shareOffersChangeEvent: new Subject<number>()
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
