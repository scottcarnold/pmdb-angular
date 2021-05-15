import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData } from './auth-data';
import { User }  from './user';
import { LocalStorageService } from '../shared/local-storage.service';
import { environment } from '../../environments/environment';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginAttempts = 0;
  authData: AuthData;

  private AUTH_DATA_KEY: string = 'PMDB_AUTH_DATA_OBJ';

  constructor(private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService) {
    console.log('AuthService constructor called');
    this.localStorageService.register(this.AUTH_DATA_KEY, false, 0);
  }

  authenticate(username: string, password: string, callback) {
    console.log('authenticating user login');
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(username + ':' + password)
    });
    this.loginAttempts++;
    console.log('calling local storage handleUserChange');
    this.localStorageService.handleUserChange();
    console.log('calling authenticate operation on back end service');
    this.http.get(environment.servicesUrl + 'authenticate', {headers: headers, observe: 'response'}).subscribe(response => {
      if (response['body']['name']) {
        this.loginAttempts = 0;
        console.log(response);
        let xAuthToken = response.headers.get('devsessionid');
        let user = { name: response['body']['name'], authorities: response['body']['authorities'] };
        this.authData = { user: user, xAuthToken: xAuthToken };
        this.localStorageService.set(this.AUTH_DATA_KEY, this.authData);
      } else {
        this.localStorageService.remove(this.AUTH_DATA_KEY);
        this.authData = null;
        console.log('no authenticated user in response: ', response);
      }
      return callback && callback();
    });
  }

  clearAuthentication() {
    this.localStorageService.handleUserChange();
    this.localStorageService.remove(this.AUTH_DATA_KEY);
    this.authData = null;
    console.log('authentication information cleared.');
  }

  logout() {
    this.http.post(environment.servicesUrl + 'logout', {}).subscribe(() => {
      this.localStorageService.handleUserChange();
      this.localStorageService.remove(this.AUTH_DATA_KEY);
      this.authData = null;
      this.loginAttempts = 0;
      this.router.navigateByUrl('login');
    });
  }

  private getAuthData(by: string): AuthData {
    if (this.authData === null || this.authData === undefined) {
      this.authData = this.localStorageService.get(this.AUTH_DATA_KEY, by);
    }
    return this.authData;
  }

  isUserAuthenticated(): boolean {
    let authData = this.getAuthData('isUserAuthenticated');
    return (authData != null && authData != undefined);
  }

  getUser(): User {
    let authData: AuthData = this.getAuthData('getUser');
    if (authData != null && authData != undefined) {
      return authData.user;
    }
    return null;
  }

  getXAuthToken(): string {
    let authData: AuthData = this.getAuthData('getXAuthToken');
    if (authData != null && authData != undefined) {
      if (authData.xAuthToken != null && authData.xAuthToken != undefined) {
        return authData.xAuthToken;
      }
    }
    return '';
  }
}
