import { BankPayment } from "./../../models/bank-payment.model";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { BankPaymentService } from "../../services/bank-payment.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";

@Component({
  selector: "accSwift-edit-bank-payment",
  templateUrl: "../common-html/common-bank-payment.html",
  styleUrls: ["./edit-bank-payment.component.scss"],
})
export class EditBankPaymentComponent implements OnInit {
  bankPaymentForm: FormGroup;

  bankPaymentDetails: BankPayment;
  submitted: boolean;
  rowSubmitted: boolean;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
  };

  constructor(
    public bankPaymentService: BankPaymentService,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildbankPaymentForm();
    this.getIdFromRoute();
  }

  buildbankPaymentForm(): void {
    this.bankPaymentForm = this._fb.group({
      ID: this.bankPaymentDetails ? this.bankPaymentDetails.ID : 0,
      SeriesID: [
        this.bankPaymentDetails ? this.bankPaymentDetails.SeriesID : null,
      ],
      ProjectID: [
        this.bankPaymentDetails ? this.bankPaymentDetails.ProjectID : null,
      ],
      VoucherNo: [
        this.bankPaymentDetails ? this.bankPaymentDetails.VoucherNo : "",
        [Validators.required],
      ],
      LedgerID: [
        this.bankPaymentDetails ? this.bankPaymentDetails.LedgerID : null,
        [Validators.required],
      ],
      Date: [
        this.bankPaymentDetails
          ? new Date(this.bankPaymentDetails.CreatedDate)
          : "",
      ],
      Remarks: [this.bankPaymentDetails ? this.bankPaymentDetails.Remarks : ""],
      BankPaymentDetailsList: this._fb.array([this.addBankPaymentEntryList()]),
    });
  }

  addBankPaymentEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      MasterID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      ChequeNumber: [""],
      ChequeDate: [""],
      LedgerBalance: [""],
      Amount: [""],
      Remarks: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get("id")) {
        this.bankPaymentService
          .getBankPaymentDetails(params.get("id"))
          .subscribe((response) => {
            this.bankPaymentDetails = response.Entity;
            this.setBankPaymentList();
            this.bankPaymentForm.patchValue(this.bankPaymentDetails);
          });
      }
    });
  }

  setBankPaymentList(): void {
    this.bankPaymentForm.setControl(
      "BankPaymentDetailsList",
      this.setBankPaymentFormArray(
        this.bankPaymentDetails.BankPaymentDetailsList
      )
    );
    (<FormArray>this.bankPaymentForm.get("BankPaymentDetailsList")).push(
      this.addBankPaymentEntryList()
    );
  }

  setBankPaymentFormArray(bankPaymentDetails): FormArray {
    const bankPaymentFormArray = new FormArray([]);
    if (bankPaymentDetails && bankPaymentDetails.length > 0) {
      bankPaymentDetails.forEach((element) => {
        bankPaymentFormArray.push(
          this._fb.group({
            ID: [element.ID],
            MasterID: [element.MasterID],
            LedgerID: [element.LedgerID],
            LedgerCode: [
              element.LedgerCode ? element.LedgerCode : "",
              null,
              this.ledgerCodeMatchValidators.ledgerCodeMatch(),
            ],
            LedgerName: [element.LedgerName, Validators.required],
            ChequeNumber: [element.ChequeNumber],
            ChequeDate: [new Date(element.ChequeDate)],
            LedgerBalance: [element.LedgerBalance],
            Amount: [element.Amount],
            Remarks: [element.Remarks],
          })
        );
      });
    } else {
      bankPaymentFormArray.push(
        this._fb.group({
          ID: [""],
          MasterID: [""],
          LedgerID: [""],
          LedgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          LedgerName: ["", Validators.required],
          ChequeNumber: [""],
          ChequeDate: [""],
          LedgerBalance: [""],
          Amount: [""],
          Remarks: [""],
        })
      );
    }
    return bankPaymentFormArray;
  }

  get getBankPaymentEntryList(): FormArray {
    return <FormArray>this.bankPaymentForm.get("BankPaymentDetailsList");
  }

  public save(): void {
    if (this.bankPaymentForm.invalid) return;
    this.bankPaymentService
      .updateBankPayment(this.bankPaymentForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/bank-payment"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Bank Payment edited successfully");
        }
      );
  }

  public cancel(): void {
    this.bankPaymentForm.reset();
    this.router.navigate(["/bank-payment"]);
  }
}
