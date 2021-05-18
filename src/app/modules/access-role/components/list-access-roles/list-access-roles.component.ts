import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { AccessRoleService } from '@accSwift-modules/access-role/services/access-role.service';
import { FormBuilder } from '@angular/forms';
import { AccessRoles } from '@accSwift-modules/access-role/models/access-role.model';

@Component({
  selector: 'accSwift-list-access-roles',
  templateUrl: './list-access-roles.component.html',
  styleUrls: ['./list-access-roles.component.scss']
})
export class ListAccessRolesComponent implements OnInit {

  listLoading: Boolean;
  accessRoles: AccessRoles[];
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;
  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;
  modalRef: BsModalRef;
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

  searchFilterList = [];
  //modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };


  constructor(
    private accessService: AccessRoleService,
    private _fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAccessRoleList();
  }

  getAccessRoleList(): void {
    this.listLoading = true;
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: this.searchFilterList,
    };
    this.accessService.getAccessRolesNavigate(obj).subscribe(
      (response) => {
        this.accessRoles = response.Entity.Entity;
        console.log(JSON.stringify(this.accessRoles))
        this.gridView = {
          data: this.accessRoles,
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
    this.getAccessRoleList();
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
    this.getAccessRoleList();
  }

  edit(item): void
  {
    this.router.navigate(["/access-role/edit", item.ID]);
  }

}