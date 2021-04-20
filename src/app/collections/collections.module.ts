import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { CollectionsRoutingModule } from './collections-routing.module';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { SwitchCollectionComponent } from './switch-collection/switch-collection.component';
import { NewCollectionComponent } from './new-collection/new-collection.component';


@NgModule({
  declarations: [CollectionListComponent, SwitchCollectionComponent, NewCollectionComponent],
  imports: [
    CommonModule,
    CollectionsRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class CollectionsModule { }
