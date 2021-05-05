import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User }  from './user';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginAttempts = 0;
  authenticated: boolean = false;
  xAuthToken: string = '';
  user: User;
  userEvent: Subject<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.userEvent = new Subject<User>()
  }

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
        this.user = { name: response['body']['name'] };
      } else {
        this.authenticated = false;
        console.log(response);
      }
      console.log(`authenticated: ${this.authenticated}`);
      this.userEvent.next(this.user);
      return callback && callback();
    });
  }

  logout() {
    console.log('calling logout function on back end');
    this.http.post(environment.servicesUrl + 'logout', {}).subscribe(() => {
      console.log('executing logout steps on subscribe');
      this.user = null;
      this.authenticated = false;
      this.xAuthToken = '';
      this.loginAttempts = 0;
      this.router.navigateByUrl('login');
      this.userEvent.next(this.user);
    });
  }
}
