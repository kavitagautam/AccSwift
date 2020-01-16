import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { CompanyRoutingModule } from "./company-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListCompanyComponent } from "./components/list-company/list-company.component";
import { AddCompanyComponent } from "./components/add-company/add-company.component";
import { EditCompanyComponent } from "./components/edit-company/edit-company.component";

@NgModule({
  declarations: [
    ListCompanyComponent,
    AddCompanyComponent,
    EditCompanyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CompanyRoutingModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule
  ]
})
export class CompanyModule {}
