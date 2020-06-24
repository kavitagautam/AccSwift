import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { IntlModule } from "@progress/kendo-angular-intl";
import { NumericTextBoxModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from "@progress/kendo-angular-buttons";

import { ReportsRoutingModule } from "./reports-routing.module";
import { ReportPdfComponent } from "./components/report-pdf/report-pdf.component";
import { TrialBalanceComponent } from "./components/trial-balance/trial-balance.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [ReportPdfComponent, TrialBalanceComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ButtonsModule,
    IntlModule,
    FormsModule,
    ReactiveFormsModule,
    NumericTextBoxModule,
    PDFExportModule,
    SharedModule,
  ],
})
export class ReportsModule {}
