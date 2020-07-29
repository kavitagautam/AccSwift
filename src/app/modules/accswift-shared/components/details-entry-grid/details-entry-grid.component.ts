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

  public productList: ProductMin[] = [];
  @Input("entryArray")
  public entryArray: FormArray;
  @Output() onChange = new EventEmitter();

  @Output() onComponentReady: EventEmitter<FormGroup> = new EventEmitter<
    FormGroup
  >();

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
    public controlContainer: ControlContainer,
    public gridServices: DetailsEntryGridService,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {
    // console.log(
    //   "Control Container " + JSON.stringify(controlContainer.control)
    // );
  }

  ngOnInit() {
    this.gridServices.getProductDD().subscribe((response) => {
      this.productList = response.Entity;
    });
    this.entryArray.valueChanges.subscribe((data) => {
      console.log("changes entry array");
      this.onChange.emit(this.entryArray);
    });
    console.log(
      "DAta Entry of the Array" + JSON.stringify(this.entryArray.value)
    );
  }

  private showUnitPopup: boolean = true;
  rowPopupIndexUnit: number;
  unitClick = false;
  discClick = false;
  public unitPopup(number): void {
    this.unitClick = true;
    this.discClick = false;
    this.rowPopupIndexUnit = number;
    this.showUnitPopup = !this.showUnitPopup;
  }

  private showDiscPopup: boolean = true;
  rowPopupIndexDisc: number;

  public discPopup(number): void {
    this.unitClick = false;
    this.discClick = true;
    this.rowPopupIndexDisc = number;
    this.showDiscPopup = !this.showDiscPopup;
  }

  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      // //
      // if (this.unitClick) {
      //   this.showUnitPopup = !this.showUnitPopup;
      // }
      // if (this.taxClick) {
      //   this.showTaxPopup = !this.showTaxPopup;
      // }
    }
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  //Invoice Column value changes
  changeInvoiceValues(dataItem, index): void {
    const invoiceEntryArray = this.entryArray as FormArray;
    let qunatityValue = invoiceEntryArray.controls[index].get("Quantity").value;

    let salesRateValue = invoiceEntryArray.controls[index].get("SalesRate")
      .value;
    let discountPer = invoiceEntryArray.controls[index].get("DiscPercentage")
      .value;

    let amountC = qunatityValue * salesRateValue;
    let discountAmountC = discountPer * amountC;
    invoiceEntryArray.controls[index]
      .get("DiscountAmount")
      .setValue(discountAmountC);

    invoiceEntryArray.controls[index].get("Amount").setValue(amountC);
    invoiceEntryArray.controls[index]
      .get("NetAmount")
      .setValue(amountC - discountAmountC);
    this.onChange.emit(this.entryArray);

    // this.myFormValueChanges$.subscribe((changes) => {
    //   this.invoiceValueChange(changes);
    //   this.salesInvoiceForm.get("TotalQty").setValue(this.totalQty);
    //   this.salesInvoiceForm.get("GrossAmount").setValue(this.totalGrossAmount);
    //   this.salesInvoiceForm.get("TotalAmount").setValue(this.grandTotalAmount);
    //   this.salesInvoiceForm.get("NetAmount").setValue(this.totalNetAmount);
    //   this.salesInvoiceForm.get("VAT").setValue(this.vatTotalAmount);
    // });
  }

  //tax Change value calculation
  handleTaxChange(value, index): void {
    const selectedTaxValue = this.gridServices.taxList.filter(
      (s) => s.ID === value
    );
    const invoiceEntryArray = this.entryArray as FormArray;
    let netAmountV = invoiceEntryArray.controls[index].get("NetAmount").value;
    if (selectedTaxValue) {
      invoiceEntryArray.controls[index]
        .get("TaxAmount")
        .setValue((netAmountV * selectedTaxValue[0].Rate) / 100);
    }
    // this.myFormValueChanges$.subscribe((changes) =>
    //   this.invoiceValueChange(changes)
    // );
  }

  handleProductChange(value, index): void {
    const selectedProductValue = this.gridServices.productList.filter(
      (s) => s.ProductID === value
    );

    console.log(
      "Selected Oriduct Value" + JSON.stringify(selectedProductValue)
    );
    const invoiceEntryArray = <FormArray>this.entryArray;
    if (selectedProductValue && selectedProductValue.length > 0) {
      invoiceEntryArray.controls[index]
        .get("ProductCode")
        .setValue(selectedProductValue[0].ProductCode);
      invoiceEntryArray.controls[index]
        .get("ProductID")
        .setValue(selectedProductValue[0].ProductID);
      invoiceEntryArray.controls[index]
        .get("CodeName")
        .setValue(selectedProductValue[0].CodeName);
      invoiceEntryArray.controls[index]
        .get("ProductName")
        .setValue(selectedProductValue[0].ProductName);
      invoiceEntryArray.controls[index].get("Quantity").setValue(1);
      invoiceEntryArray.controls[index]
        .get("QtyUnitID")
        .setValue(selectedProductValue[0].QtyUnitID);
      invoiceEntryArray.controls[index]
        .get("QtyUnitName")
        .setValue(selectedProductValue[0].QtyUnitName);
      invoiceEntryArray.controls[index]
        .get("SalesRate")
        .setValue(selectedProductValue[0].SalesRate);

      invoiceEntryArray.controls[index]
        .get("Amount")
        .setValue(
          invoiceEntryArray.controls[index].get("SalesRate").value *
            invoiceEntryArray.controls[index].get("Quantity").value
        );
      invoiceEntryArray.controls[index].get("DiscPercentage").setValue(0);
      invoiceEntryArray.controls[index]
        .get("DiscountAmount")
        .setValue(
          invoiceEntryArray.controls[index].get("DiscPercentage").value *
            invoiceEntryArray.controls[index].get("Amount").value
        );
      invoiceEntryArray.controls[index]
        .get("NetAmount")
        .setValue(
          invoiceEntryArray.controls[index].get("Amount").value -
            invoiceEntryArray.controls[index].get("DiscountAmount").value
        );

      invoiceEntryArray.controls[index].get("TaxID").setValue("");
      invoiceEntryArray.controls[index].get("TaxAmount").setValue("");
      invoiceEntryArray.controls[index].get("Remarks").setValue("");
      // const invoiceEntry = <FormArray>(
      //   this.salesInvoiceForm.get("InvoiceDetails")
      // );
      // if (invoiceEntry.invalid) return;
      // (<FormArray>this.salesInvoiceForm.get("InvoiceDetails")).push(
      //   this.addInvoiceEntryList()
      // );
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
        const invoiceEntryArray = this.entryArray as FormArray;
        invoiceEntryArray.controls[index]
          .get("ProductCode")
          .setValue(data.ProductCode);
        invoiceEntryArray.controls[index]
          .get("CodeName")
          .setValue(data.CodeName);
        invoiceEntryArray.controls[index]
          .get("ProductID")
          .setValue(data.ProductID);
        invoiceEntryArray.controls[index]
          .get("ProductName")
          .setValue(data.ProductName);
        invoiceEntryArray.controls[index].get("Quantity").setValue(1);
        invoiceEntryArray.controls[index]
          .get("QtyUnitID")
          .setValue(data.QtyUnitID);
        invoiceEntryArray.controls[index]
          .get("QtyUnitName")
          .setValue(data.QtyUnitName);
        invoiceEntryArray.controls[index]
          .get("SalesRate")
          .setValue(data.SalesRate);
        invoiceEntryArray.controls[index]
          .get("Amount")
          .setValue(
            invoiceEntryArray.controls[index].get("SalesRate").value *
              invoiceEntryArray.controls[index].get("Quantity").value
          );
        invoiceEntryArray.controls[index].get("DiscPercentage").setValue(0);
        invoiceEntryArray.controls[index]
          .get("DiscountAmount")
          .setValue(
            invoiceEntryArray.controls[index].get("DiscPercentage").value *
              invoiceEntryArray.controls[index].get("Amount").value
          );
        invoiceEntryArray.controls[index]
          .get("NetAmount")
          .setValue(
            invoiceEntryArray.controls[index].get("Amount").value -
              invoiceEntryArray.controls[index].get("DiscountAmount").value
          );

        invoiceEntryArray.controls[index].get("TaxID").setValue("");
        invoiceEntryArray.controls[index].get("TaxAmount").setValue("");
        invoiceEntryArray.controls[index].get("Remarks").setValue("");

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
  // get entryList(): FormArray {
  //   return entryList.valueentryList.valuethis.entryArray.value;
  // }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    const invoiceEntry = <FormArray>this.entryArray;
    if (invoiceEntry.invalid) return;
    // (<FormArray>this.entryArray.push(
    //   this.addEntryList()
    // );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
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
