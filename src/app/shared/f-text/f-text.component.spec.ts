import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FTextComponent } from './f-text.component';

describe('FTextComponent', () => {
  let component: FTextComponent;
  let fixture: ComponentFixture<FTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
