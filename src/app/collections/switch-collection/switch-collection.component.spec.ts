import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { CollectionService } from '../collection.service';
import { MockProvider } from 'ng-mocks';
import { SwitchCollectionComponent } from './switch-collection.component';
import { EMPTY } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SwitchCollectionComponent', () => {
  let component: SwitchCollectionComponent;
  let fixture: ComponentFixture<SwitchCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      declarations: [ SwitchCollectionComponent ],
      providers: [
        MockProvider(CollectionService, {
          getDefaultMovieCollection: () => EMPTY,
          getViewableMovieCollections: () => EMPTY
        }),
        MockProvider(MatDialogRef)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
