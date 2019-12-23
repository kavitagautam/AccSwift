import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBudgetComponent } from './components/view-budget/view-budget.component';

const routes: Routes = [{path:"", component:ViewBudgetComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
