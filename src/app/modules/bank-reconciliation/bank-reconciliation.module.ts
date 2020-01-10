import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from '@progress/kendo-angular-grid';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankReconciliationRoutingModule } from './bank-reconciliation-routing.module';
import { ListBankReconciliationComponent } from './components/list-bank-reconciliation/list-bank-reconciliation.component';
import { AddBankReconciliationComponent } from './components/add-bank-reconciliation/add-bank-reconciliation.component';
import { EditBankReconciliationComponent } from './components/edit-bank-reconciliation/edit-bank-reconciliation.component';
import { PopupModule } from '@progress/kendo-angular-popup';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  declarations: [ListBankReconciliationComponent, AddBankReconciliationComponent, EditBankReconciliationComponent],
  imports: [
    CommonModule,
    BankReconciliationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    SharedModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
  ]
})
export class BankReconciliationModule { }
