import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { SalesReturnService } from "./../../services/sales-return.service";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-edit-sales-return",
  templateUrl: "./edit-sales-return.component.html",
  styleUrls: ["./edit-sales-return.component.scss"]
})
export class EditSalesReturnComponent implements OnInit {
  editSalesReturnForm: FormGroup;
  salesReturnDetails: any;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(
    private _fb: FormBuilder,
    public editSalesRetService: SalesReturnService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildEditSalesReturnForm(); //Initialize the form
    this.getRouteFromParam();
  }

  buildEditSalesReturnForm() {
    this.editSalesReturnForm = this._fb.group({
      seriesId: [0],
      cashPartyACId: [0],
      salesACId: [0],
      depotLocationId: [0],
      projectId: [0],
      date: [new Date()],
      orderNo: [""],
      remarks: [""],
      salesReturnEntryList: this._fb.array([this.editSalesReturnFormGroup()])
    })
  }

  editSalesReturnFormGroup(): FormGroup {
    return this._fb.group({
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
      tcAmount: [""]
    })
  }

  get getSalesReturnEntryList() {
    return this.editSalesReturnForm.get("salesReturnEntryList");
  }

  getRouteFromParam() {
    this.route.paramMap.subscribe(params => {
      const param = params.get('id');
      if (param) {
        this.editSalesRetService.getSalesReturnDetails(param).subscribe(res => {
          this.salesReturnDetails = res;
          this.buildEditSalesReturnForm();
        })
      }
    })
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
    const salesReturnEntry = <FormArray>(this.editSalesReturnForm.get("salesReturnEntryList"));
    if (salesReturnEntry.invalid) return;
    (<FormArray>salesReturnEntry).push(this.editSalesReturnFormGroup());
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const salesReturnEntry = <FormArray>(this.editSalesReturnForm.get("salesReturnEntryList"));
    salesReturnEntry.controls[rowIndex].get("ProductName").setValue(dataItem.ProductName);
    salesReturnEntry.controls[rowIndex].get("Unit").setValue(dataItem.Unit);
    salesReturnEntry.controls[rowIndex].get("PurchaseRate").setValue(dataItem.PurchaseRate);
    salesReturnEntry.controls[rowIndex].get("Amount").setValue(dataItem.Amount);
    salesReturnEntry.controls[rowIndex].get("NetAmount").setValue(dataItem.NetAmount);
    salesReturnEntry.controls[rowIndex].get("VAT").setValue(dataItem.VAT);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.editSalesReturnForm.get("salesReturnEntryList"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.editSalesReturnForm.get("salesReturnEntryList")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
