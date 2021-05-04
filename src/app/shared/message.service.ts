import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  message: string = null;
  severity: 'info' | 'warn' | 'error';
  navcount: number = 0;

  constructor(private errorService: ErrorService) { }

  info(message: string) {
    if (this.severity != 'warn' && this.severity != 'error') {
      // warn and error messages takes precedence over info message until cleared
      this.message = message;
      this.severity = 'info';
    }
  }

  warn(message: string) {
    if (this.severity != 'error') {
      // error message takes precedence over warn message until cleared
      this.message = message;
      this.severity = 'warn';
    }
  }

  error(message: string, error: any): Observable<any> {
    this.message = message;
    this.severity = 'error';
    return this.errorService.handleError(message, error);
  }

  clear() {
    this.message = null;
    this.severity = 'info';
    this.navcount = 0;
  }

  clearOnNav(count: number) {
    if (this.message != null) {
      this.navcount++;
      if (this.navcount > count) {
        this.clear();
      }
    }
  }
}
