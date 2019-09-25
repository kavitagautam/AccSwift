import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { CommonModule } from "@angular/common";
import { LedgerRoutingModule } from "./ledger-routing.module";
import { ListLedgerComponent } from "./components/list-ledger/list-ledger.component";
import { EditLedgerComponent } from "./components/edit-ledger/edit-ledger.component";
import { AddLedgerComponent } from "./components/add-ledger/add-ledger.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { LayoutModule } from '@progress/kendo-angular-layout';


@NgModule({
  declarations: [ListLedgerComponent, EditLedgerComponent, AddLedgerComponent],
  imports: [
    CommonModule,
    LedgerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TreeViewModule,
    LayoutModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class LedgerModule {}
