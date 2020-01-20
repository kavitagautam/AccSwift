import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EditProductGroupComponent } from "./components/edit-product-group/edit-product-group.component";
import { AddProductGroupComponent } from "./components/add-product-group/add-product-group.component";
import { ProductGroupComponent } from "./product-group.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ViewProductGroupComponent } from "./components/view-product-group/view-product-group.component";

@NgModule({
  declarations: [
    ProductGroupComponent,
    AddProductGroupComponent,
    EditProductGroupComponent,
    ViewProductGroupComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [ProductGroupComponent],
  entryComponents: [
    ViewProductGroupComponent,
    AddProductGroupComponent,
    EditProductGroupComponent
  ]

  // bootstrap: [ProductGroupComponent]
})
export class ProductGroupModule {}
