import { Injectable } from '@angular/core';
import { Movie } from './movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() { }

  getMoviesForCollection(): Movie[] {
    return [
      {id: "one", name: "Serenity", attributes: this.getMockMap("Rating", "8.6")},
      {id: "two", name: "Meet Joe Black", attributes: this.getMockMap("Rating", "7.5")},
      {id: "three", name: "Top Secret", attributes: this.getMockMap("Rating", "6.0")},
      {id: "four", name: "Space Balls", attributes: this.getMockMap("Rating", "7.6")},
      {id: "five", name: "Star Trek II: The Wrath of Kahn", attributes: this.getMockMap("Rating", "9.1")},
      {id: "six", name: "Oscar", attributes: this.getMockMap("Rating", "8.8")},
      {id: "seven", name: "Independence Day", attributes: this.getMockMap("Rating", "6.9")},
      {id: "eight", name: "The Family Man", attributes: this.getMockMap("Rating", "7.3")},
    ];
  }

  getMockMap(key: string, val: string): Map<String, String> {
    let map = new Map<String, String>();
    map.set(key, val);
    return map;
  }
}
