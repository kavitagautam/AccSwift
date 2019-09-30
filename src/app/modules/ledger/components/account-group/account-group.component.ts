import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";
import { GroupDetails } from "../../models/ledger.models";

@Component({
  selector: "app-account-group",
  templateUrl: "./account-group.component.html",
  styleUrls: ["./account-group.component.scss"]
})
export class AccountGroupComponent implements OnInit, OnChanges {
  @Input("selectedItem") selectedItem;
  selectedGroupId: number;
  groupDetails: GroupDetails;
  accountGroupForm: FormGroup;
  constructor(
    public _fb: FormBuilder,
    private ledgerService: LedgerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildAccountGroupForm();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      this.selectedGroupId = this.selectedItem.ID;
    }

    if (this.selectedGroupId) {
      this.getGroupDetails();
    }
  }

  getGroupDetails(): void {
    this.ledgerService.getGroupDetails(this.selectedGroupId).subscribe(res => {
      this.groupDetails = res;
      this.buildAccountGroupForm();
    });
  }

  buildAccountGroupForm(): void {
    this.accountGroupForm = this._fb.group({
      groupCode: [this.groupDetails ? this.groupDetails.LedgerCode : ""],
      groupName: [this.groupDetails ? this.groupDetails.EngName : ""],
      parentGroup: [this.groupDetails ? this.groupDetails.ParentGroup : ""],
      description: [this.groupDetails ? this.groupDetails.Remarks : ""]
    });
  }

  public saveAccountGroup(): void {
    if (this.accountGroupForm.valid) {
      this.router.navigate(["/ledger"]);
    } else {
    }
  }

  public cancelAccountGroup(): void {
    this.accountGroupForm.reset();
    this.router.navigate(["/ledger"]);
  }
}
