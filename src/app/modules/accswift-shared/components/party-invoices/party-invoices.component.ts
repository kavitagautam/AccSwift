import { SalseInvoice } from '@accSwift-modules/sales-invoice/models/sales-invoice.model';
import { SalesInvoiceService } from '@accSwift-modules/sales-invoice/services/sales-invoice.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DataStateChangeEvent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { process, State } from "@progress/kendo-data-query";
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'accSwift-party-invoices',
  templateUrl: './party-invoices.component.html',
  styleUrls: ['./party-invoices.component.scss']
})
export class PartyInvoicesComponent implements OnInit {
  
  entryArray: FormArray;
  salesInvoiceForm: FormGroup;
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
    public salesInvoiceService: SalesInvoiceService
  ) { }

  ngOnInit() {
    this.getSalesInvoiceList();
    // this.searchForm();
    console.log(this.entryArray.value);
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
  

  public searchForm(): void {
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
  
  
  // public searchForm(): void {
  //   this.searchFilterList = [];
  //   console.log(this.searchFilterList);
  //   this.currentPage = 1;
  //   this.skip = 0;
  //   if (this.salesInvoiceForm.invalid) return;
  //   console.log(this.salesInvoiceForm.value)
  //   for (const key in this.salesInvoiceForm.value) {
  //     console.log(key);
  //     console.log(this.salesInvoiceForm.value[key]);
  //     if (this.salesInvoiceForm.value[key]) {
  //       this.searchFilterList.push({
  //         Field: key,
  //         Operator: "contains",
  //         value: this.salesInvoiceForm.value[key],
  //       });
  //     }
  //   }
  //   console.log(this.searchFilterList);
  //   this.getSalesInvoiceList();
  // }


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
