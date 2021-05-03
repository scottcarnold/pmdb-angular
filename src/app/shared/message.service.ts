import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  message: string;
  severity: 'info' | 'warn' | 'error';

  constructor() { }

  info(message: string) {
    this.message = message;
    this.severity = 'info';
  }

  warn(message: string) {
    this.message = message;
    this.severity = 'warn';
  }

  error(message: string) {
    this.message = message;
    this.severity = 'error';
  }

  clear() {
    this.message = null;
    this.severity = 'info';
  }
}
