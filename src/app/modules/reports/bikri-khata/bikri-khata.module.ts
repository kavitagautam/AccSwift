import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from "ngx-print";
import { BikriKhataRoutingModule } from './bikri-khata-routing.module';
import { BikriKhataComponent } from './bikri-khata/bikri-khata.component';
import { DateSelectionSettingsComponent } from '@accSwift-modules/accswift-shared/components/date-selection-settings/date-selection-settings.component';
import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';

@NgModule({
  declarations: [BikriKhataComponent],
  imports: [
    CommonModule,
    AccswiftSharedModule,
    BikriKhataRoutingModule,
    NgxPrintModule
  ],
  entryComponents: [DateSelectionSettingsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BikriKhataModule { }
