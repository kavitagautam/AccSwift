import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';
import { DebtorsRoutingModule } from './debtors-routing.module';
import { AgeingComponent } from './components/ageing/ageing.component';
import { DueDateComponent } from './components/due-date/due-date.component';
import { SettingsReportsComponent } from '@accSwift-modules/accswift-shared/components/settings-reports/settings-reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AgeingComponent, DueDateComponent],
  imports: [
    CommonModule,
    DebtorsRoutingModule,
    AccswiftSharedModule,
    FormsModule,
    ReactiveFormsModule],
  entryComponents: [SettingsReportsComponent]
})
export class DebtorsModule { }
