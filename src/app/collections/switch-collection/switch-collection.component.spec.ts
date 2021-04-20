import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchCollectionComponent } from './switch-collection.component';

describe('SwitchCollectionComponent', () => {
  let component: SwitchCollectionComponent;
  let fixture: ComponentFixture<SwitchCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchCollectionComponent ]
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
