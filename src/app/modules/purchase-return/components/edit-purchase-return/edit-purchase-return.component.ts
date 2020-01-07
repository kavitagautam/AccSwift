import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { PurchaseReturnService } from './../../services/purchase-return.service';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-purchase-return',
  templateUrl: './edit-purchase-return.component.html',
  styleUrls: ['./edit-purchase-return.component.scss']
})
export class EditPurchaseReturnComponent implements OnInit {
  editPurchaseReturnForm: FormGroup;
  date: Date = new Date();
  purchaseReturnDetails;   //purchaseReturnDetails: PurchaseReturnMaster
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(private fb: FormBuilder,
    private editPurRetService: PurchaseReturnService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildEditPurchaseReturnForm(); //initialializing the form
    this.getRouteFromParam();
  }

  buildEditPurchaseReturnForm() {
    this.editPurchaseReturnForm = this.fb.group({
      seriesId: [0],
      voucher: [""],
      date: [new Date()],
      cashPartyACId: [0],
      depotLocationId: [0],
      orderNo: [""],
      purchaseACId: [0],
      projectId: [0],
      remarks: [""],
      purchaseReturnEntryList: this.fb.array([this.editPurchaseReturnFormGroup()])
    })
  }

  editPurchaseReturnFormGroup() {
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
    return <FormArray>this.editPurchaseReturnForm.get("purchaseReturnEntryList");
  }

  getRouteFromParam() {
    this.route.paramMap.subscribe(params => {
      const param = params.get('id');
      if (param) {
        this.editPurRetService.getPurchaseOrderDetails(param).subscribe(res => {
          this.purchaseReturnDetails = res;
          this.buildEditPurchaseReturnForm();
        })
      }
    })
  }

  //Date String Parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  }

  public save(): void {
    if (this.editPurchaseReturnForm.valid) {
      this.router.navigate(["/purchase-return"]);
    }
  }

  public cancel(): void {
    this.editPurchaseReturnForm.reset();
    this.router.navigate(["/purchase-return"]);
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
    const purchaseReturnEntry = <FormArray>(this.editPurchaseReturnForm.get("purchaseReturnEntryList"));
    if (purchaseReturnEntry.invalid) return;
    (<FormArray>purchaseReturnEntry).push(this.editPurchaseReturnFormGroup());
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const purchaseReturnEntry = <FormArray>(this.editPurchaseReturnForm.get("purchaseReturnEntryList"));
    purchaseReturnEntry.controls[rowIndex].get("ProductName").setValue(dataItem.ProductName);
    purchaseReturnEntry.controls[rowIndex].get("Unit").setValue(dataItem.Unit);
    purchaseReturnEntry.controls[rowIndex].get("PurchaseRate").setValue(dataItem.PurchaseRate);
    purchaseReturnEntry.controls[rowIndex].get("Amount").setValue(dataItem.Amount);
    purchaseReturnEntry.controls[rowIndex].get("NetAmount").setValue(dataItem.NetAmount);
    purchaseReturnEntry.controls[rowIndex].get("VAT").setValue(dataItem.VAT);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.editPurchaseReturnForm.get("purchaseReturnEntryList"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.editPurchaseReturnForm.get("purchaseReturnEntryList")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
