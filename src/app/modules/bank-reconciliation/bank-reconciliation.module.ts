import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankReconciliationRoutingModule } from './bank-reconciliation-routing.module';
import { ListBankReconciliationComponent } from './components/list-bank-reconciliation/list-bank-reconciliation.component';
import { AddBankReconciliationComponent } from './components/add-bank-reconciliation/add-bank-reconciliation.component';
import { EditBankReconciliationComponent } from './components/edit-bank-reconciliation/edit-bank-reconciliation.component';

@NgModule({
  declarations: [ListBankReconciliationComponent, AddBankReconciliationComponent, EditBankReconciliationComponent],
  imports: [
    CommonModule,
    BankReconciliationRoutingModule
  ]
})
export class BankReconciliationModule { }
