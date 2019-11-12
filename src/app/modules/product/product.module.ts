import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeViewModule } from "@progress/kendo-angular-treeview";

import { ProductRoutingModule } from "./product-routing.module";
import { AddProductComponent } from "./components/add-product/add-product.component";
import { EditProductComponent } from "./components/edit-product/edit-product.component";
import { ListProductComponent } from "./components/list-product/list-product.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ProductComponent } from "./components/product/product.component";
import { ProductGroupComponent } from "./components/product-group/product-group.component";
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    AddProductComponent,
    EditProductComponent,
    ListProductComponent,
    ProductComponent,
    ProductGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    SharedModule,
    GridModule,
    PopupModule,
    InputsModule,
    LayoutModule,
    DropDownListModule,
    DropDownsModule,
    TreeViewModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductModule {}
