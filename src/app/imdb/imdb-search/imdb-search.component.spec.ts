import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImdbSearchComponent } from './imdb-search.component';

describe('ImdbSearchComponent', () => {
  let component: ImdbSearchComponent;
  let fixture: ComponentFixture<ImdbSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImdbSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImdbSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
