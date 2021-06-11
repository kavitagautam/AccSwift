import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LedgerRoutingModule } from "./ledger-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeViewModule } from "@progress/kendo-angular-treeview";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { GridModule } from "@progress/kendo-angular-grid";
import { PopupModule } from "@progress/kendo-angular-popup";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { SharedModule } from "@app/shared/shared.module";
import { AccountGroupComponent } from "./components/account-group/account-group.component";
import { AccountLedgerComponent } from "./components/account-ledger/account-ledger.component";
import { LandingLedgerComponent } from "./components/landing-ledger/landing-ledger.component";
import { AccountLedgerMoreDetailsComponent } from "./components/account-ledger-more-details/account-ledger-more-details.component";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";
import { SubLedgerComponent } from "./components/sub-ledger/sub-ledger.component";
import { OpeningBalanceComponent } from "@accSwift-modules/accswift-shared/components/opening-balance/opening-balance.component";
import { LabelModule } from "@progress/kendo-angular-label";
import { TreeListModule } from "@progress/kendo-angular-treelist";

@NgModule({
  declarations: [
    LandingLedgerComponent,
    AccountGroupComponent,
    AccountLedgerComponent,
    AccountLedgerMoreDetailsComponent,
    SubLedgerComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    AccswiftSharedModule,
    TreeViewModule,
    TreeListModule,
    LayoutModule,
    GridModule,
    PopupModule,
    InputsModule,
    DropDownListModule,
    DropDownsModule,
    LedgerRoutingModule,
    LabelModule,
  ],
  entryComponents: [
    OpeningBalanceComponent,
    AccountGroupComponent,
    AccountLedgerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LedgerModule {}
