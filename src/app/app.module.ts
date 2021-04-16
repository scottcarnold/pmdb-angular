import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { MoviesModule } from './movies/movies.module';
import { CollectionsModule } from './collections/collections.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth/auth.service';


@Injectable()
export class XhrInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers
        .set('X-Requested-With', 'XMLHttpRequest')         // this will prevent the browser login popup since we are using HTTP Basic but with our own separate form
        .set('X-Auth-Token', this.authService.xAuthToken)  // this provides the session id to the backend (really only needed to support using ng serve during development)
    });
    return next.handle(xhr);
  }
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
    MoviesModule,
    CollectionsModule,
    BrowserAnimationsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
