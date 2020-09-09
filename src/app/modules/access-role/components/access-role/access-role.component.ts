import { Component, OnInit } from "@angular/core";
import {
  CheckableSettings,
  CheckedState,
  TreeItemLookup,
} from "@progress/kendo-angular-treeview";
import { AccessRoleService } from "@accSwift-modules/access-role/services/access-role.service";
import { AccessRoles } from "@accSwift-modules/access-role/models/access-role.model";

@Component({
  selector: "accSwift-access-role",
  templateUrl: "./access-role.component.html",
  styleUrls: ["./access-role.component.scss"],
})
export class AccessRoleComponent implements OnInit {
  public checkedKeys: any[] = [];
  public key = "Title";
  treeViewLoading: boolean;
  accessRoles: AccessRoles[] = [];
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

  constructor(private accessService: AccessRoleService) {}

  ngOnInit() {
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

  onSelect(roles: AccessRoles): void {
    this.treeViewLoading = true;
    this.accessType = roles.Name;
    this.selectedRoles = roles.ID;
    this.accessService.getAccessRolesTreeViewID(this.selectedRoles).subscribe(
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

  public itemChecked: boolean = false;

  public isChecked = (dataItem: any, index: string): CheckedState => {
    if (dataItem.IsChecked) {
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

  save(): void {}
  cancel(): void {}
}
