import { Injectable } from "@angular/core";
import { Adapter } from '../core/adapter';

export class Movie {
  id: string;
  name: string;
  attributes: Map<String, String>;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
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
      return new Movie(item.id, item.name);
    }
  }
}
