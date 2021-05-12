import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { EditMovieComponent } from './edit-movie.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { SharedModule } from '../../shared/shared.module';
import { MockProvider } from 'ng-mocks';
import { CollectionService } from '../../collections/collection.service';
import { MovieService } from '../movie.service';
import { CollectionInfo } from '../../collections/collection-info';
import { Movie } from '../movie';
import { EMPTY, of, Subject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditMovieComponent', () => {
  let component: EditMovieComponent;
  let fixture: ComponentFixture<EditMovieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatGridListModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [ EditMovieComponent ],
      providers: [
        FormBuilder,
        MockProvider(CollectionService, {
          getDefaultMovieCollection: () => EMPTY,
          getViewableMovieCollections: () => EMPTY,
          getShareOfferMovieCollections: () => EMPTY,
          shareOffersChangeEvent: new Subject<number>(),
          defaultCollectionChangeEvent: new Subject<CollectionInfo>()
        }),
        MockProvider(MovieService, {
          getMovie: (movieId) => of(new Movie(movieId, 'Test Movie', '1234', new Map()))
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
