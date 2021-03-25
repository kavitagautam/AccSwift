import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BikriKhataRoutingModule } from './bikri-khata-routing.module';
import { BikriKhataComponent } from './bikri-khata/bikri-khata.component';
import { DateSelectionSettingsComponent } from '@accSwift-modules/accswift-shared/components/date-selection-settings/date-selection-settings.component';
import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';

@NgModule({
  declarations: [BikriKhataComponent],
  imports: [
    CommonModule,
    AccswiftSharedModule,
    BikriKhataRoutingModule
  ],
  entryComponents: [DateSelectionSettingsComponent]
})
export class BikriKhataModule { }
