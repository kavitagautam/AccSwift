import { DeliveryNote, DeliveryProductList } from '@accSwift-modules/delivery-notes/models/delivery-notes.model';
import { DeliveryNotesService } from '@accSwift-modules/delivery-notes/services/delivery-notes.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'accSwift-add-delivery-notes',
  templateUrl: '../common-html/delivery-notes.html',
  styleUrls: ['../common-html/delivery-notes.scss']
})
export class AddDeliveryNotesComponent implements OnInit {

  public deliveryNotesForm: FormGroup;
  deliveryNotes: DeliveryNote;
  deliveryProductList: DeliveryProductList;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private deliveryNotesService: DeliveryNotesService,
    ) { }

  ngOnInit() {
    this.buildDeliveryNotesForm();
  }

  buildDeliveryNotesForm(): void {
    this.deliveryNotesForm = this._fb.group({
      ID: [this.deliveryNotes ? this.deliveryNotes.ID:0],
      Title: [this.deliveryNotes ? this.deliveryNotes.Title:"Test"],
      OrderDate: [this.deliveryNotes ? this.deliveryNotes.OrderDate:"2021-05-04"],
      DeliveryDate: [this.deliveryNotes ? this.deliveryNotes.DeliveryDate:"2021-05-04"],
      ClientLedgerID: [null],
      ClientName: ["Testing"],
      ClientAddress: [""],
      ClientContact: [""],
      ClientPAN: [""],
      CLientEmail: [""],
      DeliveredBy: ["kavita"],
      DeliverContact: ["12345"],
      DeliveryProductsList: this._fb.array([this.getDeliveryProductList()]),
      Remarks: [""],
      CompanyID: [null]
    })
    console.log(this.deliveryNotesForm.value);
  }

  getDeliveryProductList():FormGroup {
    return this._fb.group({
      ID: [this.deliveryNotes? this.deliveryNotes.ID:0],
      DeliveryNoteID: [null],
      ProductID: [this.deliveryProductList ? this.deliveryProductList.ProductID:13681],
      ProductCode: [""],
      ProductName: [""],
      GeneralName: [""],
      Description: [""],
      Quantity: [this.deliveryProductList ? this.deliveryProductList.Quantity:12],
      IsService: true
    })
  }

  getDeliveryNotesDetails(): void {
    this.deliveryNotesService.getDeliveryNotes(this.deliveryNotesForm.value).subscribe(
      (response) => {
        // this.deliveryNotes = response.Entity;
      },
      (error) => {
      },
      () => {
      }
    );
  }

}
