import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesRoutingModule } from './movies-routing.module';
import { MovieListComponent } from './movie-list/movie-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { SharedModule } from '../shared/shared.module';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { TableColumnsComponent } from './table-columns/table-columns.component';


@NgModule({
  declarations: [MovieListComponent, EditMovieComponent, MovieDetailComponent, TableColumnsComponent],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    DragDropModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class MoviesModule { }
