import { Component, OnInit, ViewChild } from '@angular/core';
import { Collection } from '../collection';
import { CollectionInfo } from '../collection-info';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit {

  defaultCollection: CollectionInfo;
  viewableCollections: CollectionInfo[];
  viewableCollectionsTableDataSource: MatTableDataSource<CollectionInfo>;
  columnsToDisplay: string[] = ['name', 'owner', 'cloud', 'publicView', 'action'];
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private collectionService: CollectionService) { }

  ngOnInit(): void {
    this.collectionService.getDefaultMovieCollection().subscribe(
      collectionInfo => { this.defaultCollection = collectionInfo; }
    );
    this.viewableCollectionsTableDataSource = new MatTableDataSource<CollectionInfo>([]);
    this.collectionService.getViewableMovieCollections().subscribe(
      collectionInfos => { this.viewableCollectionsTableDataSource.data = collectionInfos; }
    );

  }

}
