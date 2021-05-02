import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryNotesRoutingModule } from './delivery-notes-routing.module';
import { GridModule } from "@progress/kendo-angular-grid";
import { ListDeliveryNotesComponent } from './components/list-delivery-notes/list-delivery-notes.component';

@NgModule({
  declarations: [ListDeliveryNotesComponent],
  imports: [
    CommonModule,
    DeliveryNotesRoutingModule,
    GridModule
  ]
})
export class DeliveryNotesModule { }
