import { AddProductComponent } from '@accSwift-modules/accswift-shared/components/add-product/add-product/add-product.component';
import { DetailsEntryGridService } from '@accSwift-modules/accswift-shared/services/details-entry-grid/details-entry-grid.service';
import { DeliveryNotes, DeliveryProductsList } from '@accSwift-modules/delivery-notes/models/delivery-notes.model';
import { DeliveryNotesService } from '@accSwift-modules/delivery-notes/services/delivery-notes.service';
import { LedgerMin } from '@accSwift-modules/ledger/models/ledger.models';
import { ProductMin } from '@accSwift-modules/product/models/product-min.model';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { takeUntil, debounceTime } from "rxjs/operators";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { repeat } from 'rxjs/operators';
import { Subject } from 'rxjs';



@Component({
  selector: 'accSwift-add-delivery-notes',
  templateUrl: '../common-html/delivery-notes.html',
  styleUrls: ['../common-html/delivery-notes.scss']
})
export class AddDeliveryNotesComponent implements OnInit, OnDestroy {

  public deliveryNotesForm: FormGroup;
  listLoading: boolean;
  deliveryNotes: DeliveryNotes;
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
  submitted: boolean;
  rowSubmitted: boolean;
  private editedRowIndex: number;
  totalQty: number = 0;
  myFormValueChanges$;
  private destroyed$ = new Subject<void>();

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
    this.myFormValueChanges$ = this.deliveryNotesForm.controls[
      "DeliveryProductsList"
    ].valueChanges;
    this.myFormValueChanges$.subscribe((changes) => {
      this.notesValueChange(changes);
    });
   
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

  ngOnDestroy() {
    this.myFormValueChanges$.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
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
      DeliverContact: ["", Validators.pattern],
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
      Quantity: [0, Validators.required],
      IsService: true
    })
  }
  

  public save(): void {
    const productArray = <FormArray>(
      this.deliveryNotesForm.get("DeliveryProductsList")
    );
    // console.log(productArray.at(0).value)
    for (let i = 0; i < productArray.length; i++) {
     productArray.controls[i].get("ProductID").setValue(localStorage.getItem("ProductID"));
    }
    this.deliveryNotesForm.get("TotalQty").setValue(this.totalQty);
    
    // if (this.deliveryNotesForm.invalid) return;
    this.deliveryNotesService.addDeliveryNotes(this.deliveryNotesForm.value).subscribe(
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

  calTotalQty():number {
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
      .get("ProductID")
      .setValue(selectedProductValue[0].ProductID);
      ProductListArray.controls[index]
        .get("ProductCode")
        .setValue(selectedProductValue[0].ProductCode);
      ProductListArray.controls[index]
        .get("GeneralName")
        .setValue(selectedProductValue[0].ProductName);
      ProductListArray.controls[index].get("Quantity").setValue(1);
    }
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const productListArray = <FormArray>this.productArray;
    if (productListArray.invalid) return;
    productListArray.push(this.addDeliveryProductList());
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const productListArray = <FormArray>this.productArray;
    productListArray.removeAt(rowIndex);
  }

   notesValueChange(value):void {
    this.deliveryNotesForm.controls["DeliveryProductsList"].valueChanges.pipe(takeUntil(this.destroyed$),debounceTime(20))
    .subscribe((notes)=> {
      let sumQty = 0;
      for (let i = 0; i < notes.length; i++)
      {
        if (notes && notes[i].Quantity)
        {
          sumQty= sumQty + notes[i].Quantity;
        }
      }
      this.totalQty = sumQty
    });
  }

}
