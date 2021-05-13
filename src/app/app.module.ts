import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { MoviesModule } from './movies/movies.module';
import { CollectionsModule } from './collections/collections.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


@Injectable()
export class XhrInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
    private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers
        .set('X-Requested-With', 'XMLHttpRequest')         // this will prevent the browser login popup since we are using HTTP Basic but with our own separate form
        .set('X-Auth-Token', this.authService.getXAuthToken())  // this provides the session id to the backend (really only needed to support using ng serve during development)
    });
    return next.handle(xhr).pipe(catchError(x => this.handleAuthError(x)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // if user is unauthorized for a request, route them to the login page
    console.log('error status: ', err.status);
    if (err.status == 401) {  // not checking 403 as we are using 403 to indicate insufficient permissions witch isn't a log in issue
      if (this.authService.loginAttempts > 0) {
        this.router.navigate(['/login', this.authService.loginAttempts])
      } else {
        this.router.navigate(['/login']);
      }
    }
    return throwError(err);
  }
}

const matFormFieldDefaultOptions: MatFormFieldDefaultOptions = {
  appearance: 'outline'
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    CoreModule,
    SharedModule,
    MoviesModule,
    CollectionsModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: matFormFieldDefaultOptions}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
