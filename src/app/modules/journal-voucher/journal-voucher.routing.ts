import { NgModule } from "@angular/core";
import { RouterModule, Routes, ExtraOptions } from "@angular/router";
import { AddJournalComponent } from "./component/add-journal/add-journal.component";
import { EditJournalComponent } from "./component/edit-journal/edit-journal.component";
import { ListJournalComponent } from "./component/list-journal/list-journal.component";
import { CustomerInvoicesComponent } from "@accSwift-modules/accswift-shared/components/customer-invoices/customer-invoices.component";

const routes: Routes = [
  {
    path: "add",
    component: AddJournalComponent,
    data: {
      breadcrumb: "Add Journal",
    },
  },
  {
    path: "edit/:id",
    component: EditJournalComponent,
    data: {
      breadcrumb: "Edit Journal",
    },
  },
  {
    path: "edit/:id/invoice-billing",
    component: CustomerInvoicesComponent,
    data: { breadcrumb: "Invoice" },
  },
  {
    path: "",
    component: ListJournalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JournalVoucherRoutingModule {}
