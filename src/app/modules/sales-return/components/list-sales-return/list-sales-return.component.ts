import { ConfirmationDialogComponent } from "./../../../../shared/component/confirmation-dialog/confirmation-dialog.component";
import { SalesReturnService } from "./../../services/sales-return.service";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-list-sales-return",
  templateUrl: "./list-sales-return.component.html",
  styleUrls: ["./list-sales-return.component.scss"]
})
export class ListSalesReturnComponent implements OnInit {
  salesReturnForm: FormGroup;
  salesReturnList;
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
    private _fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public salesReturnService: SalesReturnService
  ) {}

  ngOnInit() {
    this.buildSalesReturnForm();
  }

  buildSalesReturnForm() {
    this.salesReturnForm = this._fb.group({
      seriesId: [0],
      cashPartyACId: [0],
      salesACId: [0],
      depotLocationId: [0],
      projectId: [0],
      date: [new Date()],
      orderNo: [""],
      remarks: [""]
    });
  }

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

  public searchForm() {
    this.getSalesReturnList();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    if (event.skip == 0) {
      this.skip = event.skip;
      this.currentPage = 1;
    } else {
      this.skip = event.skip;
      const pageNo = event.skip / event.take + 1;
      this.currentPage = pageNo;
    }
    this.getSalesReturnList();
  }

  public edit(item): void {
    this.router.navigate(["/sales-return/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem) {
    const salesReturnID = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Payments No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deletePaymentsByID(salesReturnID.id);
      }
    });
  }

  public deletePaymentsByID(id): void {
    this.toastr.success("Invoice deleted successfully");
    //call Delete Api
  }
}
