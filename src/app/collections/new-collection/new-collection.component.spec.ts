import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NewCollectionComponent } from './new-collection.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../../auth/auth.service';
import { MockProvider } from 'ng-mocks';

describe('NewCollectionComponent', () => {
  let component: NewCollectionComponent;
  let fixture: ComponentFixture<NewCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatInputModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      declarations: [ NewCollectionComponent ],
      providers: [
        FormBuilder,
        MockProvider(AuthService)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
