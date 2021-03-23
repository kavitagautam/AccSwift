import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KharidKhataRoutingModule } from './kharid-khata-routing.module';
import { KharidKhataComponent } from './kharid-khata/kharid-khata.component';
import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';
import { SharedModule } from '@progress/kendo-angular-grid';

@NgModule({
  declarations: [KharidKhataComponent],
  imports: [
    CommonModule,
    KharidKhataRoutingModule,
    SharedModule,
    AccswiftSharedModule
  ],
  entryComponents: [SettingsReportsComponent]
})
export class KharidKhataModule { }
