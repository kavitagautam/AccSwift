import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterializedViewRoutingModule } from './materialized-view-routing.module';
import { MaterializedViewComponent } from './materialized-view/materialized-view.component';
import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';
import { DateSelectionSettingsComponent } from '@accSwift-modules/accswift-shared/components/date-selection-settings/date-selection-settings.component';

@NgModule({
  declarations: [MaterializedViewComponent],
  imports: [
    CommonModule,
    MaterializedViewRoutingModule,
    AccswiftSharedModule,
  ],
  entryComponents: [DateSelectionSettingsComponent]
})

export class MaterializedViewModule { }
