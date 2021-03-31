import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgeingComponent } from './components/ageing/ageing.component';
import { DueDateComponent } from './components/due-date/due-date.component';

const routes: Routes = [{ path:"", component: AgeingComponent, data:{ breadcrumb: "Debtors Ageing"}},
{ path:"", component: DueDateComponent,  data:{ breadcrumb: "Debtors Due Date"}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtorsRoutingModule { }
