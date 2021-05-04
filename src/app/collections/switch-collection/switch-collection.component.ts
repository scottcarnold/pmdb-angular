import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CollectionInfo } from '../collection-info';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-switch-collection',
  templateUrl: './switch-collection.component.html',
  styleUrls: ['./switch-collection.component.css']
})
export class SwitchCollectionComponent implements OnInit {

  currentCollection: CollectionInfo;
  viewableCollections: CollectionInfo[];
  selectedCollectionId: string;

  constructor(private dialogRef: MatDialogRef<SwitchCollectionComponent>,
    private collectionService: CollectionService) { }

  ngOnInit(): void {
    this.collectionService.getDefaultMovieCollection().subscribe(
      collectionInfo => {
        this.currentCollection = collectionInfo;
        this.selectedCollectionId = collectionInfo.collection.id;
      }
    );
    this.collectionService.getViewableMovieCollections().subscribe(
      collectionInfos => { this.viewableCollections = collectionInfos; }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }

  switchCollection() {
    this.dialogRef.close(this.selectedCollectionId);
  }
}
