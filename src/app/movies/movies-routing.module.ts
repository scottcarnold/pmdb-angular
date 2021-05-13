import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { TableColumnsComponent } from './table-columns/table-columns.component';

const routes: Routes = [
  { path: 'movies', component: MovieListComponent, canActivate: [AuthGuard] },
  { path: 'addMovie', component: EditMovieComponent, canActivate: [AuthGuard] },
  { path: 'editMovie/:id', component: EditMovieComponent, canActivate: [AuthGuard] },
  { path: 'movieDetail/:id', component: MovieDetailComponent, canActivate: [AuthGuard] },
  { path: 'tableColumns', component: TableColumnsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
