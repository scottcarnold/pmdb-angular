import { Injectable } from "@angular/core";
import { Collection, CollectionAdapter } from './collection';
import { Adapter } from '../core/adapter';

export class CollectionInfo {

  collection: Collection;
  editable: boolean;
  owned: boolean;

  constructor(
    collection: Collection,
    editable: boolean,
    owned: boolean
  ) {
    this.collection = collection;
    this.editable = editable;
    this.owned = owned;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CollectionInfoAdapter implements Adapter<CollectionInfo> {
  adapt(item: any): CollectionInfo {
    if (item === null || item === undefined) {
      return item;
    } else {
      let collection = new CollectionAdapter().adapt(item.movieCollection);
      return new CollectionInfo(collection, item.editable, item.owned);
    }
  }
}
