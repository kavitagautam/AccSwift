import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryNotesRoutingModule } from './delivery-notes-routing.module';
import { GridModule } from "@progress/kendo-angular-grid";
import { ListDeliveryNotesComponent } from './components/list-delivery-notes/list-delivery-notes.component';
import { AddDeliveryNotesComponent } from './components/add-delivery-notes/add-delivery-notes.component';
import { EditDeliveryNotesComponent } from './components/edit-delivery-notes/edit-delivery-notes.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccswiftSharedModule } from "../accswift-shared/accswift-shared.module";
import { PopupModule } from '@progress/kendo-angular-popup';
import { SharedModule } from '@app/shared/shared.module';
import { InputsModule, NumericTextBoxModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgxPrintModule } from 'ngx-print';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';


@NgModule({
  declarations: [ListDeliveryNotesComponent, AddDeliveryNotesComponent, EditDeliveryNotesComponent],
  imports: [
    CommonModule,
    DeliveryNotesRoutingModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    AccswiftSharedModule,
    PopupModule,
    SharedModule,
    InputsModule,
    NgxPrintModule,
    PDFExportModule,
    LayoutModule,
    DropDownListModule,
    DateInputsModule,
    DropDownsModule,
    NumericTextBoxModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DeliveryNotesModule { }
