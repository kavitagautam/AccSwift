import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListPurchaseInvoiceComponent } from "./components/list-purchase-invoice/list-purchase-invoice.component";
import { AddPurchaseInvoiceComponent } from './components/add-purchase-invoice/add-purchase-invoice.component';
import { EditPurchaseInvoiceComponent } from './components/edit-purchase-invoice/edit-purchase-invoice.component';

const routes: Routes = [
  {
    path: "",
    component: ListPurchaseInvoiceComponent,
    data: { breadcrumb: "List Purchase Invoice" }
  },
  {
    path: "add",
    component: AddPurchaseInvoiceComponent,
    data: { breadcrumb: "Add Purchase Invoice" }
  },
  {
    path: "edit/:id",
    component: EditPurchaseInvoiceComponent,
    data: { breadcrumb: "Edit Purchase Invoice" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInvoiceRoutingModule {}
