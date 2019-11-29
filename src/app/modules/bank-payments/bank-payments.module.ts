import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankPaymentsRoutingModule } from './bank-payments-routing.module';
import { ListBankPaymentsComponent } from './components/list-bank-payments/list-bank-payments.component';
import { EditBankPaymentsComponent } from './components/edit-bank-payments/edit-bank-payments.component';
import { AddBankPaymentsComponent } from './components/add-bank-payments/add-bank-payments.component';

@NgModule({
  declarations: [ListBankPaymentsComponent, EditBankPaymentsComponent, AddBankPaymentsComponent],
  imports: [
    CommonModule,
    BankPaymentsRoutingModule
  ]
})
export class BankPaymentsModule { }
