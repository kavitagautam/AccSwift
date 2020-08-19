import { Component, OnInit } from "@angular/core";
import { FormArray, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LedgerCodeMatchService } from "@accSwift-modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { ContraVoucherService } from "../../services/contra-voucher.service";
import { ContraVoucherMaster } from "../../models/contraVoucher.model";

@Component({
  selector: "accSwift-add-contra-voucher",
  templateUrl: "../common-html/contra-voucher.html",
})
export class AddContraVoucherComponent implements OnInit {
  contraVoucherForm: FormGroup;
  date: Date = new Date();
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
    class: "modal-lg",
  };

  constructor(
    private fb: FormBuilder,
    public contraVoucherService: ContraVoucherService,
    private router: Router,
    private modalService: BsModalService,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.buildcontraVoucherForm(); // initiate the AddContraVoucher Form
  }

  buildcontraVoucherForm() {
    this.contraVoucherForm = this.fb.group({
      SeriesID: [null],
      ProjectID: [null],
      cashAccountId: [null, [Validators.required]],
      VoucherNo: ["", [Validators.required]],
      cashPartyId: [null, [Validators.required]],
      Date: [new Date()],
      ContraVoucherDetails: this.fb.array([this.addContraVoucherEntryList()]),
    });
  }

  addContraVoucherEntryList(): FormGroup {
    return this.fb.group({
      ID: [0],
      LedgerCode: [""],
      LedgerName: ["", Validators.required],
      VoucherNo: ["", [Validators.required]],
      Amount: [""],
      LedgerBalance: [""],
      VoucherType: [""],
      Remarks: [""],
    });
  }

  get getContraVoucherEntryList(): FormArray {
    return <FormArray>this.contraVoucherForm.get("ContraVoucherDetails");
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
