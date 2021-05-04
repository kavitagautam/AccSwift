import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryNotesRoutingModule } from './delivery-notes-routing.module';
import { GridModule } from "@progress/kendo-angular-grid";
import { ListDeliveryNotesComponent } from './components/list-delivery-notes/list-delivery-notes.component';
import { AddDeliveryNotesComponent } from './components/add-delivery-notes/add-delivery-notes.component';
import { EditDeliveryNotesComponent } from './components/edit-delivery-notes/edit-delivery-notes.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";


@NgModule({
  declarations: [ListDeliveryNotesComponent, AddDeliveryNotesComponent, EditDeliveryNotesComponent],
  imports: [
    CommonModule,
    DeliveryNotesRoutingModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    AccswiftSharedModule
  ]
})
export class DeliveryNotesModule { }
