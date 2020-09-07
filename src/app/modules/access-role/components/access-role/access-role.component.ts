import { Component, OnInit } from "@angular/core";
import { CheckableSettings } from "@progress/kendo-angular-treeview";
import { Observable, of } from "rxjs";
import { AccessRoles } from "@accSwift-modules/access-role/models/access-role.model";
import { AccessRoleService } from "@accSwift-modules/access-role/services/access-role.service";

@Component({
  selector: "accSwift-access-role",
  templateUrl: "./access-role.component.html",
  styleUrls: ["./access-role.component.scss"],
})
export class AccessRoleComponent implements OnInit {
  public checkedKeys: any[] = ["1"];
  accessRoles: AccessRoles[] = [];
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

    this.accessService.getAccessRolesTreeView().subscribe((response) => {
      this.accessRoleTreeView = response.Tree;
    });
  }

  onSelect(roles: AccessRoles): void {
    this.selectedRoles = roles.ID;
  }
  public data: any[] = [
    {
      text: "Furniture",
      items: [
        { text: "Tables & Chairs" },
        { text: "Sofas" },
        {
          text: "Occasional Furniture",
          items: [
            {
              text: "Decor",
              items: [{ text: "Bed Linen" }, { text: "Curtains & Blinds" }],
            },
          ],
        },
      ],
    },
    { text: "Decor" },
    { text: "Outdoors" },
  ];

  public children = (dataItem: any): Observable<any[]> => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;
}
