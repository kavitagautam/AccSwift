import { Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BankReconciliationService } from "./../../services/bank-reconciliation.service";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { BankReconciliation } from "../../models/bank-reconciliation.model";

@Component({
  selector: "accSwift-edit-bank-reconciliation",
  templateUrl: "../common-html/bank-reconciliation.html",
})
export class EditBankReconciliationComponent implements OnInit {
  bankReconciliationForm: FormGroup;
  date: Date = new Date();
  reconciliationDetails: BankReconciliation;
  numericFormat: string = "n2";
  public decimals: number = 2;
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
  };

  constructor(
    private _fb: FormBuilder,
    public reconciliationService: BankReconciliationService,
    private router: Router,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.buildbankReconciliationForm();
    this.getIdFromRoute();
  }

  buildbankReconciliationForm() {
    this.bankReconciliationForm = this._fb.group({
      SeriesID: [
        this.reconciliationDetails ? this.reconciliationDetails.SeriesID : null,
      ],
      ProjectID: [
        this.reconciliationDetails
          ? this.reconciliationDetails.ProjectID
          : null,
      ],
      VoucherNo: [
        this.reconciliationDetails ? this.reconciliationDetails.VoucherNo : "",
        [Validators.required],
      ],
      LedgerID: [
        this.reconciliationDetails ? this.reconciliationDetails.LedgerID : null,
        [Validators.required],
      ],
      Date: [
        this.reconciliationDetails
          ? new Date(this.reconciliationDetails.CreatedDate)
          : "",
      ],
      BankReconciliationDetailsList: this._fb.array([
        this.addReconciliationEntryList(),
      ]),
    });
  }

  addReconciliationEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [null],
      LedgerID: [null, Validators.required],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      DrCr: [""],
      LedgerBalance: [""],
      Amount: [0],
      Remarks: [""],
    });
  }

  getIdFromRoute() {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if (param) {
        this.reconciliationService
          .getBankReconciliationDetails(param)
          .subscribe((res) => {
            this.reconciliationDetails = res;
            this.buildbankReconciliationForm();
            this.setReconciliationList();
          });
      }
    });
  }

  setReconciliationList(): void {
    this.bankReconciliationForm.setControl(
      "BankReconciliationDetailsList",
      this.setReconciliationFormArray(
        this.reconciliationDetails.BankReconciliationDetailsList
      )
    );
  }

  get getreconciliationEntryList(): FormArray {
    return <FormArray>(
      this.bankReconciliationForm.get("BankReconciliationDetailsList")
    );
  }

  setReconciliationFormArray(reconciliationDetails): FormArray {
    const reconciliationFormArray = new FormArray([]);
    if (reconciliationDetails && reconciliationDetails.length > 0) {
      reconciliationDetails.forEach((element) => {
        reconciliationFormArray.push(
          this._fb.group({
            ID: [element.ID],
            MasterID: [element.MasterID],
            LedgerID: [element.LedgerID],
            LedgerCode: [
              element.LedgerCode,
              null,
              this.ledgerCodeMatchValidators.ledgerCodeMatch(),
            ],
            LedgerName: [element.LedgerName, Validators.required],
            DrCr: [element.DrCr],
            LedgerBalance: [element.LedgerBalance],
            Amount: [element.Amount],
            Remarks: [element.Remarks],
          })
        );
      });
    } else {
      reconciliationFormArray.push(
        this._fb.group({
          ID: [0],
          MasterID: [null],
          LedgerID: [null, Validators.required],
          LedgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          LedgerName: ["", Validators.required],
          DrCr: [""],
          LedgerBalance: [""],
          Amount: [0],
          Remarks: [""],
        })
      );
    }
    return reconciliationFormArray;
  }

  addreconciliationEntry(): void {
    this.submitted = true;
    if (
      this.bankReconciliationForm.get("BankReconciliationDetailsList").invalid
    )
      return;

    (<FormArray>(
      this.bankReconciliationForm.get("BankReconciliationDetailsList")
    )).push(this.addReconciliationEntryList());
    this.submitted = false;
  }

  public save(): void {
    if (this.bankReconciliationForm.valid) {
      this.router.navigate(["/bank-reconciliation"]);
    } else {
    }
  }

  public cancel(): void {
    this.bankReconciliationForm.reset();
    this.router.navigate(["/bank-reconciliation"]);
  }
}
