import { Router } from "@angular/router";
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { SalesOrderService } from "../../services/sales-order.service";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProductModalPopupComponent } from "@app/modules/accswift-shared/components/product-modal-popup/product-modal-popup.component";
import { ProductCodeValidatorsService } from "@app/modules/accswift-shared/validators/async-validators/product-code-validators/product-code-validators.service";
import { CashPartyModalPopupComponent } from "@app/modules/accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";
import { PreferenceService } from "../../../preference/services/preference.service";
import { CashParty } from "@app/modules/accswift-shared/models/cash-party.model";

@Component({
  selector: "accSwift-add-sales-order",
  templateUrl: "../common-html/sales-order.html",
  styleUrls: ["./add-sales-order.component.scss"],
})
export class AddSalesOrderComponent implements OnInit {
  salesOrderForm: FormGroup;
  editedRowIndex: any;
  submitted: boolean;
  IsAutomatic: boolean;
  rowSubmitted: boolean;
  cashPartyList: CashParty[] = [];
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
    public salesOrderService: SalesOrderService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public productCodeMatch: ProductCodeValidatorsService,
    private preferenceService: PreferenceService
  ) {
    this.salesOrderService.getCashPartyAccountDD().subscribe((response) => {
      this.cashPartyList = response.Entity;
    });
  }

  ngOnInit(): void {
    this.buildSalesOrderForm();
  }

  buildSalesOrderForm(): void {
    this.salesOrderForm = this._fb.group({
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_SLS_ORDER.Value
          : null,
      ],
      OrderNo: ["", [Validators.required]],
      CashPartyLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
        [Validators.required],
      ],
      ProjectID: [null],
      Date: [new Date()],
      Remarks: [""],
      OrderDetails: this._fb.array([this.addSalesOrderEntryList()]),
    });
    this.seriesValueChange();
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

  seriesValueChange(): void {
    const seriesChange = this.salesOrderForm.get("SeriesID").value;
    if (seriesChange) {
      this.salesOrderService
        .getVoucherNoWithSeriesChange(seriesChange)
        .subscribe((response) => {
          this.salesOrderForm.get("OrderNo").setValue(response.VoucherNO);
          if (response.IsEnabled) {
            this.salesOrderForm.get("OrderNo").enable();
          } else {
            this.salesOrderForm.get("OrderNo").disable();
          }
          if (response.VoucherNoType === "Automatic") {
            this.IsAutomatic = true;
          }
        });
    }
  }

  //Quantity Column value changes
  changeQuantityValues(index): void {
    const oederEntryList = <FormArray>this.salesOrderForm.get("OrderDetails");
    let qunatityValue = oederEntryList.controls[index].get("Quantity").value;
    let salesRateValue = oederEntryList.controls[index].get("SalesRate").value;
    let amountC = qunatityValue * salesRateValue;
    oederEntryList.controls[index].get("Amount").setValue(amountC);
  }

  handelProductCode(index): void {
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

  // Filterable Cash Party Drop-down
  cashPartyDDFilter(value): void {
    this.cashPartyList = this.salesOrderService.cashPartyList.filter(
      (s) => s.LedgerName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  openCashPartyModel(): void {
    this.modalRef = this.modalService.show(
      CashPartyModalPopupComponent,
      this.config
    );
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        // Do After the the sucess
        this.salesOrderForm.get("CashPartyLedgerID").setValue(data.LedgerID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
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
