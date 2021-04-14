import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit, AfterViewInit {

  movies: Movie[];
  attrNames: string[];
  moviesTableDataSource: MatTableDataSource<Movie>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  columnsToDisplay: string[] = ['name', 'Rating'];

  constructor(private movieService: MovieService) { }

  ngAfterViewInit() {
    this.moviesTableDataSource.paginator = this.paginator;
    this.moviesTableDataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.movies = this.movieService.getMoviesForCollection();
    this.attrNames = ['Rating'];
    this.moviesTableDataSource = new MatTableDataSource<Movie>(this.movies);
  }

}
