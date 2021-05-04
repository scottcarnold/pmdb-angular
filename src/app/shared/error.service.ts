import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  handleError(msg: string, error: any): Observable<any> {
    console.log(msg + '  Error: ', error);
    return of([]);
  }
}
