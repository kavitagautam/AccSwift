import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ConfigurationRoutingModule } from "./configuration-routing.module";
import { VoucherConfigurationComponent } from "./components/voucher-configuration/voucher-configuration.component";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { LayoutModule } from "@progress/kendo-angular-layout";

@NgModule({
  declarations: [VoucherConfigurationComponent],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PopupModule,
    InputsModule,
    TreeViewModule,
    SharedModule,
    LayoutModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConfigurationModule {}
