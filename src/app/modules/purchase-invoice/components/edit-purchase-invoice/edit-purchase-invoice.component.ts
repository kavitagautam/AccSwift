import { PurchaseInvoiceMaster } from "./../../models/purchase-invoice.model";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-edit-purchase-invoice",
  templateUrl: "./edit-purchase-invoice.component.html",
  styleUrls: ["./edit-purchase-invoice.component.scss"]
})
export class EditPurchaseInvoiceComponent implements OnInit {
  editPurchaseForm: FormGroup;
  numericFormat: string = "n2";
  public decimals: number = 2;
  purchaseDetails: PurchaseInvoiceMaster;
  date: Date = new Date();
  submitted: boolean;
  rowSubmitted: boolean;
  editedRowIndex: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public purchaseService: PurchaseInvoiceService
  ) {}

  ngOnInit() {
    this.buildEditInvoiceForm();
    this.getIdFromRoute();
  }

  buildEditInvoiceForm() {
    this.editPurchaseForm = this.fb.group({
      seriesId: this.purchaseDetails ? this.purchaseDetails.SeriesID : null,
      cashPartyACId: this.purchaseDetails
        ? [this.purchaseDetails.CashPartyLedgerID, [Validators.required]]
        : null,
      purchaseAcId: [
        this.purchaseDetails ? this.purchaseDetails.PurchLedgerID : null
      ],
      voucherNo: [
        this.purchaseDetails ? this.purchaseDetails.VoucherNo : "",
        [Validators.required]
      ],
      partyBillNo: [
        this.purchaseDetails ? this.purchaseDetails.PartyBillNumber : ""
      ],
      depotLocationId: [
        this.purchaseDetails ? this.purchaseDetails.DepotID : null,
        [Validators.required]
      ],
      projectId: [this.purchaseDetails ? this.purchaseDetails.ProjectID : null],
      date: [
        this.purchaseDetails ? new Date(this.purchaseDetails.CreatedDate) : ""
      ],
      orderNo: [
        this.purchaseDetails ? this.purchaseDetails.OrderNo : "",
        [Validators.required]
      ],
      remarks: [this.purchaseDetails ? this.purchaseDetails.Remarks : ""],
      purchaseInvoiceEntryList: this.fb.array([
        this.addPurchaseInvoiceEntryList()
      ]) // Form Array..
    });
  }

  addPurchaseInvoiceEntryList(): FormGroup {
    return this.fb.group({
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
      tcAmount: [""]
    });
  }

  getIdFromRoute() {
    this.route.paramMap.subscribe(params => {
      const param = +params.get("id");
      if (param) {
        this.purchaseService.getPurchaseInvoiceDetails(param).subscribe(res => {
          this.purchaseDetails = res;
          this.buildEditInvoiceForm();
        });
      }
    });
  }

  public save(): void {
    if (this.editPurchaseForm.valid) {
      this.router.navigate(["/purchase-invoice"]);
    }
  }

  public cancel(): void {
    this.editPurchaseForm.reset();
    this.router.navigate(["/purchase-invoice"]);
  }

  get getPurchaseEntryList(): FormArray {
    return <FormArray>this.editPurchaseForm.get("purchaseInvoiceEntryList");
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    // this.FormGroup = undefined
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const purchaseInvoiceEntry = <FormArray>(
      this.editPurchaseForm.get("purchaseInvoiceEntryList")
    );
    if (purchaseInvoiceEntry.invalid) return;
    (<FormArray>this.editPurchaseForm.get("purchaseInvoiceEntryList")).push(
      this.addPurchaseInvoiceEntryList()
    );
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const purchaseInvoiceEntry = <FormArray>(
      this.editPurchaseForm.get("purchaseInvoiceEntryList")
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
      this.editPurchaseForm.get("purchaseInvoiceEntryList")
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.editPurchaseForm.get("purchaseInvoiceEntryList")).removeAt(
      rowIndex
    );
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
