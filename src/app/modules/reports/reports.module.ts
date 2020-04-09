import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { PDFExportModule } from "@progress/kendo-angular-pdf-export";
import { IntlModule } from "@progress/kendo-angular-intl";
import { NumericTextBoxModule } from "@progress/kendo-angular-inputs";
import { ButtonsModule } from "@progress/kendo-angular-buttons";

import { ReportsRoutingModule } from "./reports-routing.module";
import { ReportPdfComponent } from "./components/report-pdf/report-pdf.component";
import { TrialBalanceComponent } from './components/trial-balance/trial-balance.component';

@NgModule({
  declarations: [ReportPdfComponent, TrialBalanceComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ButtonsModule,
    IntlModule,
    FormsModule,
    NumericTextBoxModule,
    PDFExportModule
  ]
})
export class ReportsModule {}
