import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { SharedModule } from "./../../shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CashPaymentsRoutingModule } from "./cash-payments-routing.module";
import { EditCashPaymentsComponent } from "./components/edit-cash-payments/edit-cash-payments.component";
import { AddCashPaymentsComponent } from "./components/add-cash-payments/add-cash-payments.component";
import { ListCashPaymentsComponent } from "./components/list-cash-payments/list-cash-payments.component";

@NgModule({
  declarations: [
    EditCashPaymentsComponent,
    AddCashPaymentsComponent,
    ListCashPaymentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    SharedModule,
    CashPaymentsRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashPaymentsModule {}
