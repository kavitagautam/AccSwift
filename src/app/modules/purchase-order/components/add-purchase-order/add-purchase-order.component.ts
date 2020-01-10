import { PurchaseOrderService } from './../../services/purchase-order.service';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormArray } from '@angular/forms';

import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'accSwift-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.scss']
})
export class AddPurchaseOrderComponent implements OnInit {
  addPurchaseOrderForm: FormGroup;
  date: Date = new Date();
  public decimals: number = 1;
  listLoading: boolean;
  modalRef: BsModalRef;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(private fb: FormBuilder,
    public purchaseOrderService: PurchaseOrderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildAddPurchaseOrderForm(); // initialize the form
  }

  buildAddPurchaseOrderForm() {
    this.addPurchaseOrderForm = this.fb.group({
      orderNo: [""],
      date: [new Date()],
      cashPartyACId: [0],
      projectId: [0],
      purchaseOrderEntryList: this.fb.array([this.addPurchaseOrderEntryList()])
    });
  }

  addPurchaseOrderEntryList(): FormGroup {
    return this.fb.group({
      ProductName: [""],
      Quantity: [""],
      Unit: [""],
      PurchaseRate: [""],
      Amount: [""],
      SpecialDiscount: [""],
      NetAmount: [""],
      VAT: [""],
    })
  }

  //Date String Parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  }

  get getPurchaseOrderEntryList(): FormArray {
    return <FormArray>this.addPurchaseOrderForm.get("purchaseOrderEntryList");
  }

  public save(): void {
    if (this.addPurchaseOrderForm.valid) {
      this.router.navigate(["/purchase-order"]);
    }
  }

  public cancel(): void {
    this.addPurchaseOrderForm.reset();
    this.router.navigate(["/purchase-order"]);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    //this.formGroup = undefined
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const purchaseOrderEntry = <FormArray>(this.addPurchaseOrderForm.get("purchaseOrderEntryList"));
    if (purchaseOrderEntry.invalid) return;
    (<FormArray>purchaseOrderEntry).push(this.addPurchaseOrderEntryList());
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const purchaseOrderEntry = <FormArray>(this.addPurchaseOrderForm.get("purchaseOrderEntryList"));
    purchaseOrderEntry.controls[rowIndex].get("ProductName").setValue(dataItem.ProductName);
    purchaseOrderEntry.controls[rowIndex].get("Unit").setValue(dataItem.Unit);
    purchaseOrderEntry.controls[rowIndex].get("PurchaseRate").setValue(dataItem.PurchaseRate);
    purchaseOrderEntry.controls[rowIndex].get("Amount").setValue(dataItem.Amount);
    purchaseOrderEntry.controls[rowIndex].get("NetAmount").setValue(dataItem.NetAmount);
    purchaseOrderEntry.controls[rowIndex].get("VAT").setValue(dataItem.VAT);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.addPurchaseOrderForm.get("purchaseOrderEntryList"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.addPurchaseOrderForm.get("purchaseOrderEntryList")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
