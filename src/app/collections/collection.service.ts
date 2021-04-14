import { Injectable } from '@angular/core';
import { Collection } from './collection';
import { CollectionInfo } from './collection-info';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor() { }

  getDefaultMovieCollection(): Collection {
    return {
      id: "c1", name: "My Movie Collection", owner: "scott", cloud: false, publicView: false
    };
  }

  getViewableMovieCollections(): CollectionInfo[] {
    return [
      {
        collection: {id: "c1", name: "My Movie Collection", owner: "scott", cloud: false, publicView: false},
        editable: true
      },
      {
        collection: {id: "c2", name: "Cool Movie Collection", owner: "snoopy", cloud: false, publicView: false},
        editable: false
      }
    ];
  }

  getShareOfferMovieCollections(): CollectionInfo[] {
    return [];
  }
}
