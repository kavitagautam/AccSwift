import { AddProductComponent } from '@accSwift-modules/accswift-shared/components/add-product/add-product/add-product.component';
import { DetailsEntryGridService } from '@accSwift-modules/accswift-shared/services/details-entry-grid/details-entry-grid.service';
import { DeliveryNotes } from '@accSwift-modules/delivery-notes/models/delivery-notes.model';
import { DeliveryNotesService } from '@accSwift-modules/delivery-notes/services/delivery-notes.service';
import { LedgerMin } from '@accSwift-modules/ledger/models/ledger.models';
import { ProductMin } from '@accSwift-modules/product/models/product-min.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'accSwift-add-delivery-notes',
  templateUrl: '../common-html/delivery-notes.html',
  styleUrls: ['../common-html/delivery-notes.scss']
})
export class AddDeliveryNotesComponent implements OnInit {

  public deliveryNotesForm: FormGroup;
  listLoading: boolean;
  deliveryNotes: DeliveryNotes[];
  modalRef: BsModalRef;
  productArray;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  public productList: ProductMin[] = [];
  public ledgerList: LedgerMin[] = [];

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private deliveryNotesService: DeliveryNotesService,
    public gridServices: DetailsEntryGridService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    this.buildDeliveryNotesForm();
    this.productArray = <FormArray>(
        this.deliveryNotesForm.get("DeliveryProductsList")
      );
      this.gridServices.getProductDD().subscribe((response) => {
        this.productList = response.Entity;
      });
      this.gridServices.getLedgerDD().subscribe((response) => {
        this.ledgerList = response.Entity;
      });
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
    if (this.deliveryNotesForm.invalid) return;
    this.deliveryNotesService.getDeliveryNotes(this.deliveryNotesForm.value).subscribe(
      (response) => {
        if (response)
        {
          this.router.navigate(["/delivery-notes"]);
        }
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Delivery Notes added successfully");
      }
    );
  }

  productDDFilter(value, i): void {
    this.productList = this.gridServices.productList.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    const selectedTaxValue = this.gridServices.productList.filter(
      (s) => s.ProductID === value
    );
  }

  ledgerDDFilter(value): void {
    this.ledgerList = this.gridServices.ledgerList.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    const selectedTaxValue = this.gridServices.ledgerList.filter(
      (s) => s.LedgerID === value
    );
  }

}
