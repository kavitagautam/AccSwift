import { SalesOrderService } from "./../../services/sales-order.service";
import { FormArray } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'accSwift-edit-sales-order',
  templateUrl: './edit-sales-order.component.html',
  styleUrls: ['./edit-sales-order.component.scss']
})
export class EditSalesOrderComponent implements OnInit {
  editSalesOrderForm: FormGroup;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public salesOrderService: SalesOrderService
  ) { }

  ngOnInit() {
    this.buildEditSalesOrderForm();
    // this.getIdFromRoute();
  }

  buildEditSalesOrderForm() {
    this.editSalesOrderForm = this.fb.group({
      orderNo: [""],
      cashPartyACId: [0],
      remarks: [""],
      projectId: [0],
      date: [new Date()],
      salesOrderEntryList: this.fb.array([this.addSalesEntryList()])
    });
  }

  addSalesEntryList(): FormGroup {
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
      tcAmount: [""]
    });
  }

  // getIdFromRoute {
  //   this.route.paramMap.subscribe(params => {
  //     const param = params.get("id");
  //     if (param) {

  //     }
  //   });
  // }

  get getSalesOrderEntryList() {
    return this.editSalesOrderForm.get("salesOrderEntryList");
  }

  public save(): void {
    if (this.editSalesOrderForm.valid) {
      this.router.navigate(["/sales-order"]);
    }
  }

  public cancel(): void {
    this.editSalesOrderForm.reset();
    this.router.navigate(["/sales-order"]);
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const salesOrderEntry = <FormArray>(
      this.editSalesOrderForm.get("salesOrderEntryList")
    );
    if (salesOrderEntry.invalid) return;
    (<FormArray>this.editSalesOrderForm.get("salesOrderEntryList")).push(
      this.addSalesEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const salesOrderEntry = <FormArray>(
      this.editSalesOrderForm.get("salesOrderEntryList")
    );
    salesOrderEntry.controls[rowIndex].get("code").setValue(dataItem.code);
    salesOrderEntry.controls[rowIndex].get("productName")
      .setValue(dataItem.productName);
    salesOrderEntry.controls[rowIndex].get("quantity")
      .setValue(dataItem.quantity);
    salesOrderEntry.controls[rowIndex].get("unit").setValue(dataItem.unit);
    salesOrderEntry.controls[rowIndex].get("purchaseRate")
      .setValue(dataItem.purchaseRate);
    salesOrderEntry.controls[rowIndex].get("amount").setValue(dataItem.amount);
    salesOrderEntry.controls[rowIndex].get("specialDiscount")
      .setValue(dataItem.specialDiscount);
    salesOrderEntry.controls[rowIndex].get("specialDiscounts")
      .setValue(dataItem.specialDiscounts);
    salesOrderEntry.controls[rowIndex].get("vat").setValue(dataItem.vat);
    salesOrderEntry.controls[rowIndex].get("customDuty")
      .setValue(dataItem.customDuty);
    salesOrderEntry.controls[rowIndex].get("freight")
      .setValue(dataItem.freight);
    salesOrderEntry.controls[rowIndex].get("tc").setValue(dataItem.tc);
    salesOrderEntry.controls[rowIndex].get("tcAmount")
      .setValue(dataItem.tcAmount);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editSalesOrderForm.get("salesOrderEntryList")
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.editSalesOrderForm.get("salesOrderEntryList")).removeAt(
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
