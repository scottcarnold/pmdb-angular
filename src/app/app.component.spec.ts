import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { CollectionsModule } from './collections/collections.module';
import { AuthService } from './auth/auth.service';
import { MockModule, MockProvider } from 'ng-mocks';
import { HttpClientModule } from '@angular/common/http';
import { CollectionService } from './collections/collection.service';
import { EMPTY, Subject } from 'rxjs';
import { CollectionInfo } from './collections/collection-info';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from './auth/user';
import { AuthModule } from './auth/auth.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AuthModule,
        SharedModule,
        CollectionsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        MockProvider(AuthService, {
          userEvent: new Subject<User>()
        }),
        MockProvider(CollectionService, {
          getDefaultMovieCollection: () => EMPTY,
          getViewableMovieCollections: () => EMPTY,
          getShareOfferMovieCollections: () => EMPTY,
          shareOffersChangeEvent: new Subject<number>(),
          defaultCollectionChangeEvent: new Subject<CollectionInfo>()
        }),
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'pmdb-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('pmdb-angular');
  });
});
