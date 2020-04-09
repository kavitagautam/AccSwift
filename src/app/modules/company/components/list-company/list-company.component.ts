import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor } from "@progress/kendo-data-query";

import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { CompanyService } from "../../services/company.service";
import { CompanyList } from "../../models/company.model";
@Component({
  selector: "accSwift-list-company",
  templateUrl: "./list-company.component.html",
  styleUrls: ["./list-company.component.scss"],
})
export class ListCompanyComponent implements OnInit {
  companyList: CompanyList[];
  companySearchForm: FormGroup;
  listLoading: boolean;

  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;

  searchFilterList: Array<any> = [];
  unitNameSearchKey = "";
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

  public gridView: GridDataResult;

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
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
      Name: [""],
      Code: [""],
      Email: [""],
      Address1: [""],
      Address2: [""],
    });
    this.getCompanyList();
  }

  public editCompany(item): void {
    this.router.navigate(["/company/edit", item.ID]);
  }

  getCompanyList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };
    this.companyService.getCompanyList(obj).subscribe(
      (response) => {
        this.companyList = response.Entity.Entity;
        this.gridView = {
          data: this.companyList,
          total: response.Entity.TotalItemsAvailable,
        };
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
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
    this.searchFilterList = [];
    this.currentPage = 1;
    this.skip = 0;
    if (this.companySearchForm.invalid) return;
    for (const key in this.companySearchForm.value) {
      if (this.companySearchForm.value[key]) {
        this.searchFilterList.push({
          Field: key,
          Operator: "contains",
          value: this.companySearchForm.value[key],
        });
      }
    }
    this.getCompanyList();
  }

  openConfirmationDialogue(dataItem): void {
    const companyId = {
      id: dataItem.ID,
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Company " + dataItem.Name;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteCompanyByID(companyId.id);
      }
    });
  }

  public deleteCompanyByID(id): void {
    this.companyService.deleteCompanyById(id).subscribe((response) => {
      this.toastr.success("Company deleted successfully");
      this.getCompanyList();
    });
  }
}
