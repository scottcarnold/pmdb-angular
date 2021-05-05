import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/shared.module';

import { CollectionsRoutingModule } from './collections-routing.module';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { SwitchCollectionComponent } from './switch-collection/switch-collection.component';
import { NewCollectionComponent } from './new-collection/new-collection.component';
import { PublicUrlPipe } from './public-url.pipe';


@NgModule({
  declarations: [CollectionListComponent, SwitchCollectionComponent, NewCollectionComponent, PublicUrlPipe],
  imports: [
    CommonModule,
    CollectionsRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    SharedModule
  ]
})
export class CollectionsModule { }
