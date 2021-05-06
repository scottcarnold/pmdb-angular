import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { Movie, MovieAdapter } from './movie';
import { MessageService } from '../shared/message.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private moviesUrl: string;

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
}
