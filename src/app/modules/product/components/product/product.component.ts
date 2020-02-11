import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from "@angular/core";
import { ViewProductComponent } from "./view-product/view-product.component";
import { ToastrService } from "ngx-toastr";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ProductService } from "../../services/product.service";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
  entryComponents: [
    ViewProductComponent,
    AddProductComponent,
    EditProductComponent
  ]
})
export class ProductComponent implements OnInit, OnChanges {
  @Input("selectedProduct") selectedProduct;

  @ViewChild("dynamicProductContentDiv", { read: ViewContainerRef })
  dynamicProductContentDiv: ViewContainerRef;

  selectedProductId: number;

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private toastr: ToastrService,
    private productService: ProductService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.viewProduct();
  }

  //Detect the changes in tree selection of product with ngOnChanges
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const log: string[] = [];
    for (const selectedProduct in changes) {
      const change = changes[selectedProduct];
      this.selectedProduct = change.currentValue;
      this.selectedProductId = this.selectedProduct.ID;
    }
    if (this.selectedProductId) {
      this.viewProduct();
    }
  }

  viewProduct(): void {
    this.dynamicProductContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      ViewProductComponent
    );
    const componentRef = this.dynamicProductContentDiv.createComponent(factory);
    componentRef.instance.selectedProductId = this.selectedProductId;
  }

  editProduct(): void {
    this.dynamicProductContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      EditProductComponent
    );
    const componentRef = this.dynamicProductContentDiv.createComponent(factory);
    componentRef.instance.selectedProductId = this.selectedProductId;

    componentRef.instance.onCancel.subscribe(data => {
      if (data) {
        this.viewProduct();
      }
    });
  }

  addProduct(): void {
    this.dynamicProductContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      AddProductComponent
    );
    const componentRef = this.dynamicProductContentDiv.createComponent(factory);
    componentRef.instance.selectedProductId = this.selectedProductId;

    componentRef.instance.onCancel.subscribe(data => {
      if (data) {
        this.viewProduct();
      }
    });
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
