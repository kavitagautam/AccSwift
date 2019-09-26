import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListLedgerComponent } from "./components/list-ledger/list-ledger.component";
import { AddLedgerComponent } from "./components/add-ledger/add-ledger.component";
import { EditLedgerComponent } from "./components/edit-ledger/edit-ledger.component";

const routes: Routes = [
  { path: "", component: ListLedgerComponent },
  { path: "add", component: AddLedgerComponent },
  { path: "edit", component: EditLedgerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LedgerRoutingModule {}
