import { CashReceiptDetails } from "./../../../cash-receipts/models/cash-receipt.model";
import {
  SeriesList,
  ProjectList
} from "./../../../bank-receipts/models/bank-receipt.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { ContraVoucherService } from "./../../services/contra-voucher.service";
import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { ContraVoucherMaster } from "../models/contravoucher.model";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";

@Component({
  selector: "app-edit-contra-voucher",
  templateUrl: "./edit-contra-voucher.component.html",
  styleUrls: ["./edit-contra-voucher.component.scss"]
})
export class EditContraVoucherComponent implements OnInit {
  editContraVoucherForm: FormGroup;
  seriesList: SeriesList;
  projectList: ProjectList;
  date: Date = new Date();
  contraVoucherMaster: ContraVoucherMaster;
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;
  //Open the Ledger List modal on popup
  modalRef: BsModalRef;
  //Modal config to unhide modal when clicked outside..
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true
  };

  constructor(
    private fb: FormBuilder,
    private contraVoucherService: ContraVoucherService,
    private route: ActivatedRoute,
    private router: Router,

    private modalService: BsModalService,
    public ledgerCodeService: LedgerCodeMatchService
  ) {}

  ngOnInit() {
    this.getEditContraVoucherForm();
    this.contraVoucherService.init();
    this.getParambyId();
  }

  getEditContraVoucherForm() {
    this.editContraVoucherForm = this.fb.group({
      series: [
        this.contraVoucherMaster ? this.contraVoucherMaster.SeriesID : ""
      ],
      project: [
        this.contraVoucherMaster ? this.contraVoucherMaster.ProjectID : ""
      ],
      voucherNo: [
        this.contraVoucherMaster ? this.contraVoucherMaster.VoucherNo : ""
      ],
      cashAccount: [
        this.contraVoucherMaster ? this.contraVoucherMaster.LedgerID : ""
      ],
      cashParty: [this.contraVoucherMaster ? this.contraVoucherMaster : ""],
      date: [
        this.contraVoucherMaster
          ? formatDate(
              this.contraVoucherMaster.CreatedDate,
              "yyyy-MM-dd",
              "en-US"
            )
          : ""
      ],
      contraVoucherEntryList: this.fb.array([
        this.addContraVoucherEntryFormGroup()
      ])
    });
  }

  // Building FormArray ......
  addContraVoucherEntryFormGroup(): FormGroup {
    return this.fb.group({
      ledgerCode: [""],
      particularsOraccountingHead: [""],
      voucherNo: [""],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""]
    });
  }

  getParambyId() {
    this.route.paramMap.subscribe(params => {
      const paramGetId = params.get("id");
      if (paramGetId) {
        this.contraVoucherService
          .getCashReceiptDetails(paramGetId)
          .subscribe(res => {
            this.contraVoucherMaster = res;
            this.getEditContraVoucherForm();
            // this.setCashReceiptList();
          });
      }
    });
  }

  get getContraVoucherEntryList(): FormArray {
    return <FormArray>this.editContraVoucherForm.get("contraVoucherEntryList");
  }

  // setCashReceiptList(): void {
  //   this.editContraVoucherForm.setControl(
  //     "contraVoucherEntryList",
  //     this.setContraVoucherFormArray(this.cashReceiptDetails.CashReceiptDetails)
  //   );

  setContraVoucherFormArray(contraVoucherDetails): FormArray {
    const contraVoucherFormArray = new FormArray([]);
    if (contraVoucherDetails && contraVoucherDetails.length > 0) {
      contraVoucherDetails.forEach(element => {
        contraVoucherFormArray.push(
          this.fb.group({
            ledgerCode: [element.Ledger.Code ? element.Ledger.Code : ""],
            particularsOraccountingHead: [
              element.Ledger.EngName,
              Validators.required
            ],
            voucherNo: [element.VoucherNumber],
            amount: element.Amount,
            currentBalance: element.Amount,
            vType: element.VoucherType,
            remarks: element.Remarks
          })
        );
      });
    } else {
      contraVoucherFormArray.push(
        this.fb.group({
          particularsOraccountingHead: "",
          voucherNo: "",
          amount: "",
          currentBalance: "",
          vType: "",
          remarks: ""
        })
      );
    }
    return contraVoucherFormArray;
  }

  addContraVoucherEntry(): void {
    this.submitted = true;
  }
}
