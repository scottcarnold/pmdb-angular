import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User }  from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string): void {
    //return this.http.post<User>('/api/authenticate', {username, password}).shareReplay();
  }
}
