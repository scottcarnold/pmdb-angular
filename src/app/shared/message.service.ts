import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  message: string;
  severity: 'info' | 'warn' | 'error';

  constructor(private errorService: ErrorService) { }

  info(message: string) {
    this.message = message;
    this.severity = 'info';
  }

  warn(message: string) {
    this.message = message;
    this.severity = 'warn';
  }

  error(message: string, error: any): Observable<any> {
    this.message = message;
    this.severity = 'error';
    return this.errorService.handleError(message, error);
  }

  clear() {
    this.message = null;
    this.severity = 'info';
  }
}
