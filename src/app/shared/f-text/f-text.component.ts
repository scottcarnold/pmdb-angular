import { Component, ElementRef, OnInit, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-f-text',
  templateUrl: './f-text.component.html',
  styleUrls: ['./f-text.component.css']
})
export class FTextComponent implements OnInit, ControlValueAccessor {

  @ViewChild('input', {static: true}) input: ElementRef;
  onChange;
  onTouched;
  disabled: boolean;
  validationMessage: string = '';
  validators;

  constructor(@Self() public controlDir: NgControl) {
    console.log('Constructing FTextComponent for:' + controlDir);
    controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
  }

  writeValue(value: any) {
    console.log(`writing value ${value}`);
    this.input.nativeElement.value = value;
  }

  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
