import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetSetupComponent } from './components/budget-setup/budget-setup.component';
import { BudgetAllocationComponent } from './components/budget-allocation/budget-allocation.component';
import { ViewBudgetComponent } from './components/view-budget/view-budget.component';

@NgModule({
  declarations: [BudgetSetupComponent, BudgetAllocationComponent, ViewBudgetComponent],
  imports: [
    CommonModule,
    BudgetRoutingModule
  ]
})
export class BudgetModule { }
