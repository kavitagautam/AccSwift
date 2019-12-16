import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ContraVoucherService } from "../../services/contra-voucher.service";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ContraVoucherMaster } from "../models/contravoucher.model";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "app-list-contra-voucher",
  templateUrl: "./list-contra-voucher.component.html",
  styleUrls: ["./list-contra-voucher.component.scss"]
})
export class ListContraVoucherComponent implements OnInit {
  contraVoucherForm: FormGroup;
  public gridView: GridDataResult;
  listLoading: boolean;
  contraVoucherMaster: ContraVoucherMaster;
  public filter: CompositeFilterDescriptor;
  date: Date = new Date();
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  modalRef: BsModalRef;
  cashList: ContraVoucherMaster[];
  constructor(
    private fb: FormBuilder,
    private contraVoucherService: ContraVoucherService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.editContraVoucherForm();
    this.getContraVoucherList();

  }

  editContraVoucherForm() {
    this.contraVoucherForm = this.fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      cashAccount: [""],
      date: [""]
    });
  }

  //Sorting Kendo Data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];

  //modal config to unhide when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  // Date string parse
  public currentYear = new Date().getFullYear();
  public parseAdjust = (eventDate: Date): Date => {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  };

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getContraVoucherList();
  }

  getContraVoucherList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc" // "asc" or "desc"
    };

    this.contraVoucherService.getCashReceiptMaster().subscribe(
      res => {
        this.listLoading = true;

        //mapping the data to change string date format to Date
        const sampleData = res.map(
          dataItem =>
            <ContraVoucherMaster>{
              IsPayByInvoice: dataItem.IsPayByInvoice,
              TotalAmount: dataItem.TotalAmount,
              CashReceiptDetails: dataItem.CashReceiptDetails,
              LedgerID: dataItem.LedgerID,
              LedgerName: dataItem.LedgerName,
              ID: dataItem.ID,
              SeriesID: dataItem.SeriesID,
              SeriesName: dataItem.SeriesName,
              VoucherNo: dataItem.VoucherNo,
              Date: this.parseAdjust(dataItem.Date),
              ProjectID: dataItem.ProjectID,
              ProjectName: dataItem.ProjectName,
              Fields: {
                Field1: dataItem.Fields.Field1,
                Field2: dataItem.Fields.Field2,
                Field3: dataItem.Fields.Field3,
                Field4: dataItem.Fields.Field4,
                Field5: dataItem.Fields.Field5
              },
              Remarks: dataItem.Remarks,
              CreatedBy: dataItem.CreatedBy,
              CreatedDate: this.parseAdjust(dataItem.CreatedDate),
              ModifiedBy: dataItem.ModifiedBy,
              ModifiedDate: this.parseAdjust(dataItem.ModifiedDate)
            }
        );
        this.cashList = sampleData;
        this.gridView = {
          data: this.cashList,
          total: this.cashList ? this.cashList.length : 0
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

  public searchForm() {
    this.getContraVoucherList();
  }

  public filterChange(filter): void {
    this.filter = filter;
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
    this.getContraVoucherList();
  }

  public edit(): void {
    this.router.navigate(["/contra/edit"]);
  }

  openConfirmationDialogue(dataItem) {
    const contraId = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Receipt No." + dataItem.VoucherNo;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteContraById(contraId.id);
      }
    });
  }

  public deleteContraById(id): void {
    this.toastr.success("Voucher deleted succesfully");
  }
}
