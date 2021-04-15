import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Collection } from './collection';
import { CollectionInfo, CollectionInfoAdapter } from './collection-info';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http: HttpClient, private adapter: CollectionInfoAdapter) { }

  getDefaultMovieCollection(): Collection {
    return {
      id: "c1", name: "My Movie Collection", owner: "scott", cloud: false, publicView: false
    };
  }

  getViewableMovieCollections(): Observable<CollectionInfo[]> {
    return this.http.get('services/collections').pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }

  getShareOfferMovieCollections(): CollectionInfo[] {
    return [];
  }
}
