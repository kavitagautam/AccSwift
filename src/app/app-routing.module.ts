import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminPanelComponent } from "./core/layout/admin-panel/admin-panel.component";

const routes: Routes = [
  {
    path: "login",
    loadChildren: "@modules/auth/login/login.module#LoginModule"
  },
  {
    path: "signup",
    loadChildren: "@modules/auth/register/register.module#RegisterModule"
  },
  {
    path: "",
    component: AdminPanelComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        loadChildren: "@modules/dashboard/dashboard.module#DashboardModule"
      },
      {
        path: "journal",
        loadChildren:
          "@modules/journal-voucher/journal-voucher.module#JournalVoucherModule",
        data: {
          breadcrumb: "Journal"
        }
      },
      {
        path: "cash",
        loadChildren:
          "@modules/cash-receipts/cash-receipts.module#CashReceiptsModule",
        data: {
          breadcrumb: "Cash"
        }
      },
      {
        path: "bank",
        loadChildren:
          "@modules/bank-receipts/bank-receipts.module#BankReceiptsModule",
        data: {
          breadcrumb: "Bank"
        }
      },
      {
        path: "product",
        loadChildren: "@modules/product/product.module#ProductModule",
        data: {
          breadcrumb: "Product"
        }
      },
      {
        path: "company",
        loadChildren: "@modules/company/company.module#CompanyModule",
        data: {
          breadcrumb: "Company"
        }
      },
      {
        path: "ledger",
        loadChildren: "@modules/ledger/ledger.module#LedgerModule",
        data: {
          breadcrumb: "Ledger"
        }
      },
      {
        path: "report",
        loadChildren: "@modules/reports/reports.module#ReportsModule",
        data: {
          breadcrumb: "Report"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
