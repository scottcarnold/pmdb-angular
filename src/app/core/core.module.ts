// Core module contains application-wide artifacts that don't fit elsewhere (LA:119)

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { NavComponent } from './nav/nav.component';
import { CoreRoutingModule } from './core-routing.module';



@NgModule({
  declarations: [FooterComponent, NavComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule
  ],
  exports: [NavComponent, FooterComponent]
})
export class CoreModule { }
