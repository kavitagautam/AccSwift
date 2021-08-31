import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { ToastrService } from "ngx-toastr";
import { PreferenceService } from "../../../preference/services/preference.service";
import { IconConst } from "@app/shared/constants/icon.constant";
import { LocalStorageService } from '@app/shared/services/local-storage/local-storage.service';
import { DateConverterComponent } from "@accSwift-modules/accswift-shared/components/date-converter/date-converter.component";
import { Settings } from "@accSwift-modules/settings/models/settings.model";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";
import { DatePipe } from "@angular/common";
var adbs = require("ad-bs-converter");

@Component({
  selector: "accSwift-add-cash-receipt",
  templateUrl: "../common-html/common-cash-receipt.html",
  styleUrls: ["./add-cash-receipt.component.scss"],
})
export class AddCashReceiptComponent implements OnInit {

  public settingsForm: FormGroup;
  settings: Settings;
  public selectedDate:string =''
  cashReceiptForm: FormGroup;

  submitted: boolean;
  rowSubmitted: boolean;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    public cashReceiptService: CashReceiptService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private preferenceService: PreferenceService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    public settingsService: SettingsService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.buildcashReceiptForm();
    this.buildSettingsForm();
    this.getSettings();
    // this.selectedDate= this.localStorageService.getLocalStorageItem(
    //   "SelectedDate");
    localStorage.removeItem("SelectedDate");
  }

  buildSettingsForm(): void {
    this.settingsForm = this._fb.group({
      DEFAULT_DATE: [this.settings ? this.settings.DEFAULT_DATE.Value : ""]
    });
  }

  getSettings(): void {
    this.settingsService.getSettingsData().subscribe((response) => {
      this.settings = response.Entity;
      console.log(this.settings);
      let pickedDate = this.settings.DEFAULT_DATE.Value;
      console.log(pickedDate);
      this.selectedDate = pickedDate;
      this.buildSettingsForm();
    });
  }

  buildcashReceiptForm(): void {
    this.cashReceiptForm = this._fb.group({
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_CASH_RCPT.Value
          : null,
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
      ],
      VoucherNo: ["", [Validators.required]],
      LedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
        [Validators.required],
      ],
      Date: [new Date()],
      Remarks: [""],
      CashReceiptDetails: this._fb.array([this.addCashReceiptEntryFormGroup()]),
    });
  }

  get getCashReceiptEntryList(): FormArray {
    return <FormArray>this.cashReceiptForm.get("CashReceiptDetails");
  }

  addCashReceiptEntryFormGroup(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      VoucherNumber: [""],
      Amount: [""],
      LedgerBalance: [""],
      VoucherType: [""],
      Remarks: [""],
    });
  }

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.cashReceiptForm.get("CashReceiptDetails").invalid) return;

    (<FormArray>this.cashReceiptForm.get("CashReceiptDetails")).push(
      this.addCashReceiptEntryFormGroup()
    );
    this.submitted = false;
  }

  //Ledger Code entirng Filed -- not used recently
  changeLedgerValue(dataItem, selectedRow): void {
    const cashReceiptFormArray = <FormArray>(
      this.cashReceiptForm.get("CashReceiptDetails")
    );

    const ledgerCode = cashReceiptFormArray.controls[selectedRow].get(
      "LedgerCode"
    ).value;
    if (
      cashReceiptFormArray.controls[selectedRow].get("LedgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          cashReceiptFormArray.controls[selectedRow]
            .get("LedgerBalance")
            .setValue(selectedItem[0].ActualBalance);
          cashReceiptFormArray.controls[selectedRow]
            .get("LedgerName")
            .setValue(selectedItem[0].LedgerName);
          cashReceiptFormArray.controls[selectedRow]
            .get("LedgerCode")
            .setValue(selectedItem[0].LedgerCode);
          cashReceiptFormArray.controls[selectedRow]
            .get("LedgerID")
            .setValue(selectedItem[0].LedgerID);
        }
        (<FormArray>this.cashReceiptForm.get("CashReceiptDetails")).push(
          this.addCashReceiptEntryFormGroup()
        );
      });
    }
  }

  public save(): void {
    if (this.cashReceiptForm.invalid) return;
    if (this.selectedDate == 'Nepali')
    {
      let dateFormat = this.datePipe.transform(this.cashReceiptForm.value.Date,"yyyy/MM/dd");
      console.log(this.cashReceiptForm.value.Date);
      let var1 = adbs.bs2ad(dateFormat);
      let resultDate = `${var1.year}-${var1.month}-${var1.day}`;
      this.cashReceiptForm.get("Date").patchValue(resultDate);
      console.log(this.cashReceiptForm.value.Date);
    }
    else if (this.selectedDate == 'English')
    {
      console.log(this.cashReceiptForm.value.Date);
      this.cashReceiptForm.get("Date").patchValue(this.cashReceiptForm.value.Date);
    }
    this.cashReceiptService
      .addCashReceipt(this.cashReceiptForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/cash-receipt"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Cash  Receipt added successfully");
        }
      );
  }

  dateConverterPopup(): void
  {
    this.modalRef = this.modalService.show(DateConverterComponent, {
      initialState: { VoucherForm: this.cashReceiptForm },
      backdrop: true,
      ignoreBackdropClick: true,
      class: "modal-sm",
    })
  }

  public cancel(): void {
    this.cashReceiptForm.reset();
    this.router.navigate(["/cash-receipt"]);
  }
}
