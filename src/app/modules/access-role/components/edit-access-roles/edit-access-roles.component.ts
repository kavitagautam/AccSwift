import { AccessRoles, AccessRolesMin } from '@accSwift-modules/access-role/models/access-role.model';
import { AccessRoleService } from '@accSwift-modules/access-role/services/access-role.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CheckableSettings,
  CheckedState,
  TreeItemLookup,
} from "@progress/kendo-angular-treeview";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'accSwift-edit-access-roles',
  templateUrl: '../common-html/access-role.html',
  styleUrls: ['../common-html/access-role.scss']
})
export class EditAccessRolesComponent implements OnInit {
  
  public accessForm: FormGroup;
  accessRolesMin: AccessRolesMin[]=[];
  accessRoles: AccessRoles;
  treeViewLoading: boolean;
  public checkedKeys: any[] = [];
  public key = "Title";
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
      checkOnClick: this.checkOnClick
    }
  }

  constructor(
    private accessService: AccessRoleService,
    private _fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  
    this.getTreeViewID();

    this.getIdFromRoute();

    this.buildAccessForm();

    this.getAccessRolesDropDown();

    this.treeViewLoading = true;
    this.accessService.getAccessRolesTreeView().subscribe((response)=> {
      this.accessRoleTreeView = response.Tree;
      this.treeViewLoading = false;
    }, 
    (error)=> {
      this.treeViewLoading = false;
    },
    ()=> {
      this.treeViewLoading = false;
    });

  }

  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      console.log(param)
      localStorage.setItem("AccessRoleId", param)
      if (param) {
        this.accessService.getAccessRoleById(param)
          .subscribe((response) => {
            this.accessRoles = response.Entity;
            console.log(JSON.stringify(this.accessRoles))
            if (this.accessRoles) {
              this.assignFormValue();
              this.accessForm.patchValue(this.accessRoles);
              this.setAccessDetailsList();
            }
          });
      }
    });
  }

  getTreeViewID():void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if (param) {
        this.accessService.getAccessRolesTreeViewID(param)
          .subscribe((response) => {
            this.accessRoleTreeView = response.Tree;
            console.log(JSON.stringify(this.accessRoleTreeView))
          });
      }
    });
  }

  getAccessRolesDropDown():void {
    this.accessService.getAccessRoleDropdown().subscribe((response)=> {
      this.accessRolesMin = response.Entity;
    })
  }

  loadTreeView(roles): void {
    this.selectedRoles = roles.ID
    console.log(roles.ID);
    this.accessService.getAccessRolesTreeViewID(this.selectedRoles)
    .subscribe((response) => {
      this.accessRoleTreeView = response.Tree;
      console.log(JSON.stringify(this.accessRoleTreeView))
    });
  }
  
  buildAccessForm(): void 
  {
    this.accessForm = this._fb.group({
      ID: [this.accessRoles ? this.accessRoles.ID: ""],
      Name: [this.accessRoles ? this.accessRoles.Name: ""],
      IsBuiltIn: [this.accessRoles ? this.accessRoles.IsBuiltIn: false],
      AccessRoleDetails:this._fb.array([this.addAccessRoleDetails()]),
      CompanyID: [this.accessRoles ? this.accessRoles.CompanyID: ""],
      Remarks: [this.accessRoles ? this.accessRoles.Remarks: ""]
    })
    console.log(this.accessForm.controls.AccessRoleDetails.value)
  }

  get getAccessRoleDetails():FormArray {
    return <FormArray> this.accessForm.get("AccessRoleDetails");
  }

  addAccessRoleDetails():FormGroup {
    return this._fb.group ({
      ID: [0],
      AccessID: [9],
      RoleID: [""],
      Access: this._fb.array([this.addAccess()]),
    })
  }

  get getAccess():FormArray {
    return <FormArray>this.accessForm.controls.AccessRoleDetails.get("Access");
  }

  addAccess():FormGroup {
    return this._fb.group ({
      ID: [0],
      Name: [""],
      Code: [""],
      ParentID: [0],
      Description: [""]
    })
  }

  assignFormValue(): void {
    this.accessForm.get("ID").setValue(this.accessRoles.ID);
    this.accessForm.get("Name").setValue(this.accessRoles.Name);
    this.accessForm.get("IsBuiltIn").setValue(this.accessRoles.IsBuiltIn);
    this.accessForm.get("CompanyID").setValue(this.accessRoles.CompanyID);
    this.accessForm.get("Remarks").setValue(this.accessRoles.Remarks);
  }


  setAccessDetailsList(): void {
    // this.accessForm.setControl(
    //   "AccessRoleDetails",
    //   this.setAccessDetailsFormArray(this.accessRoles.AccessRoleDetails)
    // );

    (<FormArray>this.accessForm.get("AccessRoleDetails")).push(
      this.addAccessRoleDetails()
    );
  }

  // setAccessDetailsFormArray(accessDetails): FormArray {
  //   const accessFormArray = new FormArray([]);
  //   if (accessDetails && accessDetails.length > 0) {
  //     accessDetails.forEach((element) => {
  //       accessFormArray.push(
  //         this._fb.group({
  //           ID: [element.ID ? element.ID: 0],
  //           AccessID: [element.AccessID ? element.AccessID: ""],
  //           RoleID: [element.RoleID ? element.RoleID: ""],
  //           Access: [element.Access ? element.Access: ""],
  //         })
  //       );
  //     });
  //   } else {
  //     accessFormArray.push(
  //       this._fb.group({
  //         ID: [0],
  //         AccessID: [""],
  //         RoleID: [],
  //         Access: [""],
  //       })
  //     );
  //   }
  //   console.log(accessFormArray.controls[0].value);
  //   return accessFormArray;
  // }

  
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
    this.accessForm.get("ID").setValue(localStorage.getItem("AccessRoleId"));
    const accessArray = <FormArray>(
      this.accessForm.get("AccessRoleDetails")
    );
    for (let i = 0; i < accessArray.length; i++) {
      accessArray.controls[i].get("AccessID").setValue(9);
     }

    this.accessService.updateAccessRoles(this.accessForm.value).subscribe((response)=>
    {
      this.accessRoles = response.Entity;
    },  
    (error) => {
      this.toastr.error(JSON.stringify(error.error.Message));
      this.treeViewLoading = false;
    },
    () => {
      this.toastr.success("Access Roles Updated successfully");
      this.treeViewLoading = false;
    })
  }

  public itemChecked: boolean = false;
  
  public isChecked = (dataItem: any, index: string): CheckedState => {

    if (dataItem.IsChecked) // To show already checked items
    {
      return "checked";
    }
    else if (this.containsItem(dataItem)) // To Add CheckMarks
    {
      return "checked";
    }
    return "none";

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
