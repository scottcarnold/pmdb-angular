import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { CollectionsRoutingModule } from './collections-routing.module';
import { CollectionListComponent } from './collection-list/collection-list.component';


@NgModule({
  declarations: [CollectionListComponent],
  imports: [
    CommonModule,
    CollectionsRoutingModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class CollectionsModule { }
