import { AddProductComponent } from '@accSwift-modules/accswift-shared/components/add-product/add-product/add-product.component';
import { DetailsEntryGridService } from '@accSwift-modules/accswift-shared/services/details-entry-grid/details-entry-grid.service';
import { DeliveryNotes, DeliveryProductsList } from '@accSwift-modules/delivery-notes/models/delivery-notes.model';
import { DeliveryNotesService } from '@accSwift-modules/delivery-notes/services/delivery-notes.service';
import { LedgerMin } from '@accSwift-modules/ledger/models/ledger.models';
import { ProductMin } from '@accSwift-modules/product/models/product-min.model';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { takeUntil, debounceTime } from "rxjs/operators";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { repeat } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'accSwift-edit-delivery-notes',
  templateUrl: '../common-html/delivery-notes.html',
  styleUrls: ['../common-html/delivery-notes.scss']
})
export class EditDeliveryNotesComponent implements OnInit, OnDestroy {

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
    private route: ActivatedRoute,
    private deliveryNotesService: DeliveryNotesService,
    public gridServices: DetailsEntryGridService,
    private modalService: BsModalService,
    private toastr: ToastrService,) { }

  ngOnInit() {
    this.getIdFromRoute();
    this.buildDeliveryNotesForm();
    
    this.deliveryNotesForm.valueChanges.subscribe((changes) => {
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
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  buildDeliveryNotesForm(): void {
    this.deliveryNotesForm = this._fb.group({
      ID: [this.deliveryNotes ? this.deliveryNotes.ID: 0],
      Title: [this.deliveryNotes ? this.deliveryNotes.Title: "", Validators.required],
      OrderDate: [this.deliveryNotes? new Date(this.deliveryNotes.OrderDate): "", Validators.required],
      DeliveryDate: [this.deliveryNotes ? new Date(this.deliveryNotes.DeliveryDate):"", Validators.required],
      ClientLedgerID: [this.deliveryNotes ? this.deliveryNotes.ClientLedgerID: null],
      ClientName: [this.deliveryNotes ? this.deliveryNotes.ClientName: "", Validators.required],
      ClientAddress: [this.deliveryNotes ? this.deliveryNotes.ClientAddress: ""],
      ClientContact: [this.deliveryNotes ? this.deliveryNotes.ClientContact: ""],
      ClientPAN: [this.deliveryNotes ? this.deliveryNotes.ClientPAN: ""],
      ClientEmail: [this.deliveryNotes ? this.deliveryNotes.ClientEmail: ""],
      DeliveredBy: [this.deliveryNotes ? this.deliveryNotes.DeliveredBy: "", Validators.required],
      DeliverContact: [this.deliveryNotes ? this.deliveryNotes.DeliverContact: "", Validators.required],
      TotalQty: [this.deliveryNotes ? this.deliveryNotes.TotalQty: 0, Validators.required],
      DeliveryProductsList: this._fb.array([this.addDeliveryProductList()]),
      Remarks: [this.deliveryNotes ? this.deliveryNotes.Remarks: ""],
      CompanyID: [this.deliveryNotes ? this.deliveryNotes.CompanyID: null]
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

  assignFormsValue(): void {
    this.deliveryNotesForm.get("ID").setValue(this.deliveryNotes.ID);
    this.deliveryNotesForm.get("Title").setValue(this.deliveryNotes.Title);
    this.deliveryNotesForm.get("OrderDate").setValue(new Date(this.deliveryNotes.OrderDate));
    this.deliveryNotesForm.get("DeliveryDate").setValue(new Date(this.deliveryNotes.DeliveryDate));
    this.deliveryNotesForm.get("ClientLedgerID").setValue(this.deliveryNotes.ClientLedgerID);
    this.deliveryNotesForm.get("ClientName").setValue(this.deliveryNotes.ClientName);
    this.deliveryNotesForm.get("ClientAddress").setValue(this.deliveryNotes.ClientAddress);
    this.deliveryNotesForm.get("ClientContact").setValue(this.deliveryNotes.ClientContact);
    this.deliveryNotesForm.get("ClientPAN").setValue(this.deliveryNotes.ClientPAN);
    this.deliveryNotesForm.get("ClientEmail").setValue(this.deliveryNotes.ClientEmail);
    this.deliveryNotesForm.get("DeliveredBy").setValue(this.deliveryNotes.DeliveredBy);
    this.deliveryNotesForm.get("DeliverContact").setValue(this.deliveryNotes.DeliverContact);
    this.deliveryNotesForm.get("TotalQty").setValue(this.deliveryNotes.TotalQty);
    this.deliveryNotesForm.get("Remarks").setValue(this.deliveryNotes.Remarks);
    this.deliveryNotesForm.get("CompanyID").setValue(this.deliveryNotes.CompanyID);
  }

   getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if (param) {
        this.deliveryNotesService.getDeliveryNotesById(param)
          .subscribe((response) => {
            this.deliveryNotes = response.Entity;
            console.log(JSON.stringify(this.deliveryNotes))
            if (this.deliveryNotes) {
              this.totalQty = this.deliveryNotes.TotalQty;
              this.assignFormsValue();
              this.deliveryNotesForm.patchValue(this.deliveryNotes);
              this.setDeliveryList();
            }
          });
      }
    });
  }

  setDeliveryList(): void {
    // this.deliveryNotesForm.setControl(
    //   "DeliveryProductsList",
    //   this.setDeliveryDetailsFormArray(this.deliveryNotes.DeliveryProductsList)
    // );

    (<FormArray>this.deliveryNotesForm.get("DeliveryProductsList")).push(
      this.addDeliveryProductList()
    );
  }

  // setDeliveryDetailsFormArray(deliveryDetails): FormArray {
  //   const deliveryFormArray = new FormArray([]);
  //   console.log(deliveryDetails)
  //   if (deliveryDetails && deliveryDetails.length > 0) {
  //     deliveryDetails.forEach((element) => {
  //       deliveryFormArray.push(
  //         this._fb.group({
  //           ID: [element.ID ? element.ID: 0],
  //           DeliveryNoteID: [element.DeliveryNoteID ? element.DeliveryNoteID: null],
  //           ProductID: [element.ProductID ? element.ProductID: ""],
  //           ProductCode: [element.ProductCode ? element.ProductCode: ""],
  //           ProductName: [element.ProductName ? element.ProductName: ""],
  //           GeneralName: [element.GeneralName ? element.GeneralName: ""],
  //           Description: [element.Description ? element.Description: ""],
  //           Quantity: [element.Quantity ? element.Quantity:"", Validators.required],
  //           IsService: [element.IsService]
  //         })
  //       );
  //     });
  //   } else {
  //     deliveryFormArray.push(
  //       this._fb.group({
  //         ID: [0],
  //         DeliveryNoteID: [null],
  //         ProductID: [""],
  //         ProductCode: [""],
  //         ProductName: [""],
  //         GeneralName: [""],
  //         Description: [""],
  //         Quantity: ["", Validators.required],
  //         IsService: true
  //       })
  //     );
  //   }
  //   console.log(deliveryFormArray.controls[0].value.ProductID);
  //   localStorage.setItem("ProductID", deliveryFormArray.controls[0].value.ProductID);
  //   return deliveryFormArray;
  // }


  public save(): void {
    const productArray = <FormArray>(
      this.deliveryNotesForm.get("DeliveryProductsList")
    );
    // console.log(productArray.at(0).value)
    for (let i = 0; i < productArray.length; i++) {
     productArray.controls[i].get("ProductID").setValue(localStorage.getItem("ProductID"));
    }
    this.deliveryNotesForm.get("TotalQty").setValue(this.totalQty);
    if (this.deliveryNotesForm.invalid) return;
    this.deliveryNotesService
    .updateDeliveryNotes(this.deliveryNotesForm.value)
    .subscribe(
      (response) => {
        this.router.navigate(["/delivery-notes"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Delivery Notes edited successfully");
      }
    );
  }


  calTotalQty(): number {
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


  notesValueChange(value): void {
    this.deliveryNotesForm.controls["DeliveryProductsList"].valueChanges
      .pipe(takeUntil(this.destroyed$), debounceTime(20))
      .subscribe((notes) => {
        let sumQty = 0;
        for (let i = 0; i < notes.length; i++) {
          if (notes && notes[i].Quantity) {
            sumQty = sumQty + notes[i].Quantity;
          }
        }
        this.totalQty = sumQty;
      });
  }

}