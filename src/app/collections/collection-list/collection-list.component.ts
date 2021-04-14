import { Component, OnInit } from '@angular/core';
import { Collection } from '../collection';
import { CollectionInfo } from '../collection-info';
import { MatTableDataSource } from '@angular/material/table';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit {

  defaultCollection: Collection;
  viewableCollections: CollectionInfo[];
  viewableCollectionsTableDataSource: MatTableDataSource<CollectionInfo>;
  columnsToDisplay: string[] = ['name', 'owner', 'cloud', 'publicView', 'action'];

  constructor(private collectionService: CollectionService) { }

  ngOnInit(): void {
    this.defaultCollection = this.collectionService.getDefaultMovieCollection();
    this.viewableCollections = this.collectionService.getViewableMovieCollections();
    this.viewableCollectionsTableDataSource = new MatTableDataSource<CollectionInfo>(this.viewableCollections);
  }

}
