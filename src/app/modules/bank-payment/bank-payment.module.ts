import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankPaymentRoutingModule } from './bank-payment-routing.module';
import { ListBankPaymentComponent } from './components/list-bank-payment/list-bank-payment.component';
import { EditBankPaymentComponent } from './components/edit-bank-payment/edit-bank-payment.component';
import { AddBankPaymentComponent } from './components/add-bank-payment/add-bank-payment.component';

@NgModule({
  declarations: [ListBankPaymentComponent, EditBankPaymentComponent, AddBankPaymentComponent],
  imports: [
    CommonModule,
    BankPaymentRoutingModule
  ]
})
export class BankPaymentModule { }
