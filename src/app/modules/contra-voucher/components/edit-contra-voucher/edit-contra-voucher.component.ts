import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { ContraVoucherService } from "./../../services/contra-voucher.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { ContraVoucherMaster } from "../../models/contraVoucher.model";
import { LedgerCodeAsyncValidators } from "@accSwift-modules/accswift-shared/validators/async-validators/ledger-code-match/ledger-code-validators.service";
import { LedgerModalPopupComponent } from "@accSwift-modules/accswift-shared/components/ledger-modal-popup/ledger-modal-popup.component";

@Component({
  selector: "accSwift-edit-contra-voucher",
  templateUrl: "../common-html/contra-voucher.html",
})
export class EditContraVoucherComponent implements OnInit {
  contraVoucherForm: FormGroup;
  date: Date = new Date();
  numericFormat: string = "n2";
  public decimals: number = 2;
  contraVoucherDetail: ContraVoucherMaster;
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;
  //Open the Ledger List modal on popup
  modalRef: BsModalRef;
  //Modal config to unhide modal when clicked outside..
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
  };

  constructor(
    private fb: FormBuilder,
    public contraVoucherService: ContraVoucherService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    public ledgerCodeMatchValidators: LedgerCodeAsyncValidators,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.getIdFromRoute();
    this.buildcontraVoucherForm(); //initialize the buildEditContraVoucher Form
  }

  buildcontraVoucherForm() {
    this.contraVoucherForm = this.fb.group({
      SeriesID: [
        this.contraVoucherDetail ? this.contraVoucherDetail.SeriesID : null,
      ],
      ProjectID: [
        this.contraVoucherDetail ? this.contraVoucherDetail.ProjectID : null,
      ],
      VoucherNo: [
        this.contraVoucherDetail ? this.contraVoucherDetail.VoucherNo : "",
        [Validators.required],
      ],
      cashAccountId: [
        this.contraVoucherDetail ? this.contraVoucherDetail.LedgerID : null,
        [Validators.required],
      ],
      cashPartyId: [
        this.contraVoucherDetail
          ? this.contraVoucherDetail.ContraVoucherDetails
          : null,
        [Validators.required],
      ],
      Date: [
        this.contraVoucherDetail
          ? new Date(this.contraVoucherDetail.CreatedDate)
          : "",
      ],
      ContraVoucherDetails: this.fb.array([this.addContraVoucherEntryList()]),
    });
  }

  addContraVoucherEntryList(): FormGroup {
    return this.fb.group({
      ID: [0],
      LedgerID: [0],
      LedgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      LedgerName: ["", Validators.required],
      VoucherNo: ["", [Validators.required]],
      Amount: [""],
      LedgerBalance: [""],
      VoucherType: [""],
      Remarks: [""],
    });
  }

  getIdFromRoute() {
    this.route.paramMap.subscribe((params) => {
      const paramGetId = params.get("id");
      if (paramGetId) {
        this.contraVoucherService
          .getContraVoucherDetails(paramGetId)
          .subscribe((res) => {
            this.contraVoucherDetail = res;
            this.buildcontraVoucherForm();
            this.setContraVoucherList();
          });
      }
    });
  }

  get getContraVoucherEntryList(): FormArray {
    return <FormArray>this.contraVoucherForm.get("ContraVoucherDetails");
  }

  setContraVoucherList(): void {
    this.contraVoucherForm.setControl(
      "ContraVoucherDetails",
      this.setContraVoucherFormArray(
        this.contraVoucherDetail.ContraVoucherDetails
      )
    );
  }

  setContraVoucherFormArray(contraVoucherDetails): FormArray {
    const contraVoucherFormArray = new FormArray([]);
    if (contraVoucherDetails && contraVoucherDetails.length > 0) {
      contraVoucherDetails.forEach((element) => {
        contraVoucherFormArray.push(
          this.fb.group({
            LedgerID: [element.LedgerID],
            LedgerCode: [element.Ledger],
            LedgerName: [element.Ledger.EngName, Validators.required],
            VoucherNo: [element.VoucherNumber],
            Amount: element.Amount,
            LedgerBalance: element.Amount,
            VoucherType: element.VoucherType,
            Remarks: element.Remarks,
          })
        );
      });
    } else {
      contraVoucherFormArray.push(
        this.fb.group({
          ID: [0],
          LedgerID: [0],
          LedgerCode: [
            "",
            null,
            this.ledgerCodeMatchValidators.ledgerCodeMatch(),
          ],
          LedgerName: ["", Validators.required],
          VoucherNo: ["", [Validators.required]],
          Amount: [""],
          LedgerBalance: [""],
          VoucherType: [""],
          Remarks: [""],
        })
      );
    }
    return contraVoucherFormArray;
  }

  addContraVoucherEntry(): void {
    this.submitted = true;
    if (this.contraVoucherForm.get("ContraVoucherDetails").invalid) return;
    (<FormArray>this.contraVoucherForm.get("ContraVoucherDetails")).push(
      this.addContraVoucherEntryList()
    );
    this.submitted = false;
  }

  public save(): void {
    if (this.contraVoucherForm.valid) {
      this.router.navigate(["/contra-voucher"]);
    } else {
    }
  }
  public cancel(): void {
    this.contraVoucherForm.reset();
    this.router.navigate(["/contra-voucher"]);
  }
}
