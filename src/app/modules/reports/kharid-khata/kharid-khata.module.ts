import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxPrintModule} from 'ngx-print';

import { KharidKhataRoutingModule } from './kharid-khata-routing.module';
import { KharidKhataComponent } from './kharid-khata/kharid-khata.component';
import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';
import { SharedModule } from '@app/shared/shared.module';
import { DateSelectionSettingsComponent } from '@accSwift-modules/accswift-shared/components/date-selection-settings/date-selection-settings.component';

@NgModule({
  declarations: [KharidKhataComponent],
  imports: [
    CommonModule,
    KharidKhataRoutingModule,
    SharedModule,
    AccswiftSharedModule,
    NgxPrintModule
  ],
  entryComponents: [DateSelectionSettingsComponent]
})
export class KharidKhataModule { }
