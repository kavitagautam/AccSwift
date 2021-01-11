import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { LayoutModule } from '@progress/kendo-angular-layout';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BudgetRoutingModule } from "./budget-routing.module";
import { BudgetSetupComponent } from "./components/budget-setup/budget-setup.component";
import { BudgetAllocationComponent } from "./components/budget-allocation/budget-allocation.component";
import { ViewBudgetComponent } from "./components/view-budget/view-budget.component";

@NgModule({
  declarations: [
    BudgetSetupComponent,
    BudgetAllocationComponent,
    ViewBudgetComponent
  ],
  imports: [CommonModule, BudgetRoutingModule, TreeViewModule, DropDownsModule, LayoutModule, LabelModule, InputsModule, GridModule,
  PopupModule, DropDownListModule],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BudgetModule {}
