import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminPanelComponent } from "./core/layout/admin-panel/admin-panel.component";
import { AuthGuard } from "./core/services/auth.guard/auth.guard";

const routes: Routes = [
  {
    path: "login",
    loadChildren: "@accSwift-modules/auth/login/login.module#LoginModule",
  },
  {
    path: "register",
    loadChildren:
      "@accSwift-modules/auth/register/register.module#RegisterModule",
  },

  {
    path: "pos",
    loadChildren: "@accSwift-modules/pos/pos.module#PosModule",
    data: {
      breadcrumb: "POS",
    },
  },
  {
    path: "",
    canActivate: [AuthGuard],
    component: AdminPanelComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        loadChildren:
          "@accSwift-modules/dashboard/dashboard.module#DashboardModule",
      },

      {
        path: "stock-transfer",
        loadChildren:
          "@accSwift-modules/stock-transfer/stock-transfer.module#StockTransferModule",
        data: {
          breadcrumb: "Stock Transfer",
        },
      },
      {
        path: "journal",
        loadChildren:
          "@accSwift-modules/journal-voucher/journal-voucher.module#JournalVoucherModule",
        data: {
          breadcrumb: "Journal",
        },
      },
      {
        path: "cash-receipt",
        loadChildren:
          "@accSwift-modules/cash-receipt/cash-receipt.module#CashReceiptModule",
        data: {
          breadcrumb: "Cash Receipt",
        },
      },

      {
        path: "cash-payment",
        loadChildren:
          "@accSwift-modules/cash-payment/cash-payment.module#CashPaymentModule",
        data: {
          breadcrumb: "Cash Payment",
        },
      },
      {
        path: "bank-receipt",
        loadChildren:
          "@accSwift-modules/bank-receipt/bank-receipt.module#BankReceiptModule",
        data: {
          breadcrumb: "Bank Receipt",
        },
      },
      {
        path: "bank-payment",
        loadChildren:
          "@accSwift-modules/bank-payment/bank-payment.module#BankPaymentModule",
        data: {
          breadcrumb: "Bank Payment",
        },
      },
      {
        path: "contra-voucher",
        loadChildren:
          "@accSwift-modules/contra-voucher/contra-voucher.module#ContraVoucherModule",
        data: {
          breadcrumb: "Contra Voucher",
        },
      },
      {
        path: "depot",
        loadChildren: "@accSwift-modules/depot/depot.module#DepotModule",
        data: {
          breadcrumb: "Depot",
        },
      },
      {
        path: "bank-reconciliation",
        loadChildren:
          "@accSwift-modules/bank-reconciliation/bank-reconciliation.module#BankReconciliationModule",
        data: {
          breadcrumb: "Bank Reconciliation",
        },
      },
      {
        path: "product",
        loadChildren: "@accSwift-modules/product/product.module#ProductModule",
        data: {
          breadcrumb: "Product",
        },
      },
      {
        path: "project",
        loadChildren: "@accSwift-modules/project/project.module#ProjectModule",
        data: {
          breadcrumb: "Project",
        },
      },
      {
        path: "budget",
        loadChildren: "@accSwift-modules/budget/budget.module#BudgetModule",
        data: {
          breadcrumb: "Budget",
        },
      },
      {
        path: "company",
        loadChildren: "@accSwift-modules/company/company.module#CompanyModule",
        data: {
          breadcrumb: "Company",
        },
      },
      {
        path: "ledger",
        loadChildren: "@accSwift-modules/ledger/ledger.module#LedgerModule",
        data: {
          breadcrumb: "Chart Of Account",
        },
      },
      {
        path: "compound-unit",
        loadChildren:
          "@accSwift-modules/compound-unit/compound-unit.module#CompoundUnitModule",
        data: { breadcrumb: "Compound Unit" },
      },
      {
        path: "access-role",
        loadChildren:
          "@accSwift-modules/access-role/access-role.module#AccessRoleModule",
        data: { breadcrumb: "Access Role" },
      },
      {
        path: "unit-maintenance",
        loadChildren:
          "@accSwift-modules/unit-maintenance/unit-maintenance.module#UnitMaintenanceModule",
        data: {
          breadcrumb: "Unit Maintenance",
        },
      },
      {
        path: "user",
        loadChildren: "@accSwift-modules/user/user.module#UserModule",
        data: {
          breadcrumb: "User",
        },
      },
      {
        path: "trail-balance",
        loadChildren: "@accSwift-modules/reports/reports.module#ReportsModule",
        data: {
          breadcrumb: "Trail Balance Report",
        },
      },
      {
        path: "cash-flow-report",
        loadChildren:
          "@accSwift-modules/reports/cash-flow-report/cash-flow-report.module#CashFlowReportModule",
        data: {
          breadcrumb: "Cash Flow Report",
        },
      },
      {
        path: "day-book",
        loadChildren:
          "@accSwift-modules/reports/day-book/day-book.module#DayBookModule",
        data: {
          breadcrumb: "Day Book",
        },
      },
      {
        path: "stock-status",
        loadChildren:
          "@accSwift-modules/reports/stock-status/stock-status.module#StockStatusModule",
        data: {
          breadcrumb: "Stock Status",
        },
      },
      {
        path: "sales-report",
        loadChildren:
          "@accSwift-modules/reports/sales-report/sales-report.module#SalesReportModule",
        data: {
          breadcrumb: "Sales Report",
        },
      },
      {
        path: "purchase-report",
        loadChildren:
          "@accSwift-modules/reports/purchase-report/purchase-report.module#PurchaseReportModule",
        data: {
          breadcrumb: "Purchase Report",
        },
      },

      {
        path: "ledger-report",
        loadChildren:
          "@accSwift-modules/reports/ledger-report/ledger-report.module#LedgerReportModule",
        data: {
          breadcrumb: "Ledger Report",
        },
      },
      {
        path: "profit-loss",
        loadChildren:
          "@accSwift-modules/reports/profit-loss/profit-loss.module#ProfitLossModule",
        data: {
          breadcrumb: "Profit Loss Report",
        },
      },
      {
        path: "balance-sheet",
        loadChildren:
          "@accSwift-modules/reports/balance-sheet/balance-sheet.module#BalanceSheetModule",
        data: {
          breadcrumb: "Balance Sheet Report",
        },
      },
      {
        path: "purchase-invoice",
        loadChildren:
          "@accSwift-modules/purchase-invoice/purchase-invoice.module#PurchaseInvoiceModule",
        data: {
          breadcrumb: "Purchase Invoice",
        },
      },
      {
        path: "purchase-order",
        loadChildren:
          "@accSwift-modules/purchase-order/purchase-order.module#PurchaseOrderModule",
        data: {
          breadcrumb: "Purchase Order",
        },
      },
      {
        path: "purchase-return",
        loadChildren:
          "@accSwift-modules/purchase-return/purchase-return.module#PurchaseReturnModule",
        data: {
          breadcrumb: "Purchase Return",
        },
      },
      {
        path: "sales-invoice",
        loadChildren:
          "@accSwift-modules/sales-invoice/sales-invoice.module#SalesInvoiceModule",
        data: {
          breadcrumb: "Sales Invoice",
        },
      },
      {
        path: "sales-order",
        loadChildren:
          "@accSwift-modules/sales-order/sales-order.module#SalesOrderModule",
        data: {
          breadcrumb: "Sales Order",
        },
      },
      {
        path: "sales-return",
        loadChildren:
          "@accSwift-modules/sales-return/sales-return.module#SalesReturnModule",
        data: {
          breadcrumb: "Sales Return",
        },
      },
      {
        path: "settings",
        loadChildren:
          "@accSwift-modules/settings/settings.module#SettingsModule",
        data: {
          breadcrumb: "Settings",
        },
      },
      {
        path: "preference",
        loadChildren:
          "@accSwift-modules/preference/preference.module#PreferenceModule",
        data: {
          breadcrumb: "Preference",
        },
      },
      {
        path: "voucher-configuration",
        loadChildren:
          "@accSwift-modules/configuration/configuration.module#ConfigurationModule",
        data: {
          breadcrumb: "Configuration",
        },
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
