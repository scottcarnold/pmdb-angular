import { Component, ContentChild, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css']
})
export class FormFieldComponent implements OnInit {

  @Input() public label: string;
  @Input() public control: FormControl;
  @Input() public appearance: 'legacy' | 'fill' | 'standard' | 'outline';
  @Input() public class: string;

  @ContentChild(MatFormFieldControl, {static: true})
  public formFieldControl: MatFormFieldControl<any>;

  @ViewChild('materialFormField', {static: true})
  public matFormField: MatFormField;

  constructor() { }

  ngOnInit(): void {
    this.matFormField._control = this.formFieldControl;
  }

}
