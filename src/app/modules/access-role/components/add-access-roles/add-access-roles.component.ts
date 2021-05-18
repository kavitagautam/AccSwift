import { Component, OnInit } from '@angular/core';
import {
  CheckableSettings,
  CheckedState,
  TreeItemLookup,
} from "@progress/kendo-angular-treeview";
import { AccessRoleService } from "@accSwift-modules/access-role/services/access-role.service";
import { AccessRoles } from "@accSwift-modules/access-role/models/access-role.model";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'accSwift-add-access-roles',
  templateUrl: '../common-html/access-role.html',
  styleUrls: ['../common-html/access-role.scss']
})
export class AddAccessRolesComponent implements OnInit {

  public accessForm: FormGroup
  public checkedKeys: any[] = [];
  public key = "Title";
  treeViewLoading: boolean;
  accessRoles: AccessRoles;
  accessType: string;
  selectedRoles: number;
  accessRoleTreeView: any;
  public enableCheck = true;
  public checkChildren = true;
  public checkParents = true;
  public checkOnClick = false;
  public checkMode: any = "multiple";
  public selectionMode: any = "single";

  public get checkableSettings(): CheckableSettings {
    return {
      checkChildren: this.checkChildren,
      checkParents: this.checkParents,
      enabled: this.enableCheck,
      mode: this.checkMode,
      checkOnClick: this.checkOnClick,
    };
  }

  constructor(
    private accessService: AccessRoleService,
    private _fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildAccessForm();
    
    this.accessService.getAccessRoles().subscribe((response) => {
      this.accessRoles = response.Entity;
    });

    this.treeViewLoading = true;
    this.accessService.getAccessRolesTreeView().subscribe(
      (response) => {
        this.accessRoleTreeView = response.Tree;
        this.treeViewLoading = false;
      },
      (error) => {
        this.treeViewLoading = false;
      },
      () => {
        this.treeViewLoading = false;
      }
    );
  }


  buildAccessForm(): void 
  {
    this.accessForm = this._fb.group({
      ID: [0],
      Name: [""],
      IsBuiltIn: false,
      AccessRoleDetails:[],
      CompanyID: [null],
      Remarks: [""]
    })
  }
  
  get getDeliveryProductList():FormArray {
    return <FormArray> this.accessForm.get("AccessRoleDetails");
  }

  addAccessRoleDetails():FormGroup {
    return this._fb.group ({
      ID: [0],
      AccessID: [""],
      RoleID: [""],
      Access: []
    })
  }

  // onSelect(roles): void {
  //   this.treeViewLoading = true;
  //   this.accessType = roles.Name;
  //   this.selectedRoles = roles.ID;
  //   this.accessService.getAccessRolesTreeViewID(this.selectedRoles).subscribe(
  //     (response) => {
  //       this.accessRoleTreeView = response.Tree;
  //       this.treeViewLoading = false;
  //       console.log(response.Tree)
  //     },
  //     (error) => {
  //       this.treeViewLoading = false;
  //     },
  //     () => {
  //       this.treeViewLoading = false;
  //     }
  //   );
  // }

  saveForm(): void {
    this.treeViewLoading = true;
    // this.accessForm.get("ID").setValue(this.accessRoles.ID);

    const accessArray = <FormArray>(
      this.accessForm.get("AccessRoleDetails")
    );
    for (let i = 0; i < accessArray.length; i++) {
     accessArray.controls[i].get("AccessID").setValue(9);
    }
    this.accessService.addAccessRoles(this.accessForm.value).subscribe((response)=>
    {
      this.accessRoles = response.Entity;
    },  
    (error) => {
      this.toastr.error(JSON.stringify(error.error.Message));
      this.treeViewLoading = false;
    },
    () => {
      this.toastr.success("Access Roles added successfully");
      this.treeViewLoading = false;
    })
  }

  public itemChecked: boolean = false;

  public isChecked = (dataItem: any, index: string): CheckedState => {
    if (dataItem.IsChecked) {
      return "checked";
    }

    return "checked";

    // if (this.isIndeterminate(dataItem.items)) {
    //   return "indeterminate";
    // }

    // return "none";
  };

  private isIndeterminate(items: any[] = []): boolean {
    let idx = 0;
    let item;

    while ((item = items[idx])) {
      if (this.isIndeterminate(item.items) || this.containsItem(item)) {
        return true;
      }

      idx += 1;
    }

    return false;
  }
  private containsItem(item: any): boolean {
    return this.checkedKeys.indexOf(item[this.key]) > -1;
  }

  public handleChecking(itemLookup: TreeItemLookup): void {
    this.checkedKeys = [itemLookup.item.index];
  }


}
