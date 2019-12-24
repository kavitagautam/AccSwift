import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListSalesInvoiceComponent } from "./components/list-sales-invoice/list-sales-invoice.component";
import { AddSalesInvoiceComponent } from "./components/add-sales-invoice/add-sales-invoice.component";
import { EditSalesInvoiceComponent } from "./components/edit-sales-invoice/edit-sales-invoice.component";

const routes: Routes = [
  {
    path: "",
    component: ListSalesInvoiceComponent,
    data: { breadcrumb: "List Sales Invoice" }
  },
  {
    path: "add",
    component: AddSalesInvoiceComponent,
    data: { breadcrumb: "Add Sales Invoice" }
  },
  {
    path: "edit/:id",
    component: EditSalesInvoiceComponent,
    data: { breadcrumb: "Edit Sales Invoice" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesInvoiceRoutingModule {}
