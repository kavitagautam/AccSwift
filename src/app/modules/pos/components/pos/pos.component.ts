import { ProductOrGroup } from "@accSwift-modules/pos/models/pos.model";
import { PosService } from "@accSwift-modules/pos/services/pos.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

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
  totalQty: number;
  totalAmount: number;
  accoutNumber: any;
  cashAmount: number;
  discountAmount: number;
  tenderAmount: number;
  changeAmount: number;
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };

  constructor(
    private posServices: PosService,
    private modalService: BsModalService
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
        Title: this.productList[this.selectedRow].Title,
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

    for (let i = 0; i < item.length; i++) {
      if (item[i].Quantity) {
        totalQty = totalQty + item[i].Quantity;
      }
      if (item[i].Amount) {
        totalAmount = totalAmount + item[i].Amount;
      }
    }
    this.totalQty = totalQty;
    this.totalAmount = totalAmount;
  }

  deleteProduct(index): void {
    this.productList.splice(index, 1);
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
      } else {
        const obj = {
          ID: product.ID,
          Title: product.Title,
          Quantity: this.quantityNo,
          Amount: product.SalesRate * this.quantityNo,
          SalesRate: product.SalesRate,
        };
        this.productList.push(obj);
      }
      this.calculateTotal(this.productList);
    }
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
