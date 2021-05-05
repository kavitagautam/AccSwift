import { DeliveryNotes } from '@accSwift-modules/delivery-notes/models/delivery-notes.model';
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
  listLoading: boolean;
  deliveryNotes: DeliveryNotes[];
  productArray;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private deliveryNotesService: DeliveryNotesService,
    ) { }

  ngOnInit() {
    this.buildDeliveryNotesForm();
    this.productArray = <FormArray>(
        this.deliveryNotesForm.get("DeliveryProductsList")
      );
    console.log(this.productArray.at(0).value)
  }

  buildDeliveryNotesForm(): void {
    this.deliveryNotesForm = this._fb.group({
      ID: [0],
      Title: ["", Validators.required],
      OrderDate: [new Date(), Validators.required],
      DeliveryDate: [new Date(), Validators.required],
      ClientLedgerID: [null],
      ClientName: ["", Validators.required],
      ClientAddress: [""],
      ClientContact: [""],
      ClientPAN: [""],
      ClientEmail: [""],
      DeliveredBy: ["", Validators.required],
      DeliverContact: ["", Validators.required],
      DeliveryProductsList: this._fb.array([this.addDeliveryProductList()]),
      Remarks: [""],
      CompanyID: [null]
    })
    console.log(this.deliveryNotesForm.controls.DeliveryProductsList.value)
  }

  get getDeliveryProductList():FormArray {
    return <FormArray> this.deliveryNotesForm.get("DeliveryProductsList");
  }

  addDeliveryProductList():FormGroup {
    return this._fb.group({
      ID: [0],
      DeliveryNoteID: [null],
      ProductID: [13681],
      ProductCode: [""],
      ProductName: [""],
      GeneralName: [""],
      Description: [""],
      Quantity: ["", Validators.required],
      IsService: true
    })
  }
  // 13681
  getDeliveryNotesDetails(index:number): void {
    // const productArray = <FormArray>(
    //   this.deliveryNotesForm.get("DeliveryProductsList")
    // );
    // console.log(productArray.at(0).value)
    // productArray.controls[index].get("ProductID").setValue(13681);
    this.deliveryNotesService.getDeliveryNotes(this.deliveryNotesForm.value).subscribe(
      (response) => {
        if (response)
        {
          
        }
      },
      (error) => {
      },
      () => {
      }
    );
  }

}
