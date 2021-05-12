import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MovieDetailComponent } from './movie-detail.component';
import { MovieService } from '../movie.service';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { Movie } from '../movie';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, RouterTestingModule, MatIconModule, MatGridListModule ],
      declarations: [ MovieDetailComponent ],
      providers: [
        MockProvider(MovieService, {
          getMovie: (movieId) => of(new Movie(movieId, 'Test Movie', '1234', new Map()))
        })
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
