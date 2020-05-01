import {
  PurchaseInvoiceMaster,
  PurchaseInvoiceDetail,
} from "./../../models/purchase-invoice.model";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-edit-purchase-invoice",
  templateUrl: "../common-html/purchase-invoice.html",
  styleUrls: ["./edit-purchase-invoice.component.scss"],
})
export class EditPurchaseInvoiceComponent implements OnInit {
  purchaseInvoiceForm: FormGroup;
  numericFormat: string = "n2";
  public decimals: number = 2;
  purchaseDetails: PurchaseInvoiceDetail;
  date: Date = new Date();
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public purchaseService: PurchaseInvoiceService
  ) {}

  ngOnInit() {
    this.buildEditInvoiceForm();
    this.getIdFromRoute();
  }

  buildEditInvoiceForm(): void {
    this.purchaseInvoiceForm = this._fb.group({
      seriesId: this.purchaseDetails ? this.purchaseDetails.SeriesID : null,
      cashPartyACId: this.purchaseDetails
        ? [this.purchaseDetails.CashPartyLedgerID, [Validators.required]]
        : null,
      purchaseAcId: [
        this.purchaseDetails ? this.purchaseDetails.PurchaseLedgerID : null,
      ],
      voucherNo: [
        this.purchaseDetails ? this.purchaseDetails.VoucherNo : "",
        [Validators.required],
      ],
      partyBillNo: [
        this.purchaseDetails ? this.purchaseDetails.PartyBillNumber : "",
      ],
      depotLocationId: [
        this.purchaseDetails ? this.purchaseDetails.DepotID : null,
        [Validators.required],
      ],
      projectId: [this.purchaseDetails ? this.purchaseDetails.ProjectID : null],
      date: [
        this.purchaseDetails ? new Date(this.purchaseDetails.CreatedDate) : "",
      ],
      orderNo: [
        this.purchaseDetails ? this.purchaseDetails.OrderNo : "",
        [Validators.required],
      ],
      remarks: [this.purchaseDetails ? this.purchaseDetails.Remarks : ""],
      purchaseInvoiceEntryList: this._fb.array([
        this.addPurchaseInvoiceEntryList(),
      ]),
    });
  }

  addPurchaseInvoiceEntryList(): FormGroup {
    return this._fb.group({
      code: [" "],
      productName: [" "],
      quantity: [" "],
      unit: [" "],
      purchaseRate: [" "],
      amount: [" "],
      specialDiscount: [" "],
      specialDiscounts: [" "],
      netAmount: [" "],
      vat: [" "],
      customDuty: [" "],
      customDutyAmt: [" "],
      freight: [" "],
      tc: [" "],
      tcAmount: [""],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = +params.get("id");
      if (param) {
        this.purchaseService
          .getPurchaseInvoiceDetails(param)
          .subscribe((res) => {
            this.purchaseDetails = res.Entity;
            this.buildEditInvoiceForm();
          });
      }
    });
  }

  public save(): void {
    if (this.purchaseInvoiceForm.valid) {
      this.router.navigate(["/purchase-invoice"]);
    }
  }

  public cancel(): void {
    this.purchaseInvoiceForm.reset();
    this.router.navigate(["/purchase-invoice"]);
  }

  get getPurchaseEntryList(): FormArray {
    return <FormArray>this.purchaseInvoiceForm.get("purchaseInvoiceEntryList");
  }

  private closeEditor(grid, rowIndex = 1): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }): void {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const purchaseInvoiceEntry = <FormArray>(
      this.purchaseInvoiceForm.get("purchaseInvoiceEntryList")
    );
    if (purchaseInvoiceEntry.invalid) return;
    (<FormArray>this.purchaseInvoiceForm.get("purchaseInvoiceEntryList")).push(
      this.addPurchaseInvoiceEntryList()
    );
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }): void {
    this.closeEditor(sender);
    const purchaseInvoiceEntry = <FormArray>(
      this.purchaseInvoiceForm.get("purchaseInvoiceEntryList")
    );
    purchaseInvoiceEntry.controls[rowIndex].get("code").setValue(dataItem.code);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("productName")
      .setValue(dataItem.productName);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("quantity")
      .setValue(dataItem.quantity);
    purchaseInvoiceEntry.controls[rowIndex].get("unit").setValue(dataItem.unit);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("purchaseRate")
      .setValue(dataItem.purchaseRate);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("amount")
      .setValue(dataItem.amount);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("specialDiscount")
      .setValue(dataItem.specialDiscount);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("specialDiscounts")
      .setValue(dataItem.specialDiscounts);
    purchaseInvoiceEntry.controls[rowIndex].get("vat").setValue(dataItem.vat);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("customDuty")
      .setValue(dataItem.customDuty);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("freight")
      .setValue(dataItem.freight);
    purchaseInvoiceEntry.controls[rowIndex].get("tc").setValue(dataItem.tc);
    purchaseInvoiceEntry.controls[rowIndex]
      .get("tcAmount")
      .setValue(dataItem.tcAmount);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.purchaseInvoiceForm.get("purchaseInvoiceEntryList")
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>(
      this.purchaseInvoiceForm.get("purchaseInvoiceEntryList")
    )).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }): void {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
