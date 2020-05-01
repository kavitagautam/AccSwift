import { Router } from "@angular/router";
import { PurchaseInvoiceService } from "./../../services/purchase-invoice.service";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-add-purchase-invoice",
  templateUrl: "../common-html/purchase-invoice.html",
  styleUrls: ["./add-purchase-invoice.component.scss"],
})
export class AddPurchaseInvoiceComponent implements OnInit {
  purchaseInvoiceForm: FormGroup;
  submitted: boolean;
  rowSubmitted: boolean;
  private editedRowIndex: number;
  constructor(
    private fb: FormBuilder,
    public purchaseService: PurchaseInvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildPurchaseInvoiceForm();
  }

  buildPurchaseInvoiceForm(): void {
    this.purchaseInvoiceForm = this.fb.group({
      seriesId: [null],
      cashPartyACId: [null, [Validators.required]],
      purchaseAcId: [null],
      voucherNo: ["", [Validators.required]],
      partyBillNo: [""],
      depotLocationId: [null, [Validators.required]],
      projectId: [null],
      date: [new Date()],
      orderNo: ["", [Validators.required]],
      remarks: [""],
      purchaseInvoiceEntryList: this.fb.array([this.addPurchaseEntryList()]),
    });
  }

  addPurchaseEntryList(): FormGroup {
    return this.fb.group({
      code: [""],
      productName: [""],
      quantity: [""],
      unit: [""],
      purchaseRate: [""],
      amount: [""],
      specialDiscount: [""],
      specialDiscounts: [""],
      netAmount: [""],
      vat: [""],
      customDuty: [""],
      customDutyAmt: [""],
      freight: [""],
      tc: [""],
      tcAmount: [""],
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

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const purchaseInvoiceEntry = <FormArray>(
      this.purchaseInvoiceForm.get("purchaseInvoiceEntryList")
    );
    if (purchaseInvoiceEntry.invalid) return;
    (<FormArray>this.purchaseInvoiceForm.get("purchaseInvoiceEntryList")).push(
      this.addPurchaseEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
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

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
