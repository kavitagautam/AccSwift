import { PreferenceService } from '@accSwift-modules/preference/services/preference.service';
import { SalesInvoiceDetails, SalseInvoice } from '@accSwift-modules/sales-invoice/models/sales-invoice.model';
import { SalesInvoiceService } from '@accSwift-modules/sales-invoice/services/sales-invoice.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrMessageService } from '@app/shared/services/toastr-message/toastr-message.service';
import { DataStateChangeEvent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { process, State } from "@progress/kendo-data-query";
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'accSwift-party-invoices',
  templateUrl: './party-invoices.component.html',
  styleUrls: ['./party-invoices.component.scss']
})
export class PartyInvoicesComponent implements OnInit {
  
  entryArray: FormArray;
  salesInvoiceForm: FormGroup;

  salesDetails: SalesInvoiceDetails;
  payInvoiceForm: FormGroup;

  listLoading:boolean;
  salesInvoiceList: SalseInvoice[];
  public gridView: GridDataResult;
  // public filter: CompositeFilterDescriptor;
  public pageSize = 10; //No of records in a page
  public skip = 0; //No of skipped records
  public currentPage = 1;
  //sorting Kendo Data
  orderByKey = "";
  dirKey = "asc";
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];
  public state: State = 
  {
    filter: {
      logic: "and",
      filters: [{ field: "Status", operator: "Is equal to", value: "UNPAID" }],
    }
  }

  searchFilterList = [];

  constructor(
    public bsModalRef: BsModalRef,
    public _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public salesInvoiceService: SalesInvoiceService,
    private preferenceService: PreferenceService
  ) { }

  ngOnInit() {
    // this.getSalesInvoiceList();
    // this.filterInvoiceForm();
    this.partyInvoiceForm();
    this.buildAddSalesInvoiceForm()
    console.log(this.entryArray.value);
    console.log(this.salesInvoiceForm.value);
  }

  getSalesInvoiceList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };
    console.log(obj.FilterList)
    this.salesInvoiceService.getSalesInvoiceMaster(obj).subscribe(
      (response) => {
        this.salesInvoiceList = response.Entity.Entity;
        console.log(this.salesInvoiceList);
        this.gridView = {
          data: this.salesInvoiceList,
          total: response.Entity.TotalItemsAvailable,
        };
        console.log(this.gridView);
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }
  

  public filterInvoiceForm(): void { //entryArray
    this.searchFilterList = [];
    console.log(this.searchFilterList);
    this.currentPage = 1;
    this.skip = 0;

    for (const object of this.entryArray.value) { 
      console.log(object);
      for (const key in object){ // iterate over properties of object
        console.log(key);
        console.log(object[key]);
        if (object[key]) {
          this.searchFilterList.push({
            Field: key,
            Operator: "contains",
            value: object[key],
          });
        }
      }
    }

    // for (const prop in this.entryArray.value) { // iterate over properties of an array
    //   console.log(prop);
    //   console.log(this.entryArray.value[prop])
    //   if (this.entryArray.value[prop])
    //   {
    //     this.searchFilterList.push({
    //               Field: prop,
    //               Operator: "contains",
    //               value: this.entryArray.value[prop],
    //             });
    //   }
    // }
    console.log(this.searchFilterList);
    this.getSalesInvoiceList();
  }
  
  
  public partyInvoiceForm(): void { //salesInvoiceForm
    this.searchFilterList = [];
    console.log(this.searchFilterList);
    this.currentPage = 1;
    this.skip = 0;
    if (this.salesInvoiceForm.invalid) return;
    console.log(this.salesInvoiceForm.value)
    for (const key in this.salesInvoiceForm.value) {
      console.log(key);
      console.log(this.salesInvoiceForm.value[key]);
      if (this.salesInvoiceForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.salesInvoiceForm.value[key],
        });
      }
    }
    console.log(this.searchFilterList);
    this.getSalesInvoiceList();
  }

  buildAddSalesInvoiceForm(): void {
    this.payInvoiceForm = this._fb.group({
      ID: [this.salesDetails ? this.salesDetails.ID : 0],
      SeriesID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SERIES_SALES.Value
          : null,
        Validators.required,
      ],
      CashPartyLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_CASH_ACCOUNT.Value
          : null,
      ],
      VoucherNo: [""],
      SalesLedgerID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_SALES_ACCOUNT.Value
          : null,
      ],
      DepotID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_DEPOT.Value
          : null,
      ],
      ProjectID: [
        this.preferenceService.preferences
          ? this.preferenceService.preferences.DEFAULT_PROJECT.Value
          : null,
        Validators.required,
      ],
      Date: [new Date()],
      IsPay: [false],
      OrderNo: [""],
      TotalAmount: [0, Validators.required],
      TotalQty: [0, Validators.required],
      Status: ["DRAFT"], // When Sales invoice Added it will be draft
      GrossAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      SpecialDiscount: [0, Validators.required],
      VAT: [0],
      TotalTCAmount: [0],
      Remarks: [""],
      InvoiceDetails: this._fb.array([this.addInvoiceEntryList()]),
      });
  }

  addInvoiceEntryList(): FormGroup {
    return this._fb.group({
      ID: [this.salesDetails ? this.salesDetails.ID : 0],
      ProductCode: [""],
      ProductID: [""],
      ProductName: [""],
      CodeName: [""],
      Quantity: [0, Validators.required],
      QtyUnitID: [null, Validators.required],
      QtyUnitName: [""],
      SalesRate: ["", Validators.required],
      Amount: ["", Validators.required],
      DiscPercentage: [0, Validators.required],
      DiscountAmount: [0, Validators.required],
      NetAmount: [0, Validators.required],
      TaxID: [null],
      TaxAmount: [""],
      Remarks: [""],
    });
  }


  payInvoice(): void {
    console.log(this.payInvoiceForm.value);
    this.payInvoiceForm.get("IsPay").setValue(true);
    this.payInvoiceForm.get("Status").setValue("PAID"); // Paid status
    this.salesInvoiceService
      .addSalesInvoice(this.payInvoiceForm.value)
      .subscribe(
        (response) => {
          this.router.navigate(["/bank-receipt"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Invoice paid successfully");
          this.bsModalRef.hide();
        }
      );
  }


  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getSalesInvoiceList();
  }


  public pageChange(event: PageChangeEvent): void {
    console.log(event);
    this.skip = event.skip;
    if (event.skip == 0) {
      this.currentPage = 1;
    } else {
      const pageNo = event.skip / event.take + 1;
      this.currentPage = pageNo;
    }
    this.getSalesInvoiceList();
  }


  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    console.log(this.state);
    this.gridView = process(this.salesInvoiceList, this.state);
    console.log(this.gridView);
  }


  onCancel():void
  {
    this.bsModalRef.hide();
  }

}
