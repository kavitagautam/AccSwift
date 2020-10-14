import { ProductOrGroup } from "@accSwift-modules/pos/models/pos.model";
import { PosService } from "@accSwift-modules/pos/services/pos.service";
import { PreferenceService } from "@accSwift-modules/preference/services/preference.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-pos",
  templateUrl: "./pos.component.html",
  styleUrls: ["./pos.component.scss"],
})
export class PosComponent implements OnInit {
  productOrGroupList: ProductOrGroup[] = [];
  favProductOrGroupList: ProductOrGroup[] = [];
  private editedRowIndex: number;
  quantityNo: number;
  selectedRow: number = null;
  productList: any = [];
  totalQty: number = 0;
  totalAmount: number = 0;
  accoutNumber: any;
  cashAmount: number;
  discountAmount: number = 0;
  tenderAmount: number = 0;
  changeAmount: number = 0;
  grandTotalAmount: number = 0;
  taxAmount: number = 0;
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    public posServices: PosService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private preferenceService: PreferenceService
  ) {}

  ngOnInit() {
    this.getProductGroup();
    this.getFavouriteProductGroup();
  }

  getProductGroup(): void {
    this.posServices.getProductOrGroup(null).subscribe((response) => {
      this.productOrGroupList = response.Entity;
    });
  }
  getFavouriteProductGroup(): void {
    this.posServices.getFavouriteItems().subscribe((response) => {
      this.favProductOrGroupList = response.Entity;
    });
  }

  selectProduct(i, product): void {
    this.quantityNo = product.Quantity;
    this.selectedRow = i;
  }

  quantityChange(): void {
    if (this.selectedRow !== null) {
      const obj = {
        ProductName: this.productList[this.selectedRow].ProductName,
        Quantity: this.quantityNo,
        Amount: this.productList[this.selectedRow].SalesRate * this.quantityNo,
        SalesRate: this.productList[this.selectedRow].SalesRate,
      };
      this.productList[this.selectedRow] = obj;
    }
    this.calculateTotal(this.productList);
  }

  calculateTotal(item): void {
    let totalQty = 0;
    let totalAmount = 0;
    let taxAmount = 0;
    for (let i = 0; i < item.length; i++) {
      if (item[i].Quantity) {
        totalQty = totalQty + item[i].Quantity;
      }
      if (item[i].Amount) {
        totalAmount = totalAmount + item[i].Amount;
      }
      if (item[i].TaxAmount) {
        taxAmount = taxAmount + item[i].TaxAmount;
      }
    }
    this.totalQty = totalQty;
    this.totalAmount = totalAmount;
    this.taxAmount = taxAmount;
    this.grandTotalAmount = taxAmount + this.totalAmount;
  }

  deleteProduct(index): void {
    this.productList.splice(index, 1);
  }

  discountAmountChange(): void {
    this.grandTotalAmount = this.grandTotalAmount - this.discountAmount;
  }

  productClick(product): void {
    if (product.TypeOf == 0) {
      this.posServices.getProductOrGroup(product.ID).subscribe((response) => {
        this.productOrGroupList = response.Entity;
      });
    }
    if (product.TypeOf == 1) {
      this.quantityNo = 1;

      const selectedProduct = this.productList.filter(
        (s) => s.ID === product.ID
      );

      if (selectedProduct.length > 0) {
        selectedProduct[0].Quantity = selectedProduct[0].Quantity + 1;
        selectedProduct[0].Amount =
          selectedProduct[0].Quantity * selectedProduct[0].SalesRate;
        selectedProduct[0].TaxAmount =
          selectedProduct[0].Quantity *
          selectedProduct[0].SalesRate *
          (selectedProduct[0].TaxRate / 100);
      } else {
        const obj = {
          ID: product.ID,
          ProductName: product.Title,
          Quantity: this.quantityNo,
          Amount: product.SalesRate * this.quantityNo,
          QtyUnitID: product.QtyUnitID,
          ProductID: product.ID,
          TaxRate: product.TaxRate,
          TaxAmount:
            product.SalesRate * this.quantityNo * (product.TaxRate / 100),
          SalesRate: product.SalesRate,
        };
        this.productList.push(obj);
      }
      this.calculateTotal(this.productList);
    }
  }

  checkOut(): void {
    const obj = {
      TotalQty: this.totalQty,
      TotalAmount: this.grandTotalAmount,
      TenderAmount: this.tenderAmount,
      ChangeAmount: this.changeAmount,
      SeriesID: this.preferenceService.preferences
        ? this.preferenceService.preferences.DEFAULT_SERIES_SALES.Value
        : null,

      CashPartyLedgerID: this.preferenceService.preferences
        ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
        : null,
      SalesLedgerID: this.preferenceService.preferences
        ? this.preferenceService.preferences.DEFAULT_SALES_ACCOUNT.Value
        : null,

      DepotID: this.preferenceService.preferences
        ? this.preferenceService.preferences.DEFAULT_DEPOT.Value
        : null,

      ProjectID: this.preferenceService.preferences
        ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
        : null,

      InvoiceDetails: this.productList,
      GrossAmount: this.totalAmount,
      SpecialDiscount: this.discountAmount,
      NetAmount: this.grandTotalAmount - this.discountAmount,
      TotalTCAmount: this.taxAmount,
      Date: new Date(),
    };
    this.posServices.addSalesInvoice(obj).subscribe(
      (response) => {},
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Invoice added successfully");
      }
    );
  }

  openCommit(template: TemplateRef<any>): void {
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      centered: true,
      class: "modal-md",
    };
    this.modalRef = this.modalService.show(template, config);
  }
}
