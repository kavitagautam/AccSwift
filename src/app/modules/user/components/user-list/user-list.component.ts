import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "@accSwift-modules/user/services/user.service";
import { PreferenceService } from "../../../preference/services/preference.service";

import {
  SortDescriptor,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { Users } from "@accSwift-modules/user/models/user.model";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  fieldTextType: boolean;
  users: Users[];
  editableForm: boolean = false;
  editMode: boolean = false;
  submitted: boolean;
  submitButton: string;
  modalTitle: string;
  userId: number;
  userForm: FormGroup;
  filterList: Array<any> = [];
  searchFilterList: Array<any> = [];
  unitNameSearchKey = "";
  orderByKey = "";
  dirKey = "asc";
  listLoading: boolean;
  public gridView: GridDataResult;
  public filter: CompositeFilterDescriptor;

  public pageSize = 10;
  public skip = 0;
  public currentPage = 1;

  //sorting kendo data
  public allowUnsort = true;
  public sort: SortDescriptor[] = [
    {
      field: "",
      dir: "asc",
    },
  ];

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    public userService: UserService,
    public preferenceService: PreferenceService,
  ) {}

  ngOnInit() {
    this.getUsers();
    this.buildUserForm();
  }

  buildUserForm(): void {
    this.userForm = this._fb.group({
      Password: ["", Validators.required],
      VerifyPassword: ["", Validators.required],
      UserID: [0],
      UserName: ["", Validators.required],
      Name: ["", Validators.required],
      Address: [""],
      Contact: [""],
      Email: [""],
      Department: [""],
      AccessRoleID: [null, Validators.required],
      AccessRoleName: [""],
      AccClassID: [this.preferenceService.preferences
        ? this.preferenceService.preferences.DEFAULT_ACC_CLASS.Value
        : null,
      Validators.required,],
    
      AccClassName: [""],
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.orderByKey = "";
    this.dirKey = "";
    this.sort = sort;
    this.dirKey = this.sort[0].dir;
    this.orderByKey = this.sort[0].field;
    this.getUsers();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.unitNameSearchKey = "";
    this.filter = filter;
    if (filter.filters.length > 0) {
      const filterArray = [];
      filter.filters.forEach(function (item) {
        filterArray.push({
          Field: item["field"],
          Operator: item["operator"],
          Value: item["value"],
        });
      });
      this.filterList = filterArray;
    } else {
      this.filterList = [];
    }
    this.getUsers();
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
    this.getUsers();
  }

  togglePwFieldType():void {
    this.fieldTextType = !this.fieldTextType;
  }

  getUsers(): void {
    this.listLoading = true;
    const arrayFilter = this.searchFilterList.concat(this.filterList);
    const obj = {
      PageNo: this.currentPage,
      DisplayRow: this.pageSize,
      OrderBy: this.orderByKey,
      Direction: this.dirKey,
      FilterList: arrayFilter,
    };

    this.userService.getUser(obj).subscribe(
      (response) => {
        this.users = response.Entity.Entity;
        this.gridView = {
          data: this.users,
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

  openConfirmationDialogue(dataItem): void {
    const userID = {
      id: dataItem.UserID,
    };
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "User" + dataItem.UserName;
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteJournalByID(userID.id);
      }
    });
  }

  // Modal part is started from Here
  openAddModal(template: TemplateRef<any>): void {
    this.editableForm = true;
    this.buildUserForm();
    this.submitButton = "Save ";
    this.modalTitle = "New User";
    this.modalRef = this.modalService.show(template, this.config);
  }

  openEditModal(template: TemplateRef<any>, dataItem): void {
    this.editableForm = true;
    this.editMode = true;
    this.buildUserForm();
    this.submitButton = "Save ";
    this.modalTitle = "Edit " + dataItem.UserName;
    this.userId = dataItem.ID;
    this.userForm.patchValue(dataItem);
    this.modalRef = this.modalService.show(template, this.config);
  }

  onSubmitUser(): void {
    if (this.userForm.invalid) return;
    if (this.editMode === true) {
      this.editUser();
    } else {
      this.addUser();
    }
  }

  public deleteJournalByID(id): void {
    this.userService.deleteUserById(id).subscribe(
      (response) => {
        this.getUsers();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Users deleted successfully");
      }
    );
  }

  editUser(): void {
    this.userService.updateUser(this.userForm.value).subscribe(
      (response) => {
        this.getUsers();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.modalRef.hide();
        this.buildUserForm();
        this.toastr.success("User edited successfully");
      }
    );
  }

  addUser(): void {
    this.userService.saveUser(this.userForm.value).subscribe(
      (response) => {
        this.getUsers();
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.modalRef.hide();
        this.toastr.success("Users added successfully");
      }
    );
    this.getUsers();
  }

  close(): void {
    this.modalRef.hide();
    this.editableForm = false;
    this.buildUserForm();
  }
}
