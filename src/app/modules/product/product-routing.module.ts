import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListProductComponent } from "./components/list-product/list-product.component";
import { AddProductComponent } from "./components/add-product/add-product.component";
import { EditProductComponent } from "./components/edit-product/edit-product.component";

const routes: Routes = [
  { path: "", component: ListProductComponent },
  { path: "/product/add", component: AddProductComponent },
  { path: "/product/edit", component: EditProductComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
