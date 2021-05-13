import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData } from './auth-data';
import { User }  from './user';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../shared/local-storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginAttempts = 0;
  userEvent: Subject<User>;

  private AUTH_DATA_KEY: string = 'PMDB_AUTH_DATA_OBJ';

  constructor(private http: HttpClient, private router: Router, private localStorageService: LocalStorageService) {
    console.log('AuthService constructor called');
    this.userEvent = new Subject<User>()
  }

  authenticate(username: string, password: string, callback) {
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(username + ':' + password)
    });
    this.loginAttempts++;
    this.http.get(environment.servicesUrl + 'authenticate', {headers: headers, observe: 'response'}).subscribe(response => {
      if (response['body']['name']) {
        this.loginAttempts = 0;
        console.log(response);
        let xAuthToken = response.headers.get('devsessionid');
        let user = { name: response['body']['name'], authorities: response['body']['authorities'] };
        let authData: AuthData = { user: user, xAuthToken: xAuthToken };
        this.localStorageService.set(this.AUTH_DATA_KEY, authData);
        this.userEvent.next(user);
      } else {
        this.localStorageService.remove(this.AUTH_DATA_KEY);
        console.log('no authenticated user in response: ', response);
        this.userEvent.next(null);
      }
      return callback && callback();
    });
  }

  logout() {
    this.http.post(environment.servicesUrl + 'logout', {}).subscribe(() => {
      this.localStorageService.remove(this.AUTH_DATA_KEY);
      this.loginAttempts = 0;
      this.router.navigateByUrl('login');
      this.userEvent.next(null);
    });
  }

  isUserAuthenticated(): boolean {
    let authData = this.localStorageService.get(this.AUTH_DATA_KEY);
    return (authData != null && authData != undefined);
  }

  getUser(): User {
    let authData: AuthData = this.localStorageService.get(this.AUTH_DATA_KEY);
    if (authData != null && authData != undefined) {
      return authData.user;
    }
    return null;
  }

  getXAuthToken(): string {
    let authData: AuthData = this.localStorageService.get(this.AUTH_DATA_KEY);
    if (authData != null && authData != undefined) {
      return authData.xAuthToken;
    }
    return '';
  }
}
