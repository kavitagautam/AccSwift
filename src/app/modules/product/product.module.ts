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
import { LandingProductComponent } from "./landing-product.component";
import { ProductGroupComponent } from "./components/product-group/product-group.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { UploadsModule } from "@progress/kendo-angular-upload";
import { ProductMoreDetailComponent } from "./components/product-more-detail/product-more-detail.component";
import { ProductImageComponent } from "./components/product-image/product-image.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";

@NgModule({
  declarations: [
    LandingProductComponent,
    ProductComponent,
    ProductGroupComponent,
    ProductMoreDetailComponent,
    ProductImageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    SharedModule,
    AccswiftSharedModule,
    GridModule,
    PopupModule,
    InputsModule,
    LayoutModule,
    ImageCropperModule,
    DropDownListModule,
    UploadsModule,
    DropDownsModule,
    TreeViewModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductModule {}
