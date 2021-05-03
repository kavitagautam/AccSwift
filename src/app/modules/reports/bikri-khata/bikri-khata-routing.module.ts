import { ReportPreviewComponent } from '@accSwift-modules/accswift-shared/components/report-preview/report-preview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BikriKhataComponent } from './bikri-khata/bikri-khata.component';

const routes: Routes = [
  {
    path: "",
    component: BikriKhataComponent,
    data: { 
      breadcrumb: "Bikri Khata",
    }
  },
  {
    path: "report-preview",
    component: ReportPreviewComponent,
    data: { breadcrumb: "Report" },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BikriKhataRoutingModule { }
