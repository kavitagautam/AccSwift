import { SalesOrderService } from "./../../services/sales-order.service";
import { FormArray, Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { SalesOrderDetail } from "../../models/sales-order.model";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProductModalPopupComponent } from "@app/shared/components/product-modal-popup/product-modal-popup.component";
import { ProductCodeValidatorsService } from "@app/shared/validators/async-validators/product-code-validators/product-code-validators.service";

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
  salesOrderDetail: SalesOrderDetail;

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
      Quantity: [""],
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
            SalesRate: [element.SalesOrderID],
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
          Quantity: [""],
          SalesRate: [""],
          Amount: [""],
          UpdatedQuantity: [0],
          PenndingQuantity: [0],
        })
      );
    }
    return orderFormArray;
  }

  handelProductCode(dataItem, index): void {
    const oederEntryList = <FormArray>this.salesOrderForm.get("OrderDetails");

    const productCode = oederEntryList.controls[index].get("ProductCode").value;
    if (oederEntryList.controls[index].get("ProductCode").status === "VALID") {
      this.productCodeMatch.checkProductCode(productCode).subscribe((res) => {
        const selectedItem = res.Entity;
        if (selectedItem && selectedItem.length > 0) {
          oederEntryList.controls[index]
            .get("ProductCode")
            .setValue(selectedItem[0].Code);
          oederEntryList.controls[index]
            .get("ProductID")
            .setValue(selectedItem[0].ID);
          oederEntryList.controls[index]
            .get("ProductName")
            .setValue(selectedItem[0].Name);
          oederEntryList.controls[index].get("Quantity").setValue(1);

          oederEntryList.controls[index]
            .get("SalesRate")
            .setValue(selectedItem[0].SalesRate);

          oederEntryList.controls[index]
            .get("Amount")
            .setValue(
              selectedItem[0].SalesRate *
                oederEntryList.controls[index].get("Quantity").value
            );
        }
        (<FormArray>this.salesOrderForm.get("OrderDetails")).push(
          this.addSalesOrderEntryList()
        );
      });
    }
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      ProductModalPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        const oederEntryList = <FormArray>(
          this.salesOrderForm.get("OrderDetails")
        );
        oederEntryList.controls[index].get("ProductCode").setValue(data.Code);
        oederEntryList.controls[index].get("ProductID").setValue(data.ID);
        oederEntryList.controls[index].get("ProductName").setValue(data.Name);
        oederEntryList.controls[index].get("Quantity").setValue(1);

        oederEntryList.controls[index]
          .get("SalesRate")
          .setValue(data.SalesRate);
        oederEntryList.controls[index]
          .get("Amount")
          .setValue(
            data.SalesRate *
              oederEntryList.controls[index].get("Quantity").value
          );
        oederEntryList.controls[index].get("UpdatedQuantity").setValue(0);
        oederEntryList.controls[index].get("PenndingQuantity").setValue(0);
      }

      (<FormArray>this.salesOrderForm.get("OrderDetails")).push(
        this.addSalesOrderEntryList()
      );
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  public save(): void {
    if (this.salesOrderForm.invalid) return;
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
          this.toastr.success("Sales Order added successfully");
        }
      );
  }

  public cancel(): void {
    this.salesOrderForm.reset();
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
    const salesOrderEntry = <FormArray>this.salesOrderForm.get("OrderDetails");
    if (salesOrderEntry.invalid) return;
    (<FormArray>this.salesOrderForm.get("OrderDetails")).push(
      this.addSalesOrderEntryList()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const salesOrderEntry = <FormArray>this.salesOrderForm.get("OrderDetails");
    salesOrderEntry.controls[rowIndex]
      .get("ProductCode")
      .setValue(dataItem.ProductCode);
    salesOrderEntry.controls[rowIndex]
      .get("ProductName")
      .setValue(dataItem.ProductName);
    salesOrderEntry.controls[rowIndex]
      .get("Quantity")
      .setValue(dataItem.Quantity);
    salesOrderEntry.controls[rowIndex]
      .get("SalesRate")
      .setValue(dataItem.SalesRate);
    salesOrderEntry.controls[rowIndex].get("Amount").setValue(dataItem.Amount);
    salesOrderEntry.controls[rowIndex]
      .get("UpdatedQuantity")
      .setValue(dataItem.UpdatedQuantity);
    salesOrderEntry.controls[rowIndex]
      .get("specialDiscounts")
      .setValue(dataItem.specialDiscounts);
    salesOrderEntry.controls[rowIndex]
      .get("PenndingQuantity")
      .setValue(dataItem.PenndingQuantity);

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.salesOrderForm.get("OrderDetails"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.salesOrderForm.get("OrderDetails")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
