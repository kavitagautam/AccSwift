import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  NgModule,
  Type,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";

import { AddProductGroupComponent } from "./components/add-product-group/add-product-group.component";
import { ViewProductGroupComponent } from "./components/view-product-group/view-product-group.component";
import { EditProductGroupComponent } from "./components/edit-product-group/edit-product-group.component";

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
  styleUrls: ["./product-group.component.scss"]
})
export class ProductGroupComponent implements OnInit, OnChanges {
  @Input("selectedProductGroup") selectedProductGroup;

  selectedGroupId: number;

  @ViewChild("dynamicContentDiv", { read: ViewContainerRef })
  dynamicContentDiv: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    // this.createComponent(ProductGroupModule, "accSwift-view-product-group");
    this.viewProductGroup();
  }

  //Detect the changes in tree selection of product group with ngOnChanges
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const log: string[] = [];
    for (const selectedProductGroup in changes) {
      const change = changes[selectedProductGroup];
      this.selectedProductGroup = change.currentValue;
      this.selectedGroupId = this.selectedProductGroup.ID;
    }
    if (this.selectedGroupId) {
      this.viewProductGroup();
    }
  }

  viewProductGroup(): void {
    this.dynamicContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      ViewProductGroupComponent
    );
    const componentRef = this.dynamicContentDiv.createComponent(factory);
    componentRef.instance.selectedGroupId = this.selectedGroupId;
    // // componentRef.instance = this.name;
    //  this.createComponent(
    //    ProductGroupModule,
    //    "accSwift-view-product-group"
    //  );
  }

  editProductGroup(): void {
    this.dynamicContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      EditProductGroupComponent
    );
    const componentRef = this.dynamicContentDiv.createComponent(factory);
    componentRef.instance.selectedGroupId = this.selectedGroupId;
    // this.createComponent(ProductGroupModule, "accSwift-edit-product-group");
  }

  addProductGroup(): void {
    this.dynamicContentDiv.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      AddProductGroupComponent
    );
    const componentRef = this.dynamicContentDiv.createComponent(factory);
    componentRef.instance.selectedGroupId = this.selectedGroupId;
    //  this.createComponent(ProductGroupModule, "accSwift-add-product-group");
  }

  deleteProductGroup(): void {}

  private createComponent(moduconstype: Type<any>, componentSelector: string) {
    // get the @NgModule decorator
    const ngModuleAnnotation = decoratorOfType(moduconstype, NgModule);
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
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      componentType as Type<any>
    );

    // fill the content using the component factory
    this.dynamicContentDiv.clear();
    const componentRef = this.dynamicContentDiv.createComponent(
      componentFactory
    );
    componentRef.instance.text = "Hello World";
  }
}
