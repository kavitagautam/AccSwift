import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { SharedModule } from "../../shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CashPaymentsRoutingModule } from "./cash-payment-routing.module";
import { EditCashPaymentComponent } from "./components/edit-cash-payment/edit-cash-payment.component";

import { ListCashPaymentComponent } from "./components/list-cash-payment/list-cash-payment.component";
import { AddCashPaymentComponent } from "./components/add-cash-payment/add-cash-payment.component";

@NgModule({
  declarations: [
    EditCashPaymentComponent,
    AddCashPaymentComponent,
    ListCashPaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CashPaymentsRoutingModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashPaymentModule {}
