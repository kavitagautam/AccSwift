import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminPanelComponent } from './core/layout/admin-panel/admin-panel.component';

const routes: Routes = [
  {
    path: "login",
    loadChildren: "@modules/auth/login/login.module#LoginModule"
  },
  {
    path:"signup",
    loadChildren:"@modules/auth/register/register.module#RegisterModule"
  },
  // {
  //   path:"company", 
  //   component: AdminPanelComponent, 
  //   children:[
  //     {
  //       path: "",
  //       loadChildren: "modules/company/company.module#CompanyModule"
  //     }
  //   ]
  // },
  {
      path:"",
      component: AdminPanelComponent,
      children: [
        {
          path: "journal",
          loadChildren: "@modules/journal-voucher/journal-voucher.module#JournalVoucherModule"
        },
        {
          path: "company",
          loadChildren: "@modules/company/company.module#CompanyModule"
        }
       
      ] 
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
