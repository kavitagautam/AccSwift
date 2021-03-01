import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { LabelModule } from "@progress/kendo-angular-label";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { BudgetRoutingModule } from "./budget-routing.module";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";
import { BudgetSetupComponent } from "./components/budget-setup/budget-setup.component";
import { BudgetAllocationComponent } from "./components/budget-allocation/budget-allocation.component";
import { ViewBudgetComponent } from "./components/view-budget/view-budget.component";
import { BudgetAllocationMastersComponent } from "./components/budget-allocation-masters/budget-allocation-masters.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [
    BudgetSetupComponent,
    BudgetAllocationComponent,
    ViewBudgetComponent,
    BudgetAllocationMastersComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BudgetRoutingModule,
    TreeViewModule,
    DropDownsModule,
    LayoutModule,
    LabelModule,
    InputsModule,
    GridModule,
    PopupModule,
    DropDownListModule,
    AccswiftSharedModule,
  ],

  entryComponents: [BudgetSetupComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BudgetModule {}
