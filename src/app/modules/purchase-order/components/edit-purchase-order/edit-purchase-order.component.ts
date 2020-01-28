import { FormArray, Validators } from "@angular/forms";
import { PurchaseOrderService } from "./../../services/purchase-order.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";

import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-edit-purchase-order",
  templateUrl: "./edit-purchase-order.component.html",
  styleUrls: ["./edit-purchase-order.component.scss"]
})
export class EditPurchaseOrderComponent implements OnInit {
  editPurchaseOrderForm: FormGroup;
  purchaseOrderDetails; //purchaseOrderDetails: PurchaseOrderMaster
  date: Date = new Date();
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public purchaseOrderService: PurchaseOrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.buildEditPurchaseOrderForm();
    this.getIdFromRoute();
  }

  buildEditPurchaseOrderForm() {
    this.editPurchaseOrderForm = this.fb.group({
      orderNo: ["", [Validators.required]],
      date: [new Date()],
      cashPartyACId: [null, [Validators.required]],
      projectId: [null],
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
      VAT: [""]
    });
  }

  getIdFromRoute() {
    this.route.paramMap.subscribe(params => {
      const param = +params.get("id");
      if (param) {
        this.purchaseOrderService
          .getPurchaseOrderDetails(param)
          .subscribe(res => {
            this.purchaseOrderDetails = res;
            this.buildEditPurchaseOrderForm();
          });
      }
    });
  }

  get getPurchaseOrderEntryList(): FormArray {
    return <FormArray>this.editPurchaseOrderForm.get("purchaseOrderEntryList");
  }

  public save(): void {
    if (this.editPurchaseOrderForm.valid) {
      this.router.navigate(["/purchase-order"]);
    }
  }

  public cancel(): void {
    this.editPurchaseOrderForm.reset();
    this.router.navigate(["/purchase-order"]);
  }

  //Date String Parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  };

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    //this.formGroup = undefined
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const purchaseOrderEntry = <FormArray>(
      this.editPurchaseOrderForm.get("purchaseOrderEntryList")
    );
    if (purchaseOrderEntry.invalid) return;
    (<FormArray>purchaseOrderEntry).push(this.addPurchaseOrderEntryList());
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const purchaseOrderEntry = <FormArray>(
      this.editPurchaseOrderForm.get("purchaseOrderEntryList")
    );
    purchaseOrderEntry.controls[rowIndex]
      .get("ProductName")
      .setValue(dataItem.ProductName);
    purchaseOrderEntry.controls[rowIndex].get("Unit").setValue(dataItem.Unit);
    purchaseOrderEntry.controls[rowIndex]
      .get("PurchaseRate")
      .setValue(dataItem.PurchaseRate);
    purchaseOrderEntry.controls[rowIndex]
      .get("Amount")
      .setValue(dataItem.Amount);
    purchaseOrderEntry.controls[rowIndex]
      .get("NetAmount")
      .setValue(dataItem.NetAmount);
    purchaseOrderEntry.controls[rowIndex].get("VAT").setValue(dataItem.VAT);
    this.editedRowIndex = rowIndex;
    sender.editRow(
      rowIndex,
      this.editPurchaseOrderForm.get("purchaseOrderEntryList")
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>(
      this.editPurchaseOrderForm.get("purchaseOrderEntryList")
    )).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
