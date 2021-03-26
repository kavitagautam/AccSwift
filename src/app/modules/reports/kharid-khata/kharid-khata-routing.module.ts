import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KharidKhataComponent } from './kharid-khata/kharid-khata.component';

const routes: Routes = [
  {
    path: "",
    component: KharidKhataComponent,
    data: { 
      breadcrumb: "Kharid Khata",
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KharidKhataRoutingModule { }
