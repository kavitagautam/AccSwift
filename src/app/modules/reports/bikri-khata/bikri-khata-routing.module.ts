import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BikriKhataComponent } from './bikri-khata/bikri-khata.component';

const routes: Routes = [
  {
    path: "",
    component: BikriKhataComponent,
    data: { 
      breadcrumb: "Bikri Khata",
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BikriKhataRoutingModule { }
