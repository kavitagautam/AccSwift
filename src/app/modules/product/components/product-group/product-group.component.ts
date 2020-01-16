import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  NgModule,
  Type
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ProductService } from "../../services/product.service";
import { ProductGroup } from "../../models/product.models";
import { AddProductGroupComponent } from "./add-product-group/add-product-group.component";
import { EditProductGroupComponent } from "./edit-product-group/edit-product-group.component";
import { ProductModule } from "../../product.module";
export function decoratorOfType<T>(
  decoratedType: Type<any>,
  decoratorType: Type<T>
): T {
  // get all decorators off of the provided type
  return Reflect.getOwnPropertyDescriptor(
    decoratedType,
    "__annotations__"
  ).value.find(
    (annotation: any) =>
      // get the decorator that matches the requested type
      annotation instanceof decoratorType
  );
}
@Component({
  selector: "accSwift-product-group",
  templateUrl: "./product-group.component.html",
  styleUrls: ["./product-group.component.scss"],
  entryComponents: [AddProductGroupComponent, EditProductGroupComponent]
})
export class ProductGroupComponent implements OnInit, OnChanges {
  @Input("selectedItem") selectedItem;
  @ViewChild("viewContainerRef", { read: ViewContainerRef })
  VCR: ViewContainerRef;
  @ViewChild("dynamicContentDiv", { read: ViewContainerRef })
  dynamicContentDiv: ViewContainerRef;
  selectedGroupId: number;
  groupDetails: ProductGroup;
  productGroupForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    private productService: ProductService,
    private CFR: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.buildProductGroupForm();
    this.createComponent(ProductModule, "accSwift-add-product-group");
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      this.selectedGroupId = this.selectedItem.ID;
    }
    if (this.selectedGroupId) {
      this.getGroupDetails();
    }
  }

  buildProductGroupForm(): void {
    this.productGroupForm = this._fb.group({
      groupName: [this.groupDetails ? this.groupDetails.EngName : ""],
      parentGroup: [this.groupDetails ? this.groupDetails.ParentGroupName : ""],
      remarks: [this.groupDetails ? this.groupDetails.Remarks : ""]
    });
  }

  getGroupDetails(): void {
    this.productService
      .getProductGroupDetails(this.selectedGroupId)
      .subscribe(res => {
        this.groupDetails = res;
        this.buildProductGroupForm();
      });
  }

  editProductGroup() {
    this.createComponent(ProductModule, "accSwift-edit-product-group");
  }

  addProductGroup() {
    this.createComponent(ProductModule, "accSwift-add-product-group");
  }

  private createComponent(moduleType: Type<any>, componentSelector: string) {
    // get the @NgModule decorator
    const ngModuleAnnotation = decoratorOfType(moduleType, NgModule);
    const componentType = ngModuleAnnotation.declarations.find(
      (declaration: Type<any>) => {
        // get the @Component decorator
        const declarationAnnotation = decoratorOfType(declaration, Component);

        // find a declaration with the @Component decorator (not a @Directive) with the requested selector
        return (
          declarationAnnotation != null &&
          declarationAnnotation.selector === componentSelector
        );
      }
    );

    // get the component factory using the component type
    const componentFactory = this.CFR.resolveComponentFactory(
      componentType as Type<any>
    );

    // fill the content using the component factory
    this.dynamicContentDiv.clear();
    const componentRef = this.dynamicContentDiv.createComponent(
      componentFactory
    );
    componentRef.instance.text = "Hello World";
  }

  // createComponent() {
  //   let componentFactory = this.CFR.resolveComponentFactory(
  //     AddProductGroupComponent
  //   );
  //   let componentRef: ComponentRef<AddProductGroupComponent> = this.VCR.createComponent(
  //     componentFactory
  //   );
  //   let currentComponent = componentRef.instance;

  //   // currentComponent.selfRef = currentComponent;
  //   // // to track the added component, you can reuse this index to remove it later
  //   // currentComponent.index = ++this.index;

  //   // // providing parent Component reference to get access to parent class methods
  //   // currentComponent.compInteraction = this;
  // }
  saveProduct(): void {
    if (this.productGroupForm.invalid) return;
  }
  cancelProduct(): void {}
}
