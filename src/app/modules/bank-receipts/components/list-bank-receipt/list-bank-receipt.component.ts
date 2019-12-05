import { Component, OnInit } from "@angular/core";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { PageChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { BankReceiptService } from "../../services/bank-receipt.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BankReceiptMaster } from "../../models/bank-receipt.model";

@Component({
  selector: "simpliflysaas-list-bank-receipt",
  templateUrl: "./list-bank-receipt.component.html",
  styleUrls: ["./list-bank-receipt.component.scss"]
})
export class ListBankReceiptComponent implements OnInit {
  bankReceiptForm: FormGroup;
  date: Date = new Date();
  listLoading: boolean;
  bankReceiptList: any;
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter

  constructor(
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public bankReceiptService: BankReceiptService
  ) {}
  ngOnInit() {
    this.bankReceiptForm = this._fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      bankAccount: [""],
      date: [""]
    });
    this.getBankReceiptlList();
    this.bankReceiptService.init();
  }

  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc"
    }
  ];

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
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
    this.getBankReceiptlList();
  }

  getBankReceiptlList(): void {
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc" // "asc" or "desc"
    };
    this.bankReceiptService.getBankReceiptMaster().subscribe(
      response => {
        this.listLoading = true;

        //mapping the data to change string date format to Date
        const sampleData = response.map(
          dataItem =>
            <BankReceiptMaster>{
              IsPayByInvoice: dataItem.IsPayByInvoice,
              TotalAmount: dataItem.TotalAmount,
              BankReceiptDetailsList: dataItem.BankReceiptDetailsList,
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
                Field2: dataItem.Fields.Field1,
                Field3: dataItem.Fields.Field1,
                Field4: dataItem.Fields.Field1,
                Field5: dataItem.Fields.Field1
              },
              Remarks: dataItem.Remarks,
              CreatedBy: dataItem.CreatedBy,
              CreatedDate: this.parseAdjust(dataItem.CreatedDate),
              ModifiedBy: dataItem.ModifiedBy,
              ModifiedDate: this.parseAdjust(dataItem.ModifiedDate)
            }
        );
        this.bankReceiptList = sampleData;
        this.gridView = {
          data: this.bankReceiptList,
          total: this.bankReceiptList ? this.bankReceiptList.length : 0
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

    this.getBankReceiptlList();
  }

  public searchForm() {
    this.getBankReceiptlList();
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
    this.getBankReceiptlList();
  }

  public edit(item): void {
    this.router.navigate(["/bank/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem) {
    const journalId = {
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
        this.deleteReceiptByID(journalId.id);
      }
    });
  }

  public deleteReceiptByID(id): void {
    this.toastr.success("Bank deleted successfully");
    //call Delete Api
  }
}
