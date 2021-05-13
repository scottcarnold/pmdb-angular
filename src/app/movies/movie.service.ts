import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { Movie, MovieAdapter } from './movie';
import { MessageService } from '../shared/message.service';
import { environment } from '../../environments/environment';
import { ImdbAttributeKey, AttributeType } from './movie-attributes';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private moviesUrl: string;
  private attributeTypeMap: Map<string, AttributeType> = new Map([
    [ImdbAttributeKey.ID, AttributeType.STRING],
    [ImdbAttributeKey.YEAR, AttributeType.NUMBER],
    [ImdbAttributeKey.GENRE, AttributeType.STRING],
    [ImdbAttributeKey.RATED, AttributeType.STRING],
    [ImdbAttributeKey.PLOT, AttributeType.STRING],
    [ImdbAttributeKey.ACTORS, AttributeType.STRING],
    [ImdbAttributeKey.DIRECTOR, AttributeType.STRING],
    [ImdbAttributeKey.AWARDS, AttributeType.STRING],
    [ImdbAttributeKey.URL, AttributeType.STRING],
    [ImdbAttributeKey.RATING, AttributeType.NUMBER],
    [ImdbAttributeKey.VOTES, AttributeType.NUMBER],
    [ImdbAttributeKey.LANGUAGE, AttributeType.STRING],
    [ImdbAttributeKey.METASCORE, AttributeType.NUMBER],
    [ImdbAttributeKey.POSTER, AttributeType.STRING],
    [ImdbAttributeKey.RELEASED, AttributeType.DATE],
    [ImdbAttributeKey.RUNTIME, AttributeType.STRING],
    [ImdbAttributeKey.TYPE, AttributeType.STRING],
    [ImdbAttributeKey.COUNTRY, AttributeType.STRING]
  ]);

  constructor(private http: HttpClient, private adapter: MovieAdapter, private messageService: MessageService) {
    this.moviesUrl = environment.servicesUrl + environment.moviesPath;
  }

  getMoviesForCollection(collectionId: string): Observable<Movie[]> {
    return this.http.get(this.moviesUrl + 'allMovies',
      {params: new HttpParams().append('collectionId', collectionId)}).pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item))),
      catchError(error => this.messageService.error('Unable to load movies for collection.', error))
    );
  }

  searchMoviesForCollection(collectionId: string, searchFor: string): Observable<Movie[]> {
    return this.http.get(this.moviesUrl + 'searchMovies',
      {params: new HttpParams().append('collectionId', collectionId).append('searchFor', searchFor)}).pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item))),
      catchError(error => this.messageService.error('Unable to search movies for collection.', error))
    );
  }

  getAttributeKeysForCollection(collectionId: string): Observable<string[]> {
    return this.http.get(this.moviesUrl + 'attributeKeys',
    {params: new HttpParams().append('collectionId', collectionId)}).pipe(
      catchError(error => this.messageService.error('Unable to lookup attribute keys for collection.', error))
    )
  }

  getAttributeKeysForDefaultCollection(): Observable<string[]> {
    return this.http.get(this.moviesUrl + 'defaultAttributeKeys').pipe(
      catchError(error => this.messageService.error('Unable to lookup attribute keys for default collection.', error))
    )
  }

  getMovie(movieId: string): Observable<Movie> {
    return this.http.get(this.moviesUrl + 'getMovie',
    {params: new HttpParams().append('movieId', movieId)}).pipe(
      map((item: any) => this.adapter.adapt(item)),
      catchError(error => this.messageService.error('Unable to get the requested movie.', error))
    )
  }

  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post(this.moviesUrl + 'addMovie', this.adapter.format(movie)).pipe(
      map((item: any) => this.adapter.adapt(item)),
      catchError(error => this.messageService.error('Movie could not be added.', error))
    )
  }

  updateMovie(movie: Movie): Observable<boolean> {
    return this.http.post<boolean>(this.moviesUrl + 'updateMovie', this.adapter.format(movie)).pipe(
      catchError(error => this.messageService.error('Movie could not be updated.', error))
    );
  }

  deleteMovie(movieId: string): Observable<any> {
    return this.http.post(this.moviesUrl + 'deleteMovie', movieId).pipe(
      catchError(error => this.messageService.error('Movie could not be deleted.', error))
    );
  }

  getTableColumnPreferences(): Observable<string[]> {
    return this.http.get(this.moviesUrl + 'getTableColumnPreferences').pipe(
      catchError(error => this.messageService.error('Unable to get table column information.', error))
    )
  }

  addTableColumnPreference(attributeName: string): Observable<any> {
    return this.http.post(this.moviesUrl + 'addTableColumnPreference', attributeName).pipe(
      catchError(error => this.messageService.error('Unable to add table column.', error))
    );
  }

  deleteTableColumnPreference(idx: number): Observable<any> {
    return this.http.post(this.moviesUrl + 'deleteTableColumnPreference', idx).pipe(
      catchError(error => this.messageService.error('Unable to remove table column.', error))
    );
  }

  reorderTableColumnPreference(previous: number, current: number): Observable<any> {
    const reorderArray = [previous, current];
    return this.http.post(this.moviesUrl + 'reorderTableColumnPreference', reorderArray).pipe(
      catchError(error => this.messageService.error('Unable to reorder table columns.', error))
    );
  }

  registerAttributeType(attributeKey: string, attributeType: AttributeType) {
    this.attributeTypeMap.set(attributeKey, attributeType);
  }

  isNumberAttribute(attributeKey: string): boolean {
    let attributeType = this.attributeTypeMap.get(attributeKey);
    return (attributeType === AttributeType.NUMBER);
  }

  isDateAttribute(attributeKey: string): boolean {
    let attributeType = this.attributeTypeMap.get(attributeKey);
    return (attributeType === AttributeType.DATE);
  }

  numberAttributeSortValue(value: string): number {
    if (value === undefined || value === null) {
      return 0;
    }
    return +value;
  }

  dateAttributeSortValue(value: string): number {
    if (value === undefined || value === null) {
      return 0;
    }
    return new Date(value).getTime();
  }
}
