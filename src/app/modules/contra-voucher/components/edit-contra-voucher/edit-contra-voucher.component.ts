import { LedgerCodeAsyncValidators } from "./../../../../shared/validators/async-validators/ledger-code-validators.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { ContraVoucherService } from "./../../services/contra-voucher.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { LedgerCodeMatchService } from "@app/shared/services/ledger-code-match/ledger-code-match.service";
import { LedgerModelPopupComponent } from "@app/shared/component/ledger-model-popup/ledger-model-popup.component";
import { ContraVoucherMaster } from "../../models/contraVoucher.model";

@Component({
  selector: "accSwift-edit-contra-voucher",
  templateUrl: "./edit-contra-voucher.component.html",
  styleUrls: ["./edit-contra-voucher.component.scss"]
})
export class EditContraVoucherComponent implements OnInit {
  editContraVoucherForm: FormGroup;
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
    centered: true
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
    this.buildEditContraVoucherForm(); //initialize the buildEditContraVoucher Form
  }

  buildEditContraVoucherForm() {
    this.editContraVoucherForm = this.fb.group({
      seriesId: [
        this.contraVoucherDetail ? this.contraVoucherDetail.SeriesID : null
      ],
      projectId: [
        this.contraVoucherDetail ? this.contraVoucherDetail.ProjectID : null
      ],
      voucherNo: [
        this.contraVoucherDetail ? this.contraVoucherDetail.VoucherNo : "",
        [Validators.required]
      ],
      cashAccountId: [
        this.contraVoucherDetail ? this.contraVoucherDetail.LedgerID : null,
        [Validators.required]
      ],
      cashPartyId: [
        this.contraVoucherDetail
          ? this.contraVoucherDetail.ContraVoucherDetails
          : null,
        [Validators.required]
      ],
      date: [
        this.contraVoucherDetail
          ? new Date(this.contraVoucherDetail.CreatedDate)
          : ""
      ],
      contraVoucherEntryList: this.fb.array([this.addContraVoucherEntryList()])
    });
  }

  addContraVoucherEntryList(): FormGroup {
    return this.fb.group({
      ledgerCode: ["", null, this.ledgerCodeMatchValidators.ledgerCodeMatch()],
      particularsOraccountingHead: ["", Validators.required],
      voucherNo: ["", [Validators.required]],
      amount: [""],
      currentBalance: [""],
      vType: [""],
      remarks: [""]
    });
  }

  getIdFromRoute() {
    this.route.paramMap.subscribe(params => {
      const paramGetId = params.get("id");
      if (paramGetId) {
        this.contraVoucherService
          .getContraVoucherDetails(paramGetId)
          .subscribe(res => {
            this.contraVoucherDetail = res;
            this.buildEditContraVoucherForm();
            this.setContraVoucherList();
          });
      }
    });
  }

  get getContraVoucherEntryList(): FormArray {
    return <FormArray>this.editContraVoucherForm.get("contraVoucherEntryList");
  }

  setContraVoucherList(): void {
    this.editContraVoucherForm.setControl(
      "contraVoucherEntryList",
      this.setContraVoucherFormArray(
        this.contraVoucherDetail.ContraVoucherDetails
      )
    );
  }

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
    if (this.editContraVoucherForm.get("contraVoucherEntryList").invalid)
      return;
    (<FormArray>this.editContraVoucherForm.get("contraVoucherEntryList")).push(
      this.addContraVoucherEntryList()
    );
    this.submitted = false;
  }

  changeLedgerValue(dataItem, rowIndex): void {
    const contraVoucherFormArray = <FormArray>(
      this.editContraVoucherForm.get("contraVoucherEntryList")
    );
    const ledgerCode = contraVoucherFormArray.controls[rowIndex].get(
      "ledgerCode"
    ).value;
    if (
      contraVoucherFormArray.controls[rowIndex].get("ledgerCode").status ===
      "VALID"
    ) {
      this.ledgerCodeService.checkLedgerCode(ledgerCode).subscribe(res => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          contraVoucherFormArray.controls[rowIndex]
            .get("currentBalance")
            .setValue(selectedItem[0].ActualBalance);
          contraVoucherFormArray.controls[rowIndex]
            .get("particularsOraccountingHead")
            .setValue(selectedItem[0].LedgerName);
          contraVoucherFormArray.controls[rowIndex]
            .get("ledgerCode")
            .setValue(selectedItem[0].LedgerCode);
        }
      });
    }
  }

  public save(): void {
    if (this.editContraVoucherForm.valid) {
      this.router.navigate(["/contra-voucher"]);
    } else {
    }
  }
  public cancel(): void {
    this.editContraVoucherForm.reset();
    this.router.navigate(["/contra-voucher"]);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.FormGroup = undefined
  }

  // Add Handler Goes Here
  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const contraVoucherEntry = <FormArray>(
      this.editContraVoucherForm.get("contraVoucherEntryList")
    );
    if (contraVoucherEntry.invalid) return;
    contraVoucherEntry.push(this.addContraVoucherEntryList());
    this.rowSubmitted = false;
    this.submitted = false;
  }

  //Edit Handler Goes Here.....
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const contraVoucherEntry = <FormArray>(
      this.editContraVoucherForm.get("contraVoucherEntryList")
    );
    contraVoucherEntry.controls[rowIndex]
      .get("voucherNo")
      .setValue(dataItem.voucherNo);
    contraVoucherEntry.controls[rowIndex]
      .get("currentAmount")
      .setValue(dataItem.currentAmount);
    contraVoucherEntry.controls[rowIndex].get("vType").setValue(dataItem.vType);
    contraVoucherEntry.controls[rowIndex]
      .get("remarks")
      .setValue(dataItem.remarks);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editContraVoucherForm.get("contraVoucherEntryList")
    );
  }

  //Open Modal Goes Here...
  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      LedgerModelPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe(data => {
      if (data) {
        const contraVoucherFormArray = <FormArray>(
          this.editContraVoucherForm.get("contraVoucherEntryList")
        );
        contraVoucherFormArray.controls[index]
          .get("currentBalance")
          .setValue(data.ActualBalance);
        contraVoucherFormArray.controls[index]
          .get("particularsOraccountingHead")
          .setValue(data.LedgerName);
        contraVoucherFormArray.controls[index]
          .get("ledgerCode")
          .setValue(data.LedgerCode);
      }
    });
    this.modalRef.content.onClose.subscribe(data => {
      //Do after Close the Modal
    });
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    //Save code
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const contraVoucherEntry = <FormArray>(
      this.editContraVoucherForm.get("contraVoucherEntryList")
    );
    contraVoucherEntry.removeAt(rowIndex);
  }
}
