import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  SortDescriptor,
  CompositeFilterDescriptor
} from "@progress/kendo-data-query";

import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { CompanyService } from "../../services/company.service";
import { CompanyList } from "../../models/company.model";
@Component({
  selector: "accSwift-list-company",
  templateUrl: "./list-company.component.html",
  styleUrls: ["./list-company.component.scss"]
})
export class ListCompanyComponent implements OnInit {
  companyList: CompanyList[];
  companySearchForm: FormGroup;
  listLoading: boolean;

  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "Name" || "Code",
      dir: "asc"
    }
  ];

  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor; //Muliti Column Filter

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    public _fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.companySearchForm = this._fb.group({
      companyName: [null],
      code: [null],
      address1: [""],
      address2: [""]
    });
    this.getCompanyList();
  }

  public editCompany(item): void {
    this.router.navigate(["/company/edit", item.ID]);
  }

  getCompanyList(): void {
    this.listLoading = true;
    this.companyService.getCompanyList().subscribe(
      res => {
        this.companyList = res.Entity;
        this.gridView = {
          data: this.companyList,
          total: this.companyList.length
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

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.getCompanyList();
  }

  public filterChange(filter): void {
    this.filter = filter;
    for (let i = 0; i < filter.filters.length; i++) {
      if (filter.filters[i].field == "VoucherNo") {
      }
      if (filter.filters[i].field == "ProjectName") {
      }
      if (filter.filters[i].field == "SeriesName") {
      }
    }
    this.getCompanyList();
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
    this.getCompanyList();
  }

  public searchForm(): void {
    this.getCompanyList();
  }

  openConfirmationDialogue(dataItem): void {
    const companyId = {
      id: dataItem.ID
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Company " + dataItem.Name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteCompanyByID(companyId.id);
      }
    });
  }

  public deleteCompanyByID(id): void {
    this.companyService.deleteCompanyById(id).subscribe(response => {
      this.toastr.success("Company deleted successfully");
      this.getCompanyList();
    });
  }
}
