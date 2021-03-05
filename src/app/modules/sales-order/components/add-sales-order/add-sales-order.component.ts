import { Router } from "@angular/router";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { SalesOrderService } from "../../services/sales-order.service";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { takeUntil, debounceTime } from "rxjs/operators";
import { ProductCodeValidatorsService } from "@accSwift-modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { PreferenceService } from "../../../preference/services/preference.service";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-add-sales-order",
  templateUrl: "../common-html/sales-order.html",
  styleUrls: ["../common-html/sales-order.component.scss"]
})
export class AddSalesOrderComponent implements OnInit {
  salesOrderForm: FormGroup;
  editedRowIndex: any;
  submitted: boolean;
  IsAutomatic: boolean;
  rowSubmitted: boolean;
  modalRef: BsModalRef;
  totalAmount: number = 0;
  totalQty: number = 0;
  grandTotalAmount: number = 0;
  myFormValueChanges$;
  private destroyed$ = new Subject<void>();

  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    public salesOrderService: SalesOrderService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public productCodeMatch: ProductCodeValidatorsService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit(): void {
    this.buildSalesOrderForm();
    this.myFormValueChanges$ = this.salesOrderForm.controls[
      "OrderDetails"
    ].valueChanges;

    this.myFormValueChanges$.subscribe((changes) =>
      this.orderValueChange(changes)
    );
  }

  ngOnDestroy(): void {
    this.myFormValueChanges$.unsubscribe();
  }


  buildSalesOrderForm(): void {
    this.salesOrderForm = this._fb.group({
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences. DEFAULT_SERIES_SLS_ORDER.Value
          : null,
        Validators.required,
      ],
      OrderNo: [""],
      CashPartyLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
        [Validators.required],
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
      ],
      Date: [new Date()],
      Remarks: [""],
      TotalQty: [0, Validators.required],
      TotalAmount: [0, Validators.required],
      OrderDetails: this._fb.array([this.addSalesOrderEntryList()]),
    });
  }

  addSalesOrderEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      SalesOrderID: [0],
      ProductCode: [""],
      ProductID: [0],
      ProductName: [""],
      Quantity: [1],
      SalesRate: [""],
      Amount: [""],
      UpdatedQuantity: [0],
      PenndingQuantity: [0],
    });
  }

  get getSalesOrderEntryList(): FormArray {
    return <FormArray>this.salesOrderForm.get("OrderDetails");
  }

  
  private orderValueChange(value): void {
    this.salesOrderForm.controls["OrderDetails"].valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(20))
      .subscribe((invoices) => {
        let sumQty = 0;
        let sumAmount = 0;

        for (let i = 0; i < invoices.length; i++) {
          if (invoices && invoices[i].Quantity) {
            sumQty = sumQty + invoices[i].Quantity;
          }
          if (invoices && invoices[i].Amount) {
            sumAmount = sumAmount + invoices[i].Amount;
          }
        }

        this.totalQty = sumQty;
        this.totalAmount = sumAmount;
        this.grandTotalAmount = this.totalAmount;
      });
  }

  public save(): void {
    // if (this.salesOrderForm.invalid) return;
    this.salesOrderForm.get("TotalQty").setValue(this.totalQty);
    this.salesOrderForm.get("TotalAmount").setValue(this.grandTotalAmount);
    this.salesOrderService.addSalesOrder(this.salesOrderForm.value).subscribe(
      (response) => {
        this.router.navigate(["/sales-order"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Sales Order added successfully");
      }
    );
  }

  public cancel(): void {
    this.salesOrderForm.reset();
    this.router.navigate(["/sales-order"]);
  }
}
