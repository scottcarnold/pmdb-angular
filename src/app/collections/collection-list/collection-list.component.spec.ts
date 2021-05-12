import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { CollectionListComponent } from './collection-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { EMPTY, Subject } from 'rxjs';
import { CollectionService } from '../collection.service';

describe('CollectionListComponent', () => {
  let component: CollectionListComponent;
  let fixture: ComponentFixture<CollectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, RouterTestingModule, MatCardModule, MatTableModule ],
      declarations: [ CollectionListComponent ],
      providers: [
        MockProvider(MatDialog),
        MockProvider(MatDialogRef),
        MockProvider(CollectionService, {
          getDefaultMovieCollection: () => EMPTY,
          getViewableMovieCollections: () => EMPTY,
          getShareOfferMovieCollections: () => EMPTY,
          shareOffersChangeEvent: new Subject<number>()
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
