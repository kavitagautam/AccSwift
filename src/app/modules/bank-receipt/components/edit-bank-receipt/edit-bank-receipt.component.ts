import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { BankReceiptService } from "../../services/bank-receipt.service";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { ToastrService } from "ngx-toastr";
import { BankReceipt } from "../../models/bank-receipt.model";

@Component({
  selector: "accswift-edit-bank-receipt",
  templateUrl: "../common-html/common-bank-receipt.html",
  styleUrls: ["./edit-bank-receipt.component.scss"],
})
export class EditBankReceiptComponent implements OnInit {
  bankReceiptDetails: BankReceipt;
  bankReceiptForm: FormGroup;

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
    public bankReceiptService: BankReceiptService,
    private route: ActivatedRoute,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildBankReceiptForm();
    this.getIdFromRoute(); // Get Id From the Route URL and get the Details
  }

  buildBankReceiptForm(): void {
    this.bankReceiptForm = this._fb.group({
      ID: [this.bankReceiptDetails ? this.bankReceiptDetails.ID : null],
      SeriesID: [
        this.bankReceiptDetails ? this.bankReceiptDetails.SeriesID : null,
      ],
      ProjectID: [
        this.bankReceiptDetails ? this.bankReceiptDetails.ProjectID : null,
        [Validators.required],
      ],
      VoucherNo: [
        this.bankReceiptDetails ? this.bankReceiptDetails.VoucherNo : "",
        [Validators.required],
      ],
      LedgerID: [
        this.bankReceiptDetails ? this.bankReceiptDetails.LedgerID : null,
        [Validators.required],
      ],
      Date: [
        this.bankReceiptDetails ? new Date(this.bankReceiptDetails.Date) : "",
      ],
      Remarks: [this.bankReceiptDetails ? this.bankReceiptDetails.Remarks : ""],
      BankReceiptDetailsList: this._fb.array([
        this.addBankReceiptDetailsList(),
      ]),
    });
  }

  addBankReceiptDetailsList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      VoucherNumber: [""],
      ChequeNumber: [""],
      ChequeBank: [""],
      ChequeDate: [""],
      Amount: [""],
      LedgerBalance: [""],
      VoucherType: [""],
      Remarks: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.bankReceiptService
          .getBankReceiptDetails(params.get("id"))
          .subscribe((response) => {
            this.bankReceiptDetails = response.Entity;
            //this.buildBankReceiptForm();
            this.setBankReceiptList();
            this.bankReceiptForm.patchValue(this.bankReceiptDetails);
          });
      }
    });
  }

  setBankReceiptList(): void {
    this.bankReceiptForm.setControl(
      "BankReceiptDetailsList",
      this.setBankReceiptFormArray(
        this.bankReceiptDetails.BankReceiptDetailsList
      )
    );
    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
      this.addBankReceiptDetailsList()
    );
  }

  get getBankReceiptEntryList(): FormArray {
    return <FormArray>this.bankReceiptForm.get("BankReceiptDetailsList");
  }

  setBankReceiptFormArray(bankReceiptDetails): FormArray {
    const bankReceiptFormArray = new FormArray([]);
    if (bankReceiptDetails && bankReceiptDetails.length > 0) {
      bankReceiptDetails.forEach((element) => {
        bankReceiptFormArray.push(
          this._fb.group({
            ID: [element.ID ? element.ID : 0],
            MasterID: [element.MasterID ? element.MasterID : 0],
            LedgerID: [element.LedgerID ? element.LedgerID : 0],
            LedgerCode: [
              element.LedgerCode ? element.LedgerCode : "",
              null,
              this.ledgerCodeMatchValidators.ledgerCodeMatch(),
            ],
            LedgerName: [
              element.LedgerName ? element.LedgerName : "",
              Validators.required,
            ],
            VoucherNumber: [element.VoucherNumber ? element.VoucherNumber : ""],
            ChequeNumber: [element.ChequeNumber ? element.ChequeNumber : ""],
            ChequeBank: [element.ChequeBank ? element.ChequeBank : ""],
            ChequeDate: [
              element.ChequeDate ? new Date(element.ChequeDate) : "",
            ],
            Amount: [element.Amount ? element.Amount : 0],
            LedgerBalance: [element.LedgerBalance ? element.LedgerBalance : ""],
            VoucherType: [element.VoucherType ? element.VoucherType : ""],
            Remarks: [element.Remarks ? element.Remarks : ""],
          })
        );
      });
    } else {
      bankReceiptFormArray.push(
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
          ChequeNumber: [""],
          ChequeBank: [""],
          ChequeDate: [""],
          Amount: [""],
          LedgerBalance: [""],
          VoucherType: [""],
          Remarks: [""],
        })
      );
    }

    return bankReceiptFormArray;
  }

  addCashReceiptEntry(): void {
    this.submitted = true;
    if (this.bankReceiptForm.get("BankReceiptDetailsList").invalid) return;

    (<FormArray>this.bankReceiptForm.get("BankReceiptDetailsList")).push(
      this.addBankReceiptDetailsList()
    );
    this.submitted = false;
  }

  public save(): void {
    if (this.bankReceiptForm.invalid) return;
    this.bankReceiptService
      .updateBankReceipt(this.bankReceiptForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/bank-receipt"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Bank Receipt edited successfully");
        }
      );
  }

  public cancel(): void {
    this.bankReceiptForm.reset();
    this.router.navigate(["/bank-receipt"]);
  }
}
