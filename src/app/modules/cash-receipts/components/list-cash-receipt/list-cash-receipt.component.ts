import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CashReceiptService } from "../../services/cash-receipt.service";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { CashReceiptMaster } from "../../models/cash-receipt.model";

@Component({
  selector: "app-list-cash-receipt",
  templateUrl: "./list-cash-receipt.component.html",
  styleUrls: ["./list-cash-receipt.component.scss"]
})
export class ListCashReceiptComponent implements OnInit {
  cashReceiptForm: FormGroup;
  listLoading: boolean;
  cashList: CashReceiptMaster[] = [];
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter
  date: Date = new Date();
  constructor(
    public _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public cashReceiptService: CashReceiptService
  ) {}
  ngOnInit() {
    this.cashReceiptForm = this._fb.group({
      series: [""],
      project: [""],
      voucherNo: [""],
      cashAccount: [""],
      date: [""]
    });
    this.getCashReceiptlList();
    this.cashReceiptService.init();
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
    this.getCashReceiptlList();
  }

  getCashReceiptlList(): void {
    this.listLoading = true;
    const params = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: "",
      Direction: "asc" // "asc" or "desc"
    };

    this.cashReceiptService.getCashReceiptMaster().subscribe(
      res => {
        this.listLoading = true;

        //mapping the data to change string date format to Date
        const sampleData = res.map(
          dataItem =>
            <CashReceiptMaster>{
              ID: dataItem.ID,
              SeriesID: dataItem.SeriesID,
              SeriesName: dataItem.SeriesName,
              LedgerID: dataItem.LedgerID,
              LedgerName: dataItem.LedgerName,
              VoucherNo: dataItem.VoucherNo,
              CashReceiptDate: this.parseAdjust(dataItem.CashReceiptDate),
              ProjectID: dataItem.ProjectID,
              ProjectName: dataItem.ProjectName,
              Fields: {
                Field1: dataItem.Fields.Field1,
                Field2: dataItem.Fields.Field2,
                Field3: dataItem.Fields.Field3,
                Field4: dataItem.Fields.Field4,
                Field5: dataItem.Fields.Field5
              },
              IsPayByInvoice: dataItem.IsPayByInvoice,
              TotalAmount: dataItem.TotalAmount,
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

  public filterChange(filter): void {
    this.filter = filter;

    this.getCashReceiptlList();
  }

  public searchForm() {
    this.getCashReceiptlList();
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
    this.getCashReceiptlList();
  }

  public edit(item): void {
    this.router.navigate(["/cash/edit", item.ID]);
  }

  onCheckChange(event) {
    // const formArray: FormArray = this.myForm.get('myChoices') as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      //   formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      // formArray.controls.forEach((ctrl: FormControl) => {
      //   if(ctrl.value == event.target.value) {
      //     // Remove the unselected element from the arrayForm
      //     formArray.removeAt(i);
      //     return;
      //   }

      i++;
    }
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
    this.toastr.success("Cash deleted successfully");
    //call Delete Api
  }
}
