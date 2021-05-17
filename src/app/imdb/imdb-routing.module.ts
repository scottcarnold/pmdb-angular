import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ImdbSearchComponent } from './imdb-search/imdb-search.component';

const routes: Routes = [
  { path: 'imdbSearch', component: ImdbSearchComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImdbRoutingModule { }
