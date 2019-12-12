import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ContraVoucherService } from "../../services/contra-voucher.service";
import { Router } from "@angular/router";
import { GridDataResult } from "@progress/kendo-angular-grid";
import {
  CompositeFilterDescriptor,
  SortDescriptor
} from "@progress/kendo-data-query";
import { CashPaymentMaster } from "@app/modules/cash-payments/models/cash-payments.model";
import { BsModalRef } from "ngx-bootstrap";

@Component({
  selector: "app-list-contra-voucher",
  templateUrl: "./list-contra-voucher.component.html",
  styleUrls: ["./list-contra-voucher.component.scss"]
})
export class ListContraVoucherComponent implements OnInit {
  contraVoucherForm: FormGroup;
  public gridView: GridDataResult;
  listLoading: boolean;
  contraVoucherMaster: CashPaymentMaster;
  public filter: CompositeFilterDescriptor;
  date: Date = new Date();
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  modalRef: BsModalRef;
  constructor(
    private fb: FormBuilder,

    private router: Router
  ) {}

  ngOnInit() {
    this.editContraVoucherForm();
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

  getContraVoucherList() {}
}
