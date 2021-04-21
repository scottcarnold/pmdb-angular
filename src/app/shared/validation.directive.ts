import { Directive, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Validation } from './validation';


@Directive({
  selector: '[appValidation]'
})
export class ValidationDirective implements OnInit, OnDestroy {

  @Input('appValidation') public control: FormControl;
  @Input() public fieldName: string;

  public errorMessage$: Subscription;
  private messages = Validation.MESSAGES;

  constructor(private element: ElementRef) { }

  ngOnInit(): void {
    if (this.control === null || this.control === undefined) {
      return;
    }
    this.errorMessage$ = this.control.valueChanges.pipe(
      map(() => {
        const { dirty, invalid, touched } = this.control;
        return (dirty || touched) && invalid ? this.getErrorMessage() : '';
      })
    ).subscribe(message => {
      this.element.nativeElement.innerText = message || '';
    });
  }

  ngOnDestroy(): void {
    if (this.errorMessage$) {
      this.errorMessage$.unsubscribe();
    }
  }

  private getErrorMessage(): string {
    const {
      control: { errors, value },
      fieldName,
      messages
    } = this;
    if (!errors) {
      return;
    }
    for (const key in messages) {
      if (!errors.hasOwnProperty(key)) {
        continue;
      }
      const message = messages[key];
      if (message === null || message === undefined) {
        return `No message found for ${key} validator.`;
      }
      const messageData = {
        ...errors[key],
        value,
        fieldName
      };
      return this.formatString(message, messageData);
    }
    throw new Error('Error message undefined for one or more errors.  Errors: ' + JSON.stringify(errors));
  }

  private formatString(template: string, data: any = {}) {
    Object.keys(data).forEach(key => {
      template = template.replace(new RegExp('{{' + key + '}}', 'g'), data[key]);
    });
    return template;
  }
}
