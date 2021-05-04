import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { Collection, CollectionAdapter } from './collection';
import { CollectionInfo, CollectionInfoAdapter } from './collection-info';
import { MessageService } from '../shared/message.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http: HttpClient,
    private ciAdapter: CollectionInfoAdapter,
    private cAdapter: CollectionAdapter,
    private messageService: MessageService) { }

  getDefaultMovieCollection(): Observable<CollectionInfo> {
    return this.http.get(environment.servicesUrl + 'services/collections/default').pipe(
      map((item: any) => this.ciAdapter.adapt(item))
    );
  }

  getViewableMovieCollections(): Observable<CollectionInfo[]> {
    return this.http.get(environment.servicesUrl + 'services/collections/viewable').pipe(
      map((data: any[]) => data.map((item) => this.ciAdapter.adapt(item)))
    );
  }

  getShareOfferMovieCollections(): CollectionInfo[] {
    return [];
  }

  addMovieCollection(movieCollection: Collection): Observable<Collection> {
    return this.http.post(environment.servicesUrl + 'services/collections/new', movieCollection).pipe(
      map((item: any) => this.cAdapter.adapt(item)),
      catchError(error => this.messageService.error('Movie collection could not be created.', error))
    );
  }
}
