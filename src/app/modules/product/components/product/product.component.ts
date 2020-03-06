import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProductService } from "../../services/product.service";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { Product } from "../../models/product.models";

@Component({
  selector: "accSwift-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"]
})
export class ProductComponent implements OnInit, OnChanges {
  @Input("selectedProduct") selectedProduct;

  private editedRowIndex: number;

  title: string;
  editMode: boolean = false;
  addMode: boolean;

  submitted: boolean;
  showActions = false;

  rowSubmitted: boolean;
  productDetails: Product;
  productForm: FormGroup;
  selectedProductId: number;

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(
    private toastr: ToastrService,
    public productService: ProductService,
    private modalService: BsModalService,
    public _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildProductForm();
  }

  //Detect the changes in tree selection of product with ngOnChanges
  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    const log: string[] = [];
    for (const selectedProduct in changes) {
      const change = changes[selectedProduct];
      this.selectedProduct = change.currentValue;
      if (this.selectedProduct) {
        this.selectedProductId = this.selectedProduct.ID;
        if (this.selectedProductId) {
          this.editMode = true;
          this.addMode = false;
          this.title = "Edit ";
          this.getProductDetails();
        } else {
          this.addProduct();
        }
      }
    }
  }

  buildProductForm(): void {
    this.productForm = this._fb.group({
      productCode: [
        this.productDetails ? this.productDetails.ProductCode : "",
        Validators.required
      ],
      productName: [
        this.productDetails ? this.productDetails.Name : "",
        Validators.required
      ],
      productGroupId: [
        this.productDetails ? this.productDetails.GroupID : null,
        Validators.required
      ],
      departmentandLocationId: [
        this.productDetails ? this.productDetails.DepotID : null,
        Validators.required
      ],
      baseUnitId: [
        this.productDetails ? this.productDetails.UnitID : null,
        Validators.required
      ],
      isVatApplicable: [
        this.productDetails ? this.productDetails.IsVatApplicable : false,
        Validators.required
      ],
      isDecimalApplicable: [
        this.productDetails ? this.productDetails.IsDecimalApplicable : false
      ],
      isInventoryApplicable: [
        this.productDetails ? this.productDetails.IsInventoryApplicable : false
      ],
      remarks: [this.productDetails ? this.productDetails.Remarks : ""],
      openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()])
    });
  }

  getProductDetails(): void {
    if (this.selectedProductId) {
      this.productService
        .getProductDetails(this.selectedProductId)
        .subscribe(response => {
          console.log(response.Entity);
          this.productDetails = response.Entity;
          this.buildProductForm();
          this.setOpeingQuantity();
        });
    }
  }

  setOpeingQuantity(): void {
    this.productForm.setControl(
      "openingBalanceList",
      this.setOpeningBalanceFormArray(this.productDetails.OpeningQuantity)
    );
  }

  setOpeningBalanceFormArray(openingQuantities): FormArray {
    const openingQuantitiesFormArray = new FormArray([]);
    if (openingQuantities) {
      openingQuantitiesFormArray.push(
        this._fb.group({
          ID: [openingQuantities.ID],
          productId: [openingQuantities.ProductID],
          accountClassId: [openingQuantities.AccClassID],
          accountClassName: [
            this.productService.accountClass
              ? this.productService.accountClass[0].Name
              : ""
          ],
          quantity: openingQuantities.OpenPurchaseQty,
          purchaseRate: [openingQuantities.OpenPurchaseRate],
          salesRate: [openingQuantities.OpenSalesRate],
          date: [new Date(openingQuantities.OpenQuantityDate)]
        })
      );
    } else {
      openingQuantitiesFormArray.push(
        this._fb.group({
          ID: [""],
          productId: [""],
          accountClassId: [
            this.productService.accountClass
              ? this.productService.accountClass[0].ID
              : null
          ],
          accountClassName: [
            this.productService.accountClass
              ? this.productService.accountClass[0].Name
              : ""
          ],
          quantity: "",
          purchaseRate: [""],
          salesRate: [""],
          date: [""]
        })
      );
    }
    return openingQuantitiesFormArray;
  }
  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      ID: [""],
      productId: [""],
      accountClassId: [
        this.productService.accountClass
          ? this.productService.accountClass[0].ID
          : null
      ],
      accountClassName: [
        this.productService.accountClass
          ? this.productService.accountClass[0].Name
          : ""
      ],
      quantity: [""],
      purchaseRate: [""],
      salesRate: [""],
      date: [""]
    });
  }

  get getOpeningBalanceList(): FormArray {
    return <FormArray>this.productForm.get("openingBalanceList");
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.productForm.get("openingBalanceList").invalid) return;
    (<FormArray>this.productForm.get("openingBalanceList")).push(
      this.addOpeningBalanceFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.productForm.get("openingBalanceList"));
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const product = formGroup.value;
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.productForm.get("openingBalanceList")).removeAt(rowIndex);
  }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  save(): void {
    if (this.addMode) {
      if (this.productForm.invalid) return;
      const openingBalanceArray = <FormArray>(
        this.productForm.get("openingBalanceList")
      );
      const obj = {
        ProductCode: this.productForm.get("productCode").value,
        Name: this.productForm.get("productName").value,
        GroupID: this.productForm.get("productGroupId").value,
        DepotID: this.productForm.get("departmentandLocationId").value,
        UnitID: this.productForm.get("baseUnitId").value,
        IsVatApplicable: this.productForm.get("isVatApplicable").value
          ? this.productForm.get("isVatApplicable").value
          : false,
        IsInventoryApplicable: this.productForm.get("isInventoryApplicable")
          .value
          ? this.productForm.get("isInventoryApplicable").value
          : false,
        IsDecimalApplicable: this.productForm.get("isDecimalApplicable").value
          ? this.productForm.get("isDecimalApplicable").value
          : false,
        OpeningQuantity: {
          ProductID: this.productForm.get("productGroupId").value,
          AccClassID: openingBalanceArray.controls[0].get("accountClassId")
            .value,
          OpenPurchaseQty: openingBalanceArray.controls[0].get("quantity")
            .value,
          OpenPurchaseRate: openingBalanceArray.controls[0].get("purchaseRate")
            .value,
          OpenSalesRate: openingBalanceArray.controls[0].get("salesRate").value,
          OpenQuantityDate: openingBalanceArray.controls[0].get("date").value
        }
      };
      this.productService.addProduct(obj).subscribe(
        response => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Product added successfully");
        }
      );
    } else {
      if (this.productForm.invalid) return;

      const openingBalanceArray = <FormArray>(
        this.productForm.get("openingBalanceList")
      );

      const obj = {
        ID: this.selectedProductId,
        ProductCode: this.productForm.get("productCode").value,
        Name: this.productForm.get("productName").value,
        GroupID: this.productForm.get("productGroupId").value,
        DepotID: this.productForm.get("departmentandLocationId").value,
        UnitID: this.productForm.get("baseUnitId").value,
        IsVatApplicable: this.productForm.get("isVatApplicable").value
          ? this.productForm.get("isVatApplicable").value
          : false,
        IsInventoryApplicable: this.productForm.get("isInventoryApplicable")
          .value
          ? this.productForm.get("isInventoryApplicable").value
          : false,
        IsDecimalApplicable: this.productForm.get("isDecimalApplicable").value
          ? this.productForm.get("isDecimalApplicable").value
          : false,
        OpeningQuantity: {
          ID: openingBalanceArray.controls[0].get("ID").value,
          ProductID: openingBalanceArray.controls[0].get("productId").value,
          AccClassID: openingBalanceArray.controls[0].get("accountClassId")
            .value,
          OpenPurchaseQty: openingBalanceArray.controls[0].get("quantity")
            .value,
          OpenPurchaseRate: openingBalanceArray.controls[0].get("purchaseRate")
            .value,
          OpenSalesRate: openingBalanceArray.controls[0].get("salesRate").value,
          OpenQuantityDate: openingBalanceArray.controls[0].get("date").value
        }
      };
      this.productService.updateProduct(obj).subscribe(
        response => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Product updated successfully");
        }
      );
    }
  }

  cancel(event): void {
    this.buildProductForm();
  }

  addProduct(): void {
    this.productDetails = null;
    this.editMode = false;
    this.addMode = true;
    this.title = "Add Product ";
    this.buildProductForm();
  }

  deleteProductGroup(): void {
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "product";
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteProductByID(this.selectedProductId);
      }
    });
  }

  public deleteProductByID(id): void {
    this.productService.deleteProductByID(id).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.toastr.success(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product deleted successfully");
      }
    );
  }
}
