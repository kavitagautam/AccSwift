import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminPanelComponent } from "./core/layout/admin-panel/admin-panel.component";
import { AuthGuard } from "./core/services/auth.guard/auth.guard";

const routes: Routes = [
  {
    path: "login",
    loadChildren: "@modules/auth/login/login.module#LoginModule",
  },
  {
    path: "register",
    loadChildren: "@modules/auth/register/register.module#RegisterModule",
  },
  {
    path: "",
    canActivate: [AuthGuard],
    component: AdminPanelComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        loadChildren: "@modules/dashboard/dashboard.module#DashboardModule",
      },

      {
        path: "stock-transfer",
        loadChildren:
          "@modules/stock-transfer/stock-transfer.module#StockTransferModule",
        data: {
          breadcrumb: "Stock Transfer",
        },
      },
      {
        path: "journal",
        loadChildren:
          "@modules/journal-voucher/journal-voucher.module#JournalVoucherModule",
        data: {
          breadcrumb: "Journal",
        },
      },
      {
        path: "cash-receipt",
        loadChildren:
          "@modules/cash-receipt/cash-receipt.module#CashReceiptModule",
        data: {
          breadcrumb: "Cash Receipt",
        },
      },

      {
        path: "reports",
        loadChildren: "@modules/reports/reports.module#ReportsModule",
        data: {
          breadcrumb: "Reports",
        },
      },

      {
        path: "cash-payment",
        loadChildren:
          "@modules/cash-payment/cash-payment.module#CashPaymentModule",
        data: {
          breadcrumb: "Cash Payment",
        },
      },
      {
        path: "bank-receipt",
        loadChildren:
          "@modules/bank-receipt/bank-receipt.module#BankReceiptModule",
        data: {
          breadcrumb: "Bank Receipt",
        },
      },
      {
        path: "bank-payment",
        loadChildren:
          "@modules/bank-payment/bank-payment.module#BankPaymentModule",
        data: {
          breadcrumb: "Bank Payment",
        },
      },
      {
        path: "contra-voucher",
        loadChildren:
          "@modules/contra-voucher/contra-voucher.module#ContraVoucherModule",
        data: {
          breadcrumb: "Contra Voucher",
        },
      },
      {
        path: "depot",
        loadChildren: "@modules/depot/depot.module#DepotModule",
        data: {
          breadcrumb: "Depot",
        },
      },
      {
        path: "bank-reconciliation",
        loadChildren:
          "@modules/bank-reconciliation/bank-reconciliation.module#BankReconciliationModule",
        data: {
          breadcrumb: "Bank Reconciliation",
        },
      },
      {
        path: "product",
        loadChildren: "@modules/product/product.module#ProductModule",
        data: {
          breadcrumb: "Product",
        },
      },
      {
        path: "budget",
        loadChildren: "@modules/budget/budget.module#BudgetModule",
        data: {
          breadcrumb: "Budget",
        },
      },
      {
        path: "company",
        loadChildren: "@modules/company/company.module#CompanyModule",
        data: {
          breadcrumb: "Company",
        },
      },
      {
        path: "ledger",
        loadChildren: "@modules/ledger/ledger.module#LedgerModule",
        data: {
          breadcrumb: "Chart Of Account",
        },
      },
      {
        path: "compound-unit",
        loadChildren:
          "@modules/compound-unit/compound-unit.module#CompoundUnitModule",
        data: { breadcrumb: "Compound Unit" },
      },
      {
        path: "unit-maintenance",
        loadChildren:
          "@modules/unit-maintenance/unit-maintenance.module#UnitMaintenanceModule",
        data: {
          breadcrumb: "Unit Maintenance",
        },
      },
      {
        path: "report",
        loadChildren: "@modules/reports/reports.module#ReportsModule",
        data: {
          breadcrumb: "Report",
        },
      },
      {
        path: "day-book",
        loadChildren: "@modules/reports/day-book/day-book.module#DayBookModule",
        data: {
          breadcrumb: "Day Book",
        },
      },
      {
        path: "stock-status",
        loadChildren:
          "@modules/reports/stock-status/stock-status.module#StockStatusModule",
        data: {
          breadcrumb: "Stock Status",
        },
      },
      {
        path: "purchase-invoice",
        loadChildren:
          "@modules/purchase-invoice/purchase-invoice.module#PurchaseInvoiceModule",
        data: {
          breadcrumb: "Purchase Invoice",
        },
      },
      {
        path: "purchase-order",
        loadChildren:
          "@modules/purchase-order/purchase-order.module#PurchaseOrderModule",
        data: {
          breadcrumb: "Purchase Order",
        },
      },
      {
        path: "purchase-return",
        loadChildren:
          "@modules/purchase-return/purchase-return.module#PurchaseReturnModule",
        data: {
          breadcrumb: "Purchase Return",
        },
      },
      {
        path: "sales-invoice",
        loadChildren:
          "@modules/sales-invoice/sales-invoice.module#SalesInvoiceModule",
        data: {
          breadcrumb: "Sales Invoice",
        },
      },
      {
        path: "sales-order",
        loadChildren:
          "@modules/sales-order/sales-order.module#SalesOrderModule",
        data: {
          breadcrumb: "Sales Order",
        },
      },
      {
        path: "sales-return",
        loadChildren:
          "@modules/sales-return/sales-return.module#SalesReturnModule",
        data: {
          breadcrumb: "Sales Return",
        },
      },
      {
        path: "settings",
        loadChildren: "@modules/settings/settings.module#SettingsModule",
        data: {
          breadcrumb: "Settings",
        },
      },
      {
        path: "preference",
        loadChildren: "@modules/preference/preference.module#PreferenceModule",
        data: {
          breadcrumb: "Preference",
        },
      },
      {
        path: "voucher-configuration",
        loadChildren:
          "@modules/configuration/configuration.module#ConfigurationModule",
        data: {
          breadcrumb: "Configuration",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
