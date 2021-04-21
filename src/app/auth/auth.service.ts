import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User }  from './user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginAttempts = 0;
  authenticated: boolean = false;
  xAuthToken: string = '';

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string, callback) {
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(username + ':' + password)
    });
    this.loginAttempts++;
    console.log('calling authenticate request');
    this.http.get(environment.servicesUrl + 'authenticate', {headers: headers, observe: 'response'}).subscribe(response => {
      console.log('handling response from authenticate request');
      if (response['body']['name']) {
        this.authenticated = true;
        this.loginAttempts = 0;
        console.log(response);
        console.log(response.headers.get('devsessionid'));
        this.xAuthToken = response.headers.get('devsessionid');
      } else {
        this.authenticated = false;
        console.log(response);
      }
      console.log(`authenticated: ${this.authenticated}`);
      return callback && callback();
    });
  }
}
