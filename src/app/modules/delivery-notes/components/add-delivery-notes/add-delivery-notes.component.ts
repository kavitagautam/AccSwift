import { AddProductComponent } from '@accSwift-modules/accswift-shared/components/add-product/add-product/add-product.component';
import { DetailsEntryGridService } from '@accSwift-modules/accswift-shared/services/details-entry-grid/details-entry-grid.service';
import { DeliveryNotes, DeliveryProductsList } from '@accSwift-modules/delivery-notes/models/delivery-notes.model';
import { DeliveryNotesService } from '@accSwift-modules/delivery-notes/services/delivery-notes.service';
import { LedgerMin } from '@accSwift-modules/ledger/models/ledger.models';
import { ProductMin } from '@accSwift-modules/product/models/product-min.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { repeat } from 'rxjs/operators';


@Component({
  selector: 'accSwift-add-delivery-notes',
  templateUrl: '../common-html/delivery-notes.html',
  styleUrls: ['../common-html/delivery-notes.scss']
})
export class AddDeliveryNotesComponent implements OnInit {

  public deliveryNotesForm: FormGroup;
  listLoading: boolean;
  deliveryNotes: DeliveryNotes;
  deliveryProductsList: DeliveryProductsList;
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
  totalQty: number = 0;

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
      TotalQty: [0, Validators.required],
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
      ProductID: [""],
      ProductCode: [""],
      ProductName: [""],
      GeneralName: [""],
      Description: [""],
      Quantity: ["", Validators.required],
      IsService: true
    })
  }
  // 13681
  getDeliveryNotesDetails(value): void {
    const productArray = <FormArray>(
      this.deliveryNotesForm.get("DeliveryProductsList")
    );
    // console.log(productArray.at(0).value)
    for (let i = 0; i < productArray.length; i++) {
     productArray.controls[i].get("ProductID").setValue(this.deliveryProductsList ? this.deliveryProductsList.ProductID:13681);
    }
    this.deliveryNotesForm.get("TotalQty").setValue(this.totalQty);
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

  calTotalQty() {
    const productListArray = this.productArray.value;
    let sumQty = 0;
    for (let i = 0; i < productListArray.length; i++) {
      if (productListArray && productListArray[i].Quantity) {
        sumQty = sumQty + productListArray[i].Quantity;
      }
    }
    this.totalQty = sumQty;
    return sumQty;
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

  handleProductChange(value, index): void {
    const selectedProductValue = this.gridServices.productList.filter((s) => s.ProductID === value );
    const ProductListArray = <FormArray>this.productArray;
    console.log(selectedProductValue);
    console.log(ProductListArray);
    if (selectedProductValue && selectedProductValue.length > 0)
    {
      ProductListArray.controls[index]
        .get("ProductCode")
        .setValue(selectedProductValue[0].ProductCode);
      ProductListArray.controls[index]
        .get("GeneralName")
        .setValue(selectedProductValue[0].ProductName);
    }
  }
  

}
