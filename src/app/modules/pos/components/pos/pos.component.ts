import { ProductOrGroup } from "@accSwift-modules/pos/models/pos.model";
import { PosService } from "@accSwift-modules/pos/services/pos.service";
import { Preferences } from "@accSwift-modules/preference/models/preference.model";
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
  preferenceList: Preferences;
  quantityNo: number;
  salesRate: number;
  selectedRow: number = null;
  productList: any = [];
  totalQty: number = 0;
  totalAmount: number = 0;
  accoutNumber: any;
  cashAmount: number;
  discountAmount: number = 0;
  discountItem: number = 0;
  discountPercItem: number = 0;
  tenderAmount: number = 0;
  changeAmount: number = 0;
  totalNetAmount: number = 0;
  grandTotalAmount: number = 0;
  taxAmount: number = 0;
  modalRef: BsModalRef;
  seriesID: number;
  projectID: number;
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
  ) {
    this.preferenceService.getPreferenceData().subscribe((response) => {
      this.preferenceList = response.Entity;
    });
  }

  ngOnInit() {
    this.getProductGroup();
    this.getFavouriteProductGroup();
    this.projectID = this.preferenceService.preferences
      ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
      : null;
    this.seriesID = this.preferenceService.preferences
      ? this.preferenceService.preferences.DEFAULT_SERIES_SALES.ID
      : null;
    console.log("Project ID" + this.projectID + "Series ID " + this.seriesID);
  }

  getProductGroup(): void {
    this.posServices.getProductOrGroup(0).subscribe((response) => {
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
    this.salesRate = product.SalesRate;
    this.selectedRow = i;
  }

  quantityChange(): void {
    if (this.selectedRow !== null) {
      const obj = {
        ProductName: this.productList[this.selectedRow].ProductName,
        Quantity: this.quantityNo,
        Amount: this.productList[this.selectedRow].SalesRate * this.quantityNo,
        SalesRate: this.productList[this.selectedRow].SalesRate,
        ID: this.productList[this.selectedRow].ID,
        ProductID: this.productList[this.selectedRow].ProductID,
        QtyUnitID: this.productList[this.selectedRow].QtyUnitID,
        TaxAmount:
          this.productList[this.selectedRow].SalesRate *
          this.quantityNo *
          (this.productList[this.selectedRow].TaxRate / 100),
        TaxRate: this.productList[this.selectedRow].TaxRate,
      };
      this.productList[this.selectedRow] = obj;
    }
    this.calculateTotal(this.productList);
  }

  rateChange(): void {
    if (this.selectedRow !== null) {
      const obj = {
        ProductName: this.productList[this.selectedRow].ProductName,
        Quantity: this.quantityNo,
        Amount: this.salesRate * this.quantityNo,
        SalesRate: this.salesRate,
        ID: this.productList[this.selectedRow].ID,
        ProductID: this.productList[this.selectedRow].ProductID,
        QtyUnitID: this.productList[this.selectedRow].QtyUnitID,
        TaxAmount:
          this.salesRate *
          this.quantityNo *
          (this.productList[this.selectedRow].TaxRate / 100),
        NetAmount: this.salesRate * this.quantityNo - this.discountPercItem,
        TaxRate: this.productList[this.selectedRow].TaxRate,
      };
      this.productList[this.selectedRow] = obj;
    }
    this.calculateTotal(this.productList);
  }

  discountChange(): void {
    if (this.selectedRow !== null) {
      const obj = {
        ProductName: this.productList[this.selectedRow].ProductName,
        Quantity: this.quantityNo,
        Amount: this.salesRate * this.quantityNo,
        SalesRate: this.salesRate,
        ID: this.productList[this.selectedRow].ID,
        ProductID: this.productList[this.selectedRow].ProductID,
        QtyUnitID: this.productList[this.selectedRow].QtyUnitID,
        TaxAmount:
          this.salesRate *
          this.quantityNo *
          (this.productList[this.selectedRow].TaxRate / 100),
        DiscountAmount: this.discountItem,
        NetAmount: this.salesRate * this.quantityNo - this.discountPercItem,
        DiscPercentage:
          (this.discountItem / this.productList[this.selectedRow].Amount) * 100,
        TaxRate: this.productList[this.selectedRow].TaxRate,
      };
      this.discountPercItem =
        (this.discountItem / this.productList[this.selectedRow].Amount) * 100;
      this.productList[this.selectedRow] = obj;
    }

    this.calculateTotal(this.productList);
  }

  discountPerChange(): void {
    if (this.selectedRow !== null) {
      const obj = {
        ProductName: this.productList[this.selectedRow].ProductName,
        Quantity: this.quantityNo,
        Amount: this.salesRate * this.quantityNo,
        SalesRate: this.salesRate,
        ID: this.productList[this.selectedRow].ID,
        ProductID: this.productList[this.selectedRow].ProductID,
        QtyUnitID: this.productList[this.selectedRow].QtyUnitID,
        TaxAmount:
          this.salesRate *
          this.quantityNo *
          (this.productList[this.selectedRow].TaxRate / 100),
        DiscountAmount:
          (this.discountPercItem / 100) *
          this.productList[this.selectedRow].Amount,
        DiscPercentage: this.discountItem,
        NetAmount: this.salesRate * this.quantityNo - this.discountPercItem,
        TaxRate: this.productList[this.selectedRow].TaxRate,
      };
      this.productList[this.selectedRow] = obj;
    }
    this.calculateTotal(this.productList);
    this.discountItem =
      (this.discountPercItem / 100) * this.productList[this.selectedRow].Amount;
  }

  calculateTotal(item): void {
    let totalQty = 0;
    let totalAmount = 0;
    let taxAmount = 0;
    let discAmount = 0;
    let sumNetAmount = 0;
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
      if (item[i].NetAmount) {
        sumNetAmount = sumNetAmount + item[i].NetAmount;
      }
      if (item[i].DiscountAmount) {
        discAmount = discAmount + item[i].DiscountAmount;
      }
    }
    this.totalQty = totalQty;
    this.totalAmount = totalAmount;
    this.taxAmount = taxAmount;
    this.totalNetAmount = sumNetAmount;
    this.discountAmount = discAmount;
    this.grandTotalAmount = taxAmount + this.totalAmount;
  }

  deleteProduct(index): void {
    this.productList.splice(index, 1);
    this.calculateTotal(this.productList);
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
        selectedProduct[0].NetAmount =
          selectedProduct[0].Quantity * selectedProduct[0].SalesRate -
          this.discountItem;
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
          NetAmount:
            product.SalesRate * this.quantityNo - this.discountPercItem,
          TaxAmount:
            product.SalesRate * this.quantityNo * (product.TaxRate / 100),
          DiscountAmount: this.discountAmount,
          DiscPercentage: this.discountPercItem,
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
      SeriesID: this.preferenceList
        ? this.preferenceList.DEFAULT_SERIES_SALES.Value
        : null,

      CashPartyLedgerID: this.preferenceList
        ? this.preferenceList.DEFAULT_CASH_ACCOUNT.Value
        : null,
      SalesLedgerID: this.preferenceList
        ? this.preferenceList.DEFAULT_SALES_ACCOUNT.Value
        : null,

      DepotID: this.preferenceList
        ? this.preferenceList.DEFAULT_DEPOT.Value
        : null,

      ProjectID: this.preferenceList
        ? this.preferenceList.DEFAULT_PROJECT.Value
        : null,

      InvoiceDetails: this.productList,
      GrossAmount: this.totalAmount,
      SpecialDiscount: this.discountAmount,
      NetAmount: this.totalAmount - this.discountAmount,
      TotalTCAmount: this.taxAmount,
      Date: new Date(),
    };

    // console.log("Comment" + JSON.stringify(obj));
    this.posServices.addSalesInvoice(obj).subscribe((response) => {
      console.log("response" + JSON.stringify(response));
      this.posServices.getPDF(response.Entity.ID).subscribe(
        (response) => {
          var newBlob = new Blob([response], { type: "application/pdf" });
          console.log("response " + JSON.stringify(response));
          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
          }

          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const data = window.URL.createObjectURL(newBlob);

          var link = document.createElement("a");
          link.href = data;
          link.download = "Je kar.pdf";
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );

          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Invoice added successfully");
        }
      );
      // setTimeout(() => {
      //   window.location.reload();
      // }, 300);
    });
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

  clearAll(): void {
    this.productList = [];
    this.quantityNo = null;
    this.salesRate = null;
    this.selectedRow = null;
    this.grandTotalAmount = 0;
    this.totalAmount = 0;
  }
}
