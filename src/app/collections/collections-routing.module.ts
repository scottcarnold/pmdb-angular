import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { NewCollectionComponent } from './new-collection/new-collection.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'collections', component: CollectionListComponent, canActivate: [AuthGuard] },
  { path: 'newCollection', component: NewCollectionComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionsRoutingModule { }
