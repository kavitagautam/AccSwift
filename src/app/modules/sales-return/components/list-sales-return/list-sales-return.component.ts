import { SalesReturnService } from "./../../services/sales-return.service";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-list-sales-return",
  templateUrl: "./list-sales-return.component.html",
  styleUrls: ["./list-sales-return.component.scss"]
})
export class ListSalesReturnComponent implements OnInit {
  salesReturnForm: FormGroup;
  salesReturnList: SalesReturnMaster;
  date: Date = new Date();
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize: 10;
  public skip = 0;
  public currentPage = 1;
  modalRef: BsModalRef;
  listLoading: boolean;
  // Sorting Kendo Data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{ field: "", dir: "asc" }];
  // Modal Config to Unhide When Clicked Outside
  config = { backdrop: true, ignoreBackdropClick: true };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public salesReturnService: SalesReturnService
  ) { }

  ngOnInit() {
    this.buildSalesReturnForm();
  }

  buildSalesReturnForm() {
    this.salesReturnForm = this.fb.group({
      series: [""],
      cash: [""],
      sales: [""],
      depot: [""],
      project: [""],
      date: [""],
      orderNo: [""],
      remarks: [""]
    });
  }

  //Date String Parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  };

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getSalesReturnList();
  }

  getSalesReturnList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc"
    };

    this.salesReturnService.getSalesReturnMaster().subscribe(
      res => {
        this.listLoading = true;
        this.salesReturnList = res;
        this.gridView = {
          data: this.salesReturnList.slice(
            this.skip,
            this.skip + this.pageSize
          ),
          total: this.salesReturnList ? this.salesReturnList.length : 0
        };
      },
      error => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }
  public filterChange(filter): void {
    this.filter = filter;
    this.getSalesReturnList();
  }
}
