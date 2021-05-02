import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListDeliveryNotesComponent } from './components/list-delivery-notes/list-delivery-notes.component';

const routes: Routes = [{
  path: "",
  component:ListDeliveryNotesComponent,
  data: {breadcrumb: "List Delivery Notes"}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryNotesRoutingModule { }
