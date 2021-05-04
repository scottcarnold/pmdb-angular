import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedRoutingModule } from './shared-routing.module';
import { FTextComponent } from './f-text/f-text.component';
import { ValidationDirective } from './validation.directive';
import { FormFieldComponent } from './form-field/form-field.component';
import { MessagesComponent } from './messages/messages.component';
import { ConfirmComponent } from './confirm/confirm.component';


@NgModule({
  declarations: [
    FTextComponent,
    ValidationDirective,
    FormFieldComponent,
    MessagesComponent,
    ConfirmComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    FTextComponent,
    FormFieldComponent,
    ValidationDirective,
    MessagesComponent
  ]
})
export class SharedModule { }
