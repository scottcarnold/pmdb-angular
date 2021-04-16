import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User }  from './user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated: boolean = false;
  xAuthToken: string = '';

  constructor(private http: HttpClient) { }

  authenticate(username: string, password: string, callback) {
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(username + ':' + password)
    });
    this.http.get(environment.servicesUrl + 'user', {headers: headers, observe: 'response'}).subscribe(response => {
      if (response['body']['name']) {
        this.authenticated = true;
        console.log(response);
        console.log(response.headers.get('devsessionid'));
        this.xAuthToken = response.headers.get('devsessionid');
      } else {
        this.authenticated = false;
        console.log(response);
      }
      return callback && callback();
    });
  }
}
