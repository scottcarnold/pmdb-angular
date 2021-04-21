import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedRoutingModule } from './shared-routing.module';
import { FTextComponent } from './f-text/f-text.component';
import { ValidationDirective } from './validation.directive';
import { FormFieldComponent } from './form-field/form-field.component';


@NgModule({
  declarations: [
    FTextComponent,
    ValidationDirective,
    FormFieldComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    FTextComponent,
    FormFieldComponent,
    ValidationDirective
  ]
})
export class SharedModule { }
