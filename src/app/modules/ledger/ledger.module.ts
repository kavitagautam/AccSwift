import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LedgerRoutingModule } from "./ledger-routing.module";
import { ListLedgerComponent } from "./components/list-ledger/list-ledger.component";
import { EditLedgerComponent } from "./components/edit-ledger/edit-ledger.component";
import { AddLedgerComponent } from "./components/add-ledger/add-ledger.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { SharedModule } from '@app/shared/shared.module';
import { AccountGroupComponent } from './components/account-group/account-group.component';
import { AccountLedgerComponent } from './components/account-ledger/account-ledger.component';

@NgModule({
  declarations: [ListLedgerComponent, EditLedgerComponent, AddLedgerComponent, AccountGroupComponent, AccountLedgerComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    TreeViewModule,
    LayoutModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    LedgerRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LedgerModule {}
