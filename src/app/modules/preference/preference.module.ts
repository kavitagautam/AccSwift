import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreferenceRoutingModule } from './preference-routing.module';
import { PreferenceComponent } from './components/preference/preference.component';

@NgModule({
  declarations: [PreferenceComponent],
  imports: [
    CommonModule,
    PreferenceRoutingModule
  ]
})
export class PreferenceModule { }
