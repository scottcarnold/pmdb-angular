import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { NewCollectionComponent } from './new-collection/new-collection.component';

const routes: Routes = [
  { path: 'collections', component: CollectionListComponent },
  { path: 'newCollection', component: NewCollectionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsRoutingModule { }
