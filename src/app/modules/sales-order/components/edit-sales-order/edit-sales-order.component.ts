import { SalesOrderService } from "./../../services/sales-order.service";
import { FormArray, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { SalesOrder } from "../../models/sales-order.model";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProductModalPopupComponent } from "@accSwift-modules/accswift-shared/components/product-modal-popup/product-modal-popup.component";
import { ProductCodeValidatorsService } from "@accSwift-modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { CashPartyModalPopupComponent } from "@accSwift-modules/accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";

@Component({
  selector: "accSwift-edit-sales-order",
  templateUrl: "../common-html/sales-order.html",
  styleUrls: ["./edit-sales-order.component.scss"],
})
export class EditSalesOrderComponent implements OnInit {
  salesOrderForm: FormGroup;
  editedRowIndex: any;
  submitted: boolean;
  rowSubmitted: boolean;
  IsAutomatic: boolean;
  salesOrderDetail: SalesOrder;

  modalRef: BsModalRef;
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
    private route: ActivatedRoute,
    public salesOrderService: SalesOrderService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public productCodeMatch: ProductCodeValidatorsService
  ) {}

  ngOnInit(): void {
    this.buildSalesOrderForm();
    this.getIdFromRoute();
  }

  buildSalesOrderForm(): void {
    this.salesOrderForm = this._fb.group({
      ID: [this.salesOrderDetail ? this.salesOrderDetail.ID : 0],
      SeriesID: [this.salesOrderDetail ? this.salesOrderDetail.SeriesID : null],
      OrderNo: [
        this.salesOrderDetail ? this.salesOrderDetail.OrderNo : "",
        [Validators.required],
      ],
      CashPartyLedgerID: [
        this.salesOrderDetail ? this.salesOrderDetail.CashPartyLedgerID : null,
        [Validators.required],
      ],
      ProjectID: [
        this.salesOrderDetail ? this.salesOrderDetail.ProjectID : null,
      ],
      Date: [this.salesOrderDetail ? new Date(this.salesOrderDetail.Date) : ""],
      Remarks: [this.salesOrderDetail ? this.salesOrderDetail.Remarks : ""],
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

  // Get id from route
  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if (param) {
        this.salesOrderService
          .getSalesOrderDetails(param)
          .subscribe((response) => {
            this.salesOrderDetail = response.Entity;
            this.buildSalesOrderForm();
            this.setOrderList();
          });
      }
    });
  }

  get getSalesOrderEntryList(): FormArray {
    return <FormArray>this.salesOrderForm.get("OrderDetails");
  }

  setOrderList(): void {
    this.salesOrderForm.setControl(
      "OrderDetails",
      this.setSalesOrderFormArray(this.salesOrderDetail.OrderDetails)
    );

    (<FormArray>this.salesOrderForm.get("OrderDetails")).push(
      this.addSalesOrderEntryList()
    );
  }

  // this block of code is used to show form array data in the template.....
  setSalesOrderFormArray(orderLists): FormArray {
    const orderFormArray = new FormArray([]);
    if (orderLists && orderLists.length > 0) {
      orderLists.forEach((element) => {
        orderFormArray.push(
          this._fb.group({
            ID: [element.ID],
            SalesOrderID: [element.SalesOrderID],
            ProductCode: [element.ProductCode],
            ProductID: [element.ProductID],
            ProductName: [element.ProductName],
            Quantity: [element.Quantity],
            SalesRate: [element.SalesRate],
            Amount: [element.Amount],
            UpdatedQuantity: [element.UpdatedQuantity],
            PenndingQuantity: [element.PenndingQuantity],
          })
        );
      });
    } else {
      orderFormArray.push(
        this._fb.group({
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
        })
      );
    }
    return orderFormArray;
  }

  public save(): void {
    //if (this.salesOrderForm.invalid) return;
    this.salesOrderService
      .updateSalesOrder(this.salesOrderForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/sales-order"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Sales Order edited successfully");
        }
      );
  }

  public cancel(): void {
    this.salesOrderForm.reset();
    this.router.navigate(["/sales-order"]);
  }
}
