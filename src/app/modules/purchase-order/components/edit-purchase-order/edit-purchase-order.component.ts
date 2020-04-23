import { FormArray, Validators } from "@angular/forms";
import { PurchaseOrderService } from "./../../services/purchase-order.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup } from "@angular/forms";

import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { PurchaseOrderDetail } from "../../models/purchase-order.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ProductCodeValidatorsService } from "@app/shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { ProductModalPopupComponent } from "@app/shared/components/product-modal-popup/product-modal-popup.component";

@Component({
  selector: "accSwift-edit-purchase-order",
  templateUrl: "../common-html/purchase-order.html",
  styleUrls: ["./edit-purchase-order.component.scss"],
})
export class EditPurchaseOrderComponent implements OnInit {
  purchaseOrderForm: FormGroup;
  purchaseOrderDetail: PurchaseOrderDetail;
  editedRowIndex: any;
  listLoading: boolean;

  submitted: boolean;
  rowSubmitted: boolean;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    public purchaseOrderService: PurchaseOrderService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public productCodeMatch: ProductCodeValidatorsService
  ) {}

  ngOnInit(): void {
    this.buildPurchaseOrderForm();
    this.getIdFromRoute();
  }

  buildPurchaseOrderForm(): void {
    this.purchaseOrderForm = this._fb.group({
      ID: [this.purchaseOrderDetail ? this.purchaseOrderDetail.ID : 0],
      OrderNo: [
        this.purchaseOrderDetail ? this.purchaseOrderDetail.OrderNo : "",
        [Validators.required],
      ],
      Date: [
        this.purchaseOrderDetail ? new Date(this.purchaseOrderDetail.Date) : "",
      ],
      CashPartyLedgerID: [
        this.purchaseOrderDetail
          ? this.purchaseOrderDetail.CashPartyLedgerID
          : null,
        [Validators.required],
      ],
      ProjectID: [
        this.purchaseOrderDetail ? this.purchaseOrderDetail.ProjectID : null,
      ],
      OrderDetails: this._fb.array([this.addPurchaseOrderEntryList()]),
    });
  }

  addPurchaseOrderEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      PurchaseOrderID: [0],
      ProductID: [""],
      ProductName: [""],
      ProductCode: [""],
      Quantity: [1],
      PurchaseRate: [""],
      Amount: [""],
      UpdatedQuantity: [0],
      PenndingQuantity: [0],
    });
  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = +params.get("id");
      if (param) {
        this.purchaseOrderService
          .getPurchaseOrderDetails(param)
          .subscribe((response) => {
            this.purchaseOrderDetail = response.Entity;
            this.buildPurchaseOrderForm();
            this.setOrderList();
          });
      }
    });
  }

  get getPurchaseOrderEntryList(): FormArray {
    return <FormArray>this.purchaseOrderForm.get("OrderDetails");
  }

  setOrderList(): void {
    this.listLoading = true;
    this.purchaseOrderForm.setControl(
      "OrderDetails",
      this.setPurchaseOrderFormArray(this.purchaseOrderDetail.OrderDetails)
    );

    (<FormArray>this.purchaseOrderForm.get("OrderDetails")).push(
      this.addPurchaseOrderEntryList()
    );
    this.listLoading = false;
  }

  // this block of code is used to show form array data in the template.....
  setPurchaseOrderFormArray(orderLists): FormArray {
    const orderFormArray = new FormArray([]);
    if (orderLists && orderLists.length > 0) {
      orderLists.forEach((element) => {
        orderFormArray.push(
          this._fb.group({
            ID: [element.ID],
            PurchaseOrderID: [element.PurchaseOrderID],
            ProductCode: [element.ProductCode],
            ProductID: [element.ProductID],
            ProductName: [element.ProductName],
            Quantity: [element.Quantity],
            PurchaseRate: [element.PurchaseRate],
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
          PurchaseOrderID: [0],
          ProductID: [""],
          ProductName: [""],
          ProductCode: [""],
          Quantity: [1],
          PurchaseRate: [""],
          Amount: [""],
          UpdatedQuantity: [0],
          PenndingQuantity: [0],
        })
      );
    }
    return orderFormArray;
  }

  //Quantity Column value changes
  changeQuantityValues(index): void {
    const oederEntryList = <FormArray>(
      this.purchaseOrderForm.get("OrderDetails")
    );
    let qunatityValue = oederEntryList.controls[index].get("Quantity").value;
    let purchaseRateValue = oederEntryList.controls[index].get("PurchaseRate")
      .value;
    let amountC = qunatityValue * purchaseRateValue;
    oederEntryList.controls[index].get("Amount").setValue(amountC);
  }

  handelProductCode(dataItem, index): void {
    const oederEntryList = <FormArray>(
      this.purchaseOrderForm.get("OrderDetails")
    );

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
            .get("PurchaseRate")
            .setValue(selectedItem[0].PurchaseRate);

          oederEntryList.controls[index]
            .get("Amount")
            .setValue(
              selectedItem[0].PurchaseRate *
                oederEntryList.controls[index].get("Quantity").value
            );
        }
        (<FormArray>this.purchaseOrderForm.get("OrderDetails")).push(
          this.addPurchaseOrderEntryList()
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
          this.purchaseOrderForm.get("OrderDetails")
        );
        oederEntryList.controls[index].get("ProductCode").setValue(data.Code);
        oederEntryList.controls[index].get("ProductID").setValue(data.ID);
        oederEntryList.controls[index].get("ProductName").setValue(data.Name);
        oederEntryList.controls[index].get("Quantity").setValue(1);

        oederEntryList.controls[index]
          .get("PurchaseRate")
          .setValue(data.PurchaseRate);
        oederEntryList.controls[index]
          .get("Amount")
          .setValue(
            data.PurchaseRate *
              oederEntryList.controls[index].get("Quantity").value
          );
        oederEntryList.controls[index].get("UpdatedQuantity").setValue(0);
        oederEntryList.controls[index].get("PenndingQuantity").setValue(0);
      }

      (<FormArray>this.purchaseOrderForm.get("OrderDetails")).push(
        this.addPurchaseOrderEntryList()
      );
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  public save(): void {
    if (this.purchaseOrderForm.invalid) return;
    this.purchaseOrderService
      .updatePurchaseOrder(this.purchaseOrderForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/purchase-order"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Purchase Order added successfully");
        }
      );
  }

  public cancel(): void {
    this.purchaseOrderForm.reset();
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
    const purchaseOrderEntry = <FormArray>(
      this.purchaseOrderForm.get("OrderDetails")
    );
    if (purchaseOrderEntry.invalid) return;
    (<FormArray>purchaseOrderEntry).push(this.addPurchaseOrderEntryList());
    this.submitted = false;
    this.rowSubmitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    const purchaseOrderEntry = <FormArray>(
      this.purchaseOrderForm.get("OrderDetails")
    );
    purchaseOrderEntry.controls[rowIndex]
      .get("ProductName")
      .setValue(dataItem.ProductName);
    purchaseOrderEntry.controls[rowIndex]
      .get("PurchaseRate")
      .setValue(dataItem.PurchaseRate);
    purchaseOrderEntry.controls[rowIndex]
      .get("Amount")
      .setValue(dataItem.Amount);
    purchaseOrderEntry.controls[rowIndex]
      .get("NetAmount")
      .setValue(dataItem.NetAmount);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.purchaseOrderForm.get("OrderDetails"));
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.purchaseOrderForm.get("OrderDetails")).removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
