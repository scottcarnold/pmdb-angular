import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImdbRoutingModule } from './imdb-routing.module';
import { ImdbSearchComponent } from './imdb-search/imdb-search.component';


@NgModule({
  declarations: [ImdbSearchComponent],
  imports: [
    CommonModule,
    ImdbRoutingModule
  ]
})
export class ImdbModule { }
