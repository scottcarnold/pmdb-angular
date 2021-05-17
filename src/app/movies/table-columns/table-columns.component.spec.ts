import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';
import { TableColumnsComponent } from './table-columns.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TableColumnsComponent', () => {
  let component: TableColumnsComponent;
  let fixture: ComponentFixture<TableColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableColumnsComponent ],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatIconModule
      ],
      providers: [
        MockProvider(MovieService, {
          getMovie: (movieId) => of(new Movie(movieId, 'Test Movie', '1234', new Map())),
          getTableColumnPreferences: () => of([]),
          getAttributeKeysForDefaultCollection: () => of(['Rated'])
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
