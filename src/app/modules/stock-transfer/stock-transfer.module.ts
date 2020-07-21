import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { PopupModule } from "@progress/kendo-angular-popup";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "@app/shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StockTransferRoutingModule } from "./stock-transfer-routing.module";
import { ListStockTransferComponent } from "./components/list-stock-transfer/list-stock-transfer.component";
import { AddStockTransferComponent } from "./components/add-stock-transfer/add-stock-transfer.component";
import { EditStockTransferComponent } from "./components/edit-stock-transfer/edit-stock-transfer.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [
    ListStockTransferComponent,
    AddStockTransferComponent,
    EditStockTransferComponent,
  ],
  imports: [
    CommonModule,
    StockTransferRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccswiftSharedModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
  ],
})
export class StockTransferModule {}
