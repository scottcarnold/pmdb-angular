import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from '../collection';
import { CollectionInfo } from '../collection-info';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CollectionService } from '../collection.service';
import { SwitchCollectionComponent } from '../switch-collection/switch-collection.component';

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

  constructor(private collectionService: CollectionService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.collectionService.getDefaultMovieCollection().subscribe(
      collectionInfo => { this.defaultCollection = collectionInfo; }
    );
    this.viewableCollectionsTableDataSource = new MatTableDataSource<CollectionInfo>([]);
    this.collectionService.getViewableMovieCollections().subscribe(
      collectionInfos => { this.viewableCollectionsTableDataSource.data = collectionInfos; }
    );

  }

  openSwitchCollectionDialog(): void {
    const dialogRef = this.dialog.open(SwitchCollectionComponent);
    dialogRef.afterClosed().subscribe(result => { console.log(`${result}`)});
  }

  createNewCollection(): void {
    this.router.navigateByUrl('newCollection');
  }
}
