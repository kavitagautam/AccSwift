import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PreferenceService } from "../../services/preference.service";
import { Preferences } from "../../models/preference.model";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Series } from "@app/modules/accswift-shared/models/series.model";

@Component({
  selector: "accSwift-series-preference",
  templateUrl: "./series-preference.component.html",
  styleUrls: ["./series-preference.component.scss"],
})
export class SeriesPreferenceComponent implements OnInit {
  seriesForms: FormGroup;
  preferenceData: Preferences;
  // Series List For DropDown
  bankPaymentSeries: Series[] = [];
  bankReceiptSeries: Series[] = [];
  bankReconciliationSeries: Series[] = [];
  cashPaymentSeries: Series[] = [];
  cashReceiptSeries: Series[] = [];
  chequeReceiptSeries: Series[] = [];
  contraSeries: Series[] = [];
  creditNoteSeries: Series[] = [];
  damageSeries: Series[] = [];
  debitNoteSeries: Series[] = [];
  journalSeries: Series[] = [];
  purchaseSeries: Series[] = [];
  purchaseReturnSeries: Series[] = [];
  salesSeries: Series[] = [];
  salesReturnSeries: Series[] = [];
  stockTransferSeries: Series[] = [];
  salesOrderSeries: Series[] = [];
  purchaseOrderSeries: Series[] = [];

  constructor(
    private _fb: FormBuilder,
    private preferenceService: PreferenceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildSeriesForms();
    this.getPreferences();
    this.getAllSeriesList();
  }

  getPreferences(): void {
    this.preferenceService.getPreferenceData().subscribe((response) => {
      this.preferenceData = response.Entity;
      this.buildSeriesForms();
    });
  }

  buildSeriesForms(): void {
    this.seriesForms = this._fb.group({
      DEFAULT_SERIES_BANK_PMNT: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_BANK_PMNT.Value
          : null,
      ],
      DEFAULT_SERIES_BANK_RCPT: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_BANK_RCPT.Value
          : null,
      ],
      DEFAULT_SERIES_BRECON: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_BRECON.Value
          : null,
      ],
      DEFAULT_SERIES_CASH_PMNT: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_CASH_PMNT.Value
          : null,
      ],
      DEFAULT_SERIES_CASH_RCPT: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_CASH_RCPT.Value
          : null,
      ],
      DEFAULT_SERIES_CHEQUERCPT: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_CHEQUERCPT.Value
          : null,
      ],
      DEFAULT_SERIES_CNTR: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_CNTR.Value
          : null,
      ],
      DEFAULT_SERIES_CR_NOT: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_CR_NOT.Value
          : null,
      ],
      DEFAULT_SERIES_DAMAGE: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_DAMAGE.Value
          : null,
      ],
      DEFAULT_SERIES_DR_NOT: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_DR_NOT.Value
          : null,
      ],
      DEFAULT_SERIES_JRNL: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_JRNL.Value
          : null,
      ],
      DEFAULT_SERIES_PURCH: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_PURCH.Value
          : null,
      ],
      DEFAULT_SERIES_PURCH_RTN: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_PURCH_RTN.Value
          : null,
      ],
      DEFAULT_SERIES_SALES: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_SALES.Value
          : null,
      ],
      DEFAULT_SERIES_SLS_RTN: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_SLS_RTN.Value
          : null,
      ],
      DEFAULT_SERIES_STOCK_TRANS: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_STOCK_TRANS.Value
          : null,
      ],
      DEFAULT_SERIES_SLS_ORDER: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_SLS_ORDER.Value
          : null,
      ],
      DEFAULT_SERIES_PURCH_ORDER: [
        this.preferenceData
          ? this.preferenceData.DEFAULT_SERIES_PURCH_ORDER.Value
          : null,
      ],
    });
  }

  getAllSeriesList(): void {
    this.preferenceService.getSeriesList("BANK_PMNT").subscribe((response) => {
      this.bankPaymentSeries = response.Entity;
    });

    this.preferenceService.getSeriesList("BANK_RCPT").subscribe((response) => {
      this.bankReceiptSeries = response.Entity;
    });

    this.preferenceService.getSeriesList("BRECON").subscribe((response) => {
      this.bankReconciliationSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("CASH_PMNT").subscribe((response) => {
      this.cashPaymentSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("CASH_RCPT").subscribe((response) => {
      this.cashReceiptSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("CHEQUERCPT").subscribe((response) => {
      this.chequeReceiptSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("CNTR").subscribe((response) => {
      this.contraSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("CR_NOT").subscribe((response) => {
      this.creditNoteSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("DAMAGE").subscribe((response) => {
      this.damageSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("DR_NOT").subscribe((response) => {
      this.debitNoteSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("JRNL").subscribe((response) => {
      this.journalSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("PURCH").subscribe((response) => {
      this.purchaseSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("PURCH_RTN").subscribe((response) => {
      this.purchaseReturnSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("SALES").subscribe((response) => {
      this.salesSeries = response.Entity;
    });
    this.preferenceService.getSeriesList("SLS_RTN").subscribe((response) => {
      this.salesReturnSeries = response.Entity;
    });
    this.preferenceService
      .getSeriesList("STOCK_TRANS")
      .subscribe((response) => {
        this.stockTransferSeries = response.Entity;
      });
    this.preferenceService.getSeriesList("SLS_ORDER").subscribe((response) => {
      this.salesOrderSeries = response.Entity;
    });
    this.preferenceService
      .getSeriesList("PURCH_ORDER")
      .subscribe((response) => {
        this.purchaseOrderSeries = response.Entity;
      });
  }

  save(): void {
    this.preferenceService.updatePreference(this.seriesForms.value).subscribe(
      (response) => {
        this.router.navigate(["/preference"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Series prefrence edited successfully");
        this.getPreferences();
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/preference"]);
  }
}
