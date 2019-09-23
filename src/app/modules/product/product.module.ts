import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeViewModule } from "@progress/kendo-angular-treeview";

import { ProductRoutingModule } from "./product-routing.module";
import { AddProductComponent } from "./components/add-product/add-product.component";
import { EditProductComponent } from "./components/edit-product/edit-product.component";
import { ListProductComponent } from "./components/list-product/list-product.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AddProductComponent,
    EditProductComponent,
    ListProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    TreeViewModule
  ]
})
export class ProductModule {}
