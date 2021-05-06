import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { CollectionService } from '../../collections/collection.service';
import { Movie } from '../movie';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CollectionInfo } from 'src/app/collections/collection-info';

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
  columnsToDisplay: string[] = ['name', 'Imdb Rating'];
  defaultCollectionInfo: CollectionInfo;

  constructor(private movieService: MovieService, private collectionService: CollectionService) { }

  ngAfterViewInit() {
    this.moviesTableDataSource.paginator = this.paginator;
    this.moviesTableDataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.attrNames = ['Imdb Rating'];
    this.moviesTableDataSource = new MatTableDataSource<Movie>([]);
    this.collectionService.getDefaultMovieCollection().subscribe(collectionInfo => {
      this.defaultCollectionInfo = collectionInfo;
      this.loadMovies();
    });
  }

  loadMovies(): void {
    if (this.defaultCollectionInfo === null || this.defaultCollectionInfo === undefined) {
      this.movies = null;
      this.moviesTableDataSource.data = [];
    } else {
      this.movieService.getMoviesForCollection(this.defaultCollectionInfo.collection.id).subscribe(movies => {
        this.movies = movies;
        this.moviesTableDataSource.data = movies;
      });
    }
  }
}
