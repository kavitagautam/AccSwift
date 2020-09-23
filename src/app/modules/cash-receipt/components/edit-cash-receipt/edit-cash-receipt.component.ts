import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CashReceiptService } from "../../services/cash-receipt.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { CashReceipt } from "../../models/cash-receipt.model";
import { ToastrService } from "ngx-toastr";
import { IconConst } from "@app/shared/constants/icon.constant";

@Component({
  selector: "accSwift-edit-cash-receipt",
  templateUrl: "../common-html/common-cash-receipt.html",
  styleUrls: ["./edit-cash-receipt.component.scss"],
})
export class EditCashReceiptComponent implements OnInit {
  cashReceiptDetails: CashReceipt;
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
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getIdFromRoute(); // Get Id From the Route URL and get the Details
    this.buildCashReceiptForm(); // Initialize the form
  }

  buildCashReceiptForm(): void {
    this.cashReceiptForm = this._fb.group({
      ID: [this.cashReceiptDetails ? this.cashReceiptDetails.ID : 0],
      SeriesID: [
        this.cashReceiptDetails ? this.cashReceiptDetails.SeriesID : null,
      ],
      ProjectID: [
        this.cashReceiptDetails ? this.cashReceiptDetails.ProjectID : null,
      ],
      VoucherNo: [
        this.cashReceiptDetails ? this.cashReceiptDetails.VoucherNo : "",
        [Validators.required],
      ],
      LedgerID: [
        this.cashReceiptDetails ? this.cashReceiptDetails.LedgerID : null,
        [Validators.required],
      ],
      Date: [
        this.cashReceiptDetails ? new Date(this.cashReceiptDetails.Date) : "",
      ],
      Remarks: [this.cashReceiptDetails ? this.cashReceiptDetails.Remarks : ""],
      CashReceiptDetails: this._fb.array([this.addCashReceiptEntryFormGroup()]),
    });
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

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.cashReceiptService
          .getCashReceiptDetails(params.get("id"))
          .subscribe((response) => {
            this.cashReceiptDetails = response.Entity;
            if (this.cashReceiptDetails) {
              this.assignFormsValue();
              this.setCashReceiptList();
            }
          });
      }
    });
  }

  assignFormsValue(): void {
    this.cashReceiptForm.get("ID").setValue(this.cashReceiptDetails.ID);
    this.cashReceiptForm
      .get("SeriesID")
      .setValue(this.cashReceiptDetails.SeriesID);
    this.cashReceiptForm
      .get("VoucherNo")
      .setValue(this.cashReceiptDetails.VoucherNo);

    this.cashReceiptForm
      .get("ProjectID")
      .setValue(this.cashReceiptDetails.ProjectID);
    this.cashReceiptForm
      .get("Date")
      .setValue(new Date(this.cashReceiptDetails.CreatedDate));
    this.cashReceiptForm
      .get("LedgerID")
      .setValue(this.cashReceiptDetails.LedgerID);
    this.cashReceiptForm
      .get("Remarks")
      .setValue(this.cashReceiptDetails.Remarks);
  }

  get getCashReceiptEntryList(): FormArray {
    return <FormArray>this.cashReceiptForm.get("CashReceiptDetails");
  }

  setCashReceiptList(): void {
    this.cashReceiptForm.setControl(
      "CashReceiptDetails",
      this.setCashReceiptFormArray(this.cashReceiptDetails.CashReceiptDetails)
    );
    (<FormArray>this.cashReceiptForm.get("CashReceiptDetails")).push(
      this.addCashReceiptEntryFormGroup()
    );
  }

  setCashReceiptFormArray(cashRecepitDetails): FormArray {
    const cashReceiptFormArray = new FormArray([]);
    if (cashRecepitDetails && cashRecepitDetails.length > 0) {
      cashRecepitDetails.forEach((element) => {
        cashReceiptFormArray.push(
          this._fb.group({
            ID: [element.ID],
            MasterID: [element.MasterID],
            LedgerID: [element.LedgerID],
            LedgerCode: [element.LedgerCode],
            LedgerName: [element.LedgerName, Validators.required],
            VoucherNumber: [element.VoucherNumber],
            Amount: [element.Amount],
            LedgerBalance: [element.LedgerBalance],
            VoucherType: [element.VoucherType],
            Remarks: [element.Remarks],
          })
        );
      });
    } else {
      cashReceiptFormArray.push(
        this._fb.group({
          ID: [0],
          MasterID: [0],
          LedgerID: [0],
          LedgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          LedgerName: ["", Validators.required],
          VoucherNumber: [""],
          Amount: [""],
          LedgerBalance: [""],
          VoucherType: [""],
          Remarks: [""],
        })
      );
    }
    return cashReceiptFormArray;
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
    this.cashReceiptService
      .updateCashReceipt(this.cashReceiptForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/cash-receipt"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Cash Receipt edited successfully");
        }
      );
  }

  public cancel(): void {
    this.cashReceiptForm.reset();
    this.router.navigate(["/cash-receipt"]);
  }
}
