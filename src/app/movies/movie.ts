import { Injectable } from "@angular/core";
import { Adapter } from '../core/adapter';

export class Movie {
  id: string;
  name: string;
  collectionId: string;
  attributes: Map<string, string>;

  constructor(id: string, name: string, collectionId: string, attributes: Map<string, string>) {
    this.id = id;
    this.name = name;
    this.collectionId = collectionId;
    this.attributes = attributes;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MovieAdapter implements Adapter<Movie> {
  adapt(item: any): Movie {
    if (item === null || item === undefined) {
      return item;
    } else {
      let attrs = new Map<string, string>();
      for (let [key, value] of Object.entries(item.attributes)) {
        attrs.set(key, value as string);
      }
      return new Movie(item.id, item.title, item.collectionId, attrs);
    }
  }
}
