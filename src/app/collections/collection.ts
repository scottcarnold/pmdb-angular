import { Injectable } from "@angular/core";
import { Adapter } from '../core/adapter';

export class Collection {

  id: string;
  name: string;
  owner: string;
  cloud: boolean;
  publicView: boolean;

  constructor(
    id: string,
    name: string,
    owner: string,
    cloud: boolean,
    publicView: boolean
  ) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.cloud = cloud;
    this.publicView = publicView;
  }

}

@Injectable({
  providedIn: 'root'
})
export class CollectionAdapter implements Adapter<Collection> {
  adapt(item: any): Collection {
    if (item === null || item === undefined) {
      return item;
    } else {
      return new Collection(item.id, item.name, item.owner, item.cloud, item.publicView);
    }
  }
}
