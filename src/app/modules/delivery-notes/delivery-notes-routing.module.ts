import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDeliveryNotesComponent } from './components/add-delivery-notes/add-delivery-notes.component';
import { ListDeliveryNotesComponent } from './components/list-delivery-notes/list-delivery-notes.component';

const routes: Routes = [{
  path: "",
  component:ListDeliveryNotesComponent,
  data: {breadcrumb: "List Delivery Notes"}
},
{
  path:"add",
  component: AddDeliveryNotesComponent,
  data: { breadcrumb:"Add Delivery Notes"}
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryNotesRoutingModule { }
