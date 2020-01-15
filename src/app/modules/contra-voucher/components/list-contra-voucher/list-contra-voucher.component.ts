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
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { ContraVoucherMaster } from "../../models/contraVoucher.model";

@Component({
  selector: "accSwift-list-contra-voucher",
  templateUrl: "./list-contra-voucher.component.html",
  styleUrls: ["./list-contra-voucher.component.scss"]
})
export class ListContraVoucherComponent implements OnInit {
  contraVoucherForm: FormGroup;
  public gridView: GridDataResult;
  listLoading: boolean;
  public filter: CompositeFilterDescriptor;
  date: Date = new Date();
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  modalRef: BsModalRef;
  contraVoucherList: ContraVoucherMaster[];

  constructor(
    private fb: FormBuilder,
    public contraVoucherService: ContraVoucherService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.editContraVoucherForm();
    this.getContraVoucherList();
  }

  editContraVoucherForm() {
    this.contraVoucherForm = this.fb.group({
      seriesId: [0],
      projectId: [0],
      cashAccountId: [0],
      voucherNo: [""],
      cashPartyId: [0],
      date: [new Date()]
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
        this.contraVoucherList = res;
        this.gridView = {
          data: this.contraVoucherList,
          total: this.contraVoucherList ? this.contraVoucherList.length : 0
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

  public edit(item): void {
    this.router.navigate(["/contra-voucher/edit", item.ID]);
  }

  openConfirmationDialogue(dataItem): void {
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
    this.toastr.success("Contra Voucher deleted succesfully");
  }
}
