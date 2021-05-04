import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  handleError(msg: string, error: any): Observable<any> {
    console.log(msg + '  Error: ', error);
    return EMPTY;
    // returning EMPTY will prevent subscribe function from being called as desired for this app;
    // (returning of([]) would have a different affect)
  }
}
