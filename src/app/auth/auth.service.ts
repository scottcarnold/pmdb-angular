import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User }  from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string): string {
    //this.http.get('test').subscribe(data => this.greeting = data);
    return 'testing';
  }
}
