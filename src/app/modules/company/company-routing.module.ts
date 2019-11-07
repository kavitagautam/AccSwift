import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListCompanyComponent } from "./components/list-company/list-company.component";
import { AddCompanyComponent } from "./components/add-company/add-company.component";
import { EditCompanyComponent } from "./components/edit-company/edit-company.component";

const routes: Routes = [
  {
    path: "",
    component: ListCompanyComponent,
    data: {
      breadcrumb: "List Company"
    }
  },
  {
    path: "add",
    component: AddCompanyComponent,
    data: {
      breadcrumb: "Add Company"
    }
  },
  {
    path: "edit/:id",
    component: EditCompanyComponent,
    data: {
      breadcrumb: "Edit Company"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}
