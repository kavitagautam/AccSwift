import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { ProductRoutingModule } from "./product-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ProductComponent } from "./components/product/product.component";
import { SharedModule } from "@app/shared/shared.module";
import { ViewProductComponent } from "./components/product/view-product/view-product.component";
import { AddProductComponent } from "./components/product/add-product/add-product.component";
import { EditProductComponent } from "./components/product/edit-product/edit-product.component";
import { ProductGroupModule } from "../product-group/product-group.module";
import { LandingProductComponent } from "./landing-product.component";

@NgModule({
  declarations: [
    AddProductComponent,
    EditProductComponent,
    LandingProductComponent,
    ProductComponent,
    ViewProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    ProductGroupModule,
    SharedModule,
    GridModule,
    PopupModule,
    InputsModule,
    LayoutModule,
    DropDownListModule,
    DropDownsModule,
    TreeViewModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    AddProductComponent,
    EditProductComponent,
    ViewProductComponent
  ]
})
export class ProductModule {}
