import { Component, OnInit } from "@angular/core";
import { SortDescriptor } from "@progress/kendo-data-query";
import {
  PageChangeEvent,
  SelectAllCheckboxState,
} from "@progress/kendo-angular-grid";
import { BsModalRef } from "ngx-bootstrap";
import {
  ProductlistService,
  ProductList,
} from "@app/shared/services/product-list/productlist.service";
import { Subject } from "rxjs";

@Component({
  selector: "accSwift-product-modal-popup",
  templateUrl: "./product-modal-popup.component.html",
  styleUrls: ["./product-modal-popup.component.scss"],
})
export class ProductModalPopupComponent implements OnInit {
  public onClose: Subject<boolean>;
  public onSelected: Subject<boolean>;
  productList: ProductList[] = [];
  listLoading: boolean;

  //kendo Grid
  public pageSize = 10;
  public skip = 0;
  public allowUnsort = true;
  selected: any;
  public sort: SortDescriptor[] = [
    {
      field: "Name" || "Code" || "GroupName",
      dir: "asc",
    },
  ];
  public mySelection: number[] = []; //Kendo row Select
  public selectAllState: SelectAllCheckboxState = "unchecked"; //Kendo row Select
  constructor(
    public bsModalRef: BsModalRef,
    private productService: ProductlistService
  ) {}

  public ngOnInit(): void {
    this.getProductList();
    this.onClose = new Subject();
    this.onSelected = new Subject();
  }

  getProductList(): void {
    this.listLoading = true;
    this.productService.getProductList().subscribe(
      (res) => {
        this.productList = res.Entity;
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  public onSelectedKeysChange(e, selectedRow) {
    const len = this.mySelection.length;
    if (len === 0) {
      this.selectAllState = "unchecked";
    } else if (len > 0 && len < this.productList.length) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }
    this.selected = this.productList.filter(function (obj) {
      return obj.ID == e[0];
    });
    this.onSelected.next(this.selected[0]);
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
  public onConfirm(): void {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getProductList();
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  selectedProduct(item, selectedRow): void {
    this.onSelected.next(item);
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
}