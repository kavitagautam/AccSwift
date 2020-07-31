import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormArray,
  FormGroup,
  ControlContainer,
  FormGroupDirective,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { DetailsEntryGridService } from "../../services/details-entry-grid/details-entry-grid.service";
import { AddProductComponent } from "../add-product/add-product/add-product.component";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { RelatedUnits } from "../../models/related-unit.model";
import { CashParty } from "../../models/cash-party.model";
import { ProductMin } from "@app/modules/product/models/product-min.model";
import { ProductModalPopupComponent } from "../product-modal-popup/product-modal-popup.component";

@Component({
  selector: "accSwift-details-entry-grid",
  templateUrl: "./details-entry-grid.component.html",
  styleUrls: ["./details-entry-grid.component.scss"],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class DetailsEntryGridComponent implements OnInit {
  relatedUnits: RelatedUnits[] = [];
  cashPartyList: CashParty[] = [];
  @ViewChild("anchor") public anchor: ElementRef;
  @ViewChild("popup", { read: ElementRef }) public popup: ElementRef;
  totalQty: number = 0;
  totalGrossAmount: number = 0;
  totalNetAmount: number = 0;
  public productList: ProductMin[] = [];
  @Input("entryArray")
  public entryArray: FormArray;

  private showDiscPopup: boolean = false;
  rowPopupIndexDisc: number;

  private showUnitPopup: boolean = false;
  rowPopupIndexUnit: number;

  submitted: boolean;
  rowSubmitted: boolean;
  IsAutomatic: boolean = false;
  private editedRowIndex: number;

  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    // public controlContainer: ControlContainer,
    public gridServices: DetailsEntryGridService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.gridServices.getProductDD().subscribe((response) => {
      this.productList = response.Entity;
    });
    console.log(this.entryArray.getRawValue());
    this.calculateTotal(this.entryArray.value);
  }

  @HostListener("keydown", ["$event"])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      // this.toggle(false);
    }
  }

  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      //  console.log(JSON.stringify(event.target));
      // this.discountToggle(null);
    }
  }

  public enabled: boolean = true;
  public duration: number = 200;
  public type: string = "slide";
  public direction: string = "down";

  public get animate(): any {
    if (this.enabled) {
      return {
        type: this.type,
        direction: this.direction,
        duration: this.duration,
      };
    }

    return false;
  }

  public get hasDirection(): boolean {
    return this.type === "slide" || this.type === "expand";
  }

  public discountToggle(rowIndex) {
    this.showDiscPopup = !this.showDiscPopup;
    this.rowPopupIndexDisc = rowIndex;
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  public unitPopup(rowindex): void {
    this.rowPopupIndexUnit = rowindex;
    this.showUnitPopup = !this.showUnitPopup;
  }

  calculateTotal(invoices): void {
    console.log("invoices" + JSON.stringify(invoices));
    let sumQty = 0;
    let sumNetAmount = 0;
    let sumGrossAmount = 0;
    let sumDiscountAmount = 0;
    let sumTotalDiscountPer = 0;
    let sumTaxAmount = 0;
    for (let i = 0; i < invoices.length; i++) {
      if (invoices && invoices[i].Quantity) {
        sumQty = sumQty + invoices[i].Quantity;
      }
      if (invoices && invoices[i].Amount) {
        sumGrossAmount = sumGrossAmount + invoices[i].Amount;
      }
      if (invoices && invoices[i].NetAmount) {
        sumNetAmount = sumNetAmount + invoices[i].NetAmount;
      }
      if (invoices && invoices[i].DiscountAmount) {
        sumDiscountAmount = sumDiscountAmount + invoices[i].DiscountAmount;
      }
      if (invoices && invoices[i].DiscPercentage) {
        sumTotalDiscountPer = sumTotalDiscountPer + invoices[i].DiscPercentage;
      }
      if (invoices && invoices[i].TaxAmount) {
        sumTaxAmount = sumTaxAmount + invoices[i].TaxAmount;
      }
    }

    this.totalQty = sumQty;
    this.totalGrossAmount = sumGrossAmount;
    this.totalNetAmount = sumNetAmount;
  }

  private gridValueChange(): void {
    this.entryArray.valueChanges.subscribe((invoices) => {
      this.calculateTotal(invoices);
    });
  }
  //Invoice Column value changes
  changeInvoiceValues(dataItem, index): void {
    const entrtListArray = this.entryArray as FormArray;
    let qunatityValue = entrtListArray.controls[index].get("Quantity").value;

    let salesRateValue = entrtListArray.controls[index].get("SalesRate").value;
    let discountPer = entrtListArray.controls[index].get("DiscPercentage")
      .value;

    let amountC = qunatityValue * salesRateValue;
    let discountAmountC = discountPer * amountC;
    entrtListArray.controls[index]
      .get("DiscountAmount")
      .setValue(discountAmountC);

    entrtListArray.controls[index].get("Amount").setValue(amountC);
    entrtListArray.controls[index]
      .get("NetAmount")
      .setValue(amountC - discountAmountC);
    entrtListArray.valueChanges.subscribe((data) => {
      this.gridValueChange();
    });
  }

  //tax Change value calculation
  handleTaxChange(value, index): void {
    const selectedTaxValue = this.gridServices.taxList.filter(
      (s) => s.ID === value
    );
    const entrtListArray = this.entryArray as FormArray;
    let netAmountV = entrtListArray.controls[index].get("NetAmount").value;
    if (selectedTaxValue) {
      entrtListArray.controls[index]
        .get("TaxAmount")
        .setValue((netAmountV * selectedTaxValue[0].Rate) / 100);
    }
    entrtListArray.valueChanges.subscribe((data) => {
      this.gridValueChange();
    });
  }

  handleProductChange(value, index): void {
    const selectedProductValue = this.gridServices.productList.filter(
      (s) => s.ProductID === value
    );

    const entrtListArray = <FormArray>this.entryArray;
    if (selectedProductValue && selectedProductValue.length > 0) {
      entrtListArray.controls[index]
        .get("ProductCode")
        .setValue(selectedProductValue[0].ProductCode);
      entrtListArray.controls[index]
        .get("ProductID")
        .setValue(selectedProductValue[0].ProductID);
      entrtListArray.controls[index]
        .get("CodeName")
        .setValue(selectedProductValue[0].CodeName);
      entrtListArray.controls[index]
        .get("ProductName")
        .setValue(selectedProductValue[0].ProductName);
      entrtListArray.controls[index].get("Quantity").setValue(1);
      entrtListArray.controls[index]
        .get("QtyUnitID")
        .setValue(selectedProductValue[0].QtyUnitID);
      entrtListArray.controls[index]
        .get("QtyUnitName")
        .setValue(selectedProductValue[0].QtyUnitName);
      entrtListArray.controls[index]
        .get("SalesRate")
        .setValue(selectedProductValue[0].SalesRate);

      entrtListArray.controls[index]
        .get("Amount")
        .setValue(
          entrtListArray.controls[index].get("SalesRate").value *
            entrtListArray.controls[index].get("Quantity").value
        );
      entrtListArray.controls[index].get("DiscPercentage").setValue(0);
      entrtListArray.controls[index]
        .get("DiscountAmount")
        .setValue(
          entrtListArray.controls[index].get("DiscPercentage").value *
            entrtListArray.controls[index].get("Amount").value
        );
      entrtListArray.controls[index]
        .get("NetAmount")
        .setValue(
          entrtListArray.controls[index].get("Amount").value -
            entrtListArray.controls[index].get("DiscountAmount").value
        );

      entrtListArray.controls[index].get("TaxID").setValue("");
      entrtListArray.controls[index].get("TaxAmount").setValue("");
      entrtListArray.controls[index].get("Remarks").setValue("");
      // const invoiceEntry = <FormArray>this.entryArray;
      if (entrtListArray.invalid) return;

      this.entryArray.push(this.addEntryList());
    }
  }

  addNewProduct(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(AddProductComponent, this.config);
    this.modalRef.content.action = "Select";
  }

  openModal(index: number): void {
    this.modalRef = this.modalService.show(
      ProductModalPopupComponent,
      this.config
    );
    this.modalRef.content.data = index;
    this.modalRef.content.action = "Select";
    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        console.log(JSON.stringify(data));
        const entrtListArray = this.entryArray as FormArray;
        entrtListArray.controls[index]
          .get("ProductCode")
          .setValue(data.ProductCode);
        entrtListArray.controls[index].get("CodeName").setValue(data.CodeName);
        entrtListArray.controls[index]
          .get("ProductID")
          .setValue(data.ProductID);
        entrtListArray.controls[index]
          .get("ProductName")
          .setValue(data.ProductName);
        entrtListArray.controls[index].get("Quantity").setValue(1);
        entrtListArray.controls[index]
          .get("QtyUnitID")
          .setValue(data.QtyUnitID);
        entrtListArray.controls[index]
          .get("QtyUnitName")
          .setValue(data.QtyUnitName);
        entrtListArray.controls[index]
          .get("SalesRate")
          .setValue(data.SalesRate);
        entrtListArray.controls[index]
          .get("Amount")
          .setValue(
            entrtListArray.controls[index].get("SalesRate").value *
              entrtListArray.controls[index].get("Quantity").value
          );
        entrtListArray.controls[index].get("DiscPercentage").setValue(0);
        entrtListArray.controls[index]
          .get("DiscountAmount")
          .setValue(
            entrtListArray.controls[index].get("DiscPercentage").value *
              entrtListArray.controls[index].get("Amount").value
          );
        entrtListArray.controls[index]
          .get("NetAmount")
          .setValue(
            entrtListArray.controls[index].get("Amount").value -
              entrtListArray.controls[index].get("DiscountAmount").value
          );

        entrtListArray.controls[index].get("TaxID").setValue("");
        entrtListArray.controls[index].get("TaxAmount").setValue("");
        entrtListArray.controls[index].get("Remarks").setValue("");

        this.getRelatedUnitList(data.ProductID);
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  getRelatedUnitList(productCode): void {
    this.gridServices.getRelatedUnits(productCode).subscribe((response) => {
      this.relatedUnits = response.Entity;
    });
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const entrtListArray = <FormArray>this.entryArray;
    if (entrtListArray.invalid) return;
    this.entryArray.push(this.addEntryList());
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  addEntryList(): FormGroup {
    return this._fb.group({
      ID: [0],
      ProductCode: [""],
      ProductID: [""],
      ProductName: [""],
      CodeName: [""],
      Quantity: ["", Validators.required],
      QtyUnitID: ["", Validators.required],
      QtyUnitName: [""],
      SalesRate: ["", Validators.required],
      Amount: ["", Validators.required],
      DiscPercentage: [0, Validators.required],
      DiscountAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      TaxID: [""],
      TaxAmount: [""],
      Remarks: [""],
    });
  }

  productDDFilter(value, i): void {
    this.productList = this.gridServices.productList.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    const selectedTaxValue = this.gridServices.productList.filter(
      (s) => s.ProductID === value
    );
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.entryArray);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    <FormArray>this.entryArray.value.removeAt(rowIndex);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    sender.closeRow(rowIndex);
  }
}
