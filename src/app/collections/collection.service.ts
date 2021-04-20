import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Collection } from './collection';
import { CollectionInfo, CollectionInfoAdapter } from './collection-info';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http: HttpClient, private adapter: CollectionInfoAdapter) { }

  getDefaultMovieCollection(): Observable<CollectionInfo> {
    return this.http.get(environment.servicesUrl + 'services/collections/default').pipe(
      map((item: any) => this.adapter.adapt(item))
    );
  }

  getViewableMovieCollections(): Observable<CollectionInfo[]> {
    return this.http.get(environment.servicesUrl + 'services/collections/viewable').pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }

  getShareOfferMovieCollections(): CollectionInfo[] {
    return [];
  }
}
