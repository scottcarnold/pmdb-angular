import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { CollectionService } from '../../collections/collection.service';
import { Movie } from '../movie';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CollectionInfo } from 'src/app/collections/collection-info';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  columnsToDisplay: string[] = ['name'];
  defaultCollectionInfo: CollectionInfo;
  movieSearchForm = this.formBuilder.group({
    search: ['', []]
  });
  private lastSearchFor: string = '';

  constructor(private movieService: MovieService,
    private collectionService: CollectionService,
    private formBuilder: FormBuilder) { }

  ngAfterViewInit() {
    this.moviesTableDataSource.paginator = this.paginator;
    this.moviesTableDataSource.sortingDataAccessor = (item, property) => {
      if (property === 'name') {
        return item.name;
      }
      if (this.movieService.isNumberAttribute(property)) {
        return this.movieService.numberAttributeSortValue(item.attributes.get(property));
      }
      if (this.movieService.isDateAttribute(property)) {
        return this.movieService.dateAttributeSortValue(item.attributes.get(property));
      }
      // treat anything else as string
      return item.attributes.get(property);
    }
    this.moviesTableDataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.columnsToDisplay = ['name'];
    this.attrNames = [];
    this.moviesTableDataSource = new MatTableDataSource<Movie>([]);
    this.collectionService.getDefaultMovieCollection().subscribe(collectionInfo => {
      this.defaultCollectionInfo = collectionInfo;
      this.loadMovies();
    });
    this.movieSearchForm.get('search').valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(value => this.search(value));
  }

  loadMovies(): void {
    this.columnsToDisplay = ['name'];
    if (this.defaultCollectionInfo === null || this.defaultCollectionInfo === undefined) {
      this.movies = null;
      this.moviesTableDataSource.data = [];
      this.attrNames = [];
    } else {
      this.movieService.getAttributeKeysForCollection(this.defaultCollectionInfo.collection.id).subscribe(attributeKeys => {
        this.attrNames = attributeKeys;
        // don't populate columns to display until we have all of the attribute names to define the columns
        this.movieService.getTableColumnPreferences().subscribe(tableColumns => {
          // if none of our movies in the collection have a particular column preference,
          // the Material table will cry foul.  Therefore, only add columns that are in the attrNames array
          tableColumns.forEach(column => {
            if (this.attrNames.includes(column)) {
              this.columnsToDisplay.push(column);
            }
          });
        });
      });
      this.movieService.getMoviesForCollection(this.defaultCollectionInfo.collection.id).subscribe(movies => {
        this.movies = movies;
        this.moviesTableDataSource.data = movies;
      });
    }
  }

  onSearch(): void {
    this.search(this.movieSearchForm.get('search').value);
  }

  private search(searchFor: string): void {
    if (this.lastSearchFor === searchFor) {
      return; // this will prevent the field subscription from duplicating a search initiated by the button
    }
    this.lastSearchFor = searchFor;
    if (searchFor.length == 0) {
      this.loadMovies();
      return;
    }
    if (this.defaultCollectionInfo != null && this.defaultCollectionInfo != undefined) {
      this.movieService.searchMoviesForCollection(this.defaultCollectionInfo.collection.id, searchFor).subscribe(movies => {
        this.movies = movies;
        this.moviesTableDataSource.data = movies;
      });
    }
  }
}
