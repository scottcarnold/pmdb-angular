import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { EditMovieComponent } from './edit-movie/edit-movie.component';

const routes: Routes = [
  { path: 'movies', component: MovieListComponent, canActivate: [AuthGuard] },
  { path: 'addMovie', component: EditMovieComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
