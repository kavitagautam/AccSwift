import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PurchaseReturnService } from '../../services/purchase-return.service';

@Component({
  selector: 'app-add-purchase-return',
  templateUrl: './add-purchase-return.component.html',
  styleUrls: ['./add-purchase-return.component.scss']
})
export class AddPurchaseReturnComponent implements OnInit {
  addPurchaseReturnForm: FormGroup;
  date: Date = new Date();
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(public addPurRetService: PurchaseReturnService,
    private fb: FormBuilder, private router: Router
  ) { }

  ngOnInit() {
    this.buildaddPurchaseReturnForm();
  }

  buildaddPurchaseReturnForm() {
    this.addPurchaseReturnForm = this.fb.group({
      series: [""],
      voucher: [""],
      date: [new Date()],
      cashParty: [""],
      depot: [""],
      order: [""],
      purchase: [""],
      project: [""],
      remarks: [""],
      purchaseReturnEntryList: this.fb.array([this.addPurchaseReturnFormGroup()])
    })
  }

  addPurchaseReturnFormGroup() {
    return this.fb.group({
      ProductName: [""],
      Quantity: [""],
      Unit: [""],
      PurchaseRate: [""],
      Amount: [""],
      SpecialDiscount: [""],
      NetAmount: [""],
      VAT: [""]
    })
  }

  get getPurchaseReturnEntryList(): FormArray {
    return <FormArray>this.addPurchaseReturnForm.get("purchaseReturnEntryList");
  }

  public save(): void {
    if (this.addPurchaseReturnForm.valid) {
      this.router.navigate(["/purchase-return"]);
    }
  }

  public cancel(): void {
    this.addPurchaseReturnForm.reset();
    this.router.navigate(["/purchase-return"]);
  }


  //Date String Parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
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
    const purchaseReturnEntry = <FormArray>(this.addPurchaseReturnForm.get("purchaseReturnEntryList"));
    if (purchaseReturnEntry.invalid) return;
    (<FormArray>purchaseReturnEntry).push(this.addPurchaseReturnFormGroup());
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const purchaseReturnEntry = <FormArray>(this.addPurchaseReturnForm.get("purchaseReturnEntryList"));
    purchaseReturnEntry.controls[rowIndex].get("ProductName").setValue(dataItem.ProductName);
    purchaseReturnEntry.controls[rowIndex].get("Unit").setValue(dataItem.Unit);
    purchaseReturnEntry.controls[rowIndex].get("PurchaseRate").setValue(dataItem.PurchaseRate);
    purchaseReturnEntry.controls[rowIndex].get("Amount").setValue(dataItem.Amount);
    purchaseReturnEntry.controls[rowIndex].get("NetAmount").setValue(dataItem.NetAmount);
    purchaseReturnEntry.controls[rowIndex].get("VAT").setValue(dataItem.VAT);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.addPurchaseReturnForm.get("purchaseReturnEntryList"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.addPurchaseReturnForm.get("purchaseReturnEntryList")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
