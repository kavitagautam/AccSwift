import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingProductComponent } from "./landing-product.component";

const routes: Routes = [
  {
    path: "",
    component: LandingProductComponent,
    data: {
      breadcrumb: "Landing Product Page"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
