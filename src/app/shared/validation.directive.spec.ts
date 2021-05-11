import { Component, DebugElement, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationDirective } from './validation.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<span [appValidation]="loginForm.get('testControl')" fieldName="testField"></span>`
})
class TestValidationDirective {
  loginForm = this.formBuilder.group({
    testControl: ['', [Validators.required]]
  });
  constructor(private formBuilder: FormBuilder) { }
}

describe('ValidationDirective', () => {

  let component: TestValidationDirective;
  let fixture: ComponentFixture<TestValidationDirective>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestValidationDirective, ValidationDirective],
      providers: [FormBuilder]
    });
    fixture = TestBed.createComponent(TestValidationDirective);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('span'));
  });

  it('should create an instance', () => {
    const directive = new ValidationDirective(inputEl);
    expect(directive).toBeTruthy();
  });
});
