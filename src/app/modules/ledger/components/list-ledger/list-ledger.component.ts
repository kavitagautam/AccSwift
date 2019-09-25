import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupName
} from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";

@Component({
  selector: "app-list-ledger",
  templateUrl: "./list-ledger.component.html",
  styleUrls: ["./list-ledger.component.scss"]
})
export class ListLedgerComponent implements OnInit {
  accountGroupForm: FormGroup;
  accoutLedgerForm: FormGroup;
  ledgerTreeList: any;
  viewMode = "tab1";
  viewModeForm = "tabForm1";
  treeViewLoading: boolean;

  //for Expanding the tree view
  public expandedKeys: any[] = ["0", "0_0"];
  constructor(public _fb: FormBuilder, private ledgerService: LedgerService) {}

  ngOnInit() {
    this.accountGroupForm = this._fb.group({
      groupCode: [""],
      groupName: [""],
      parentGroup: [""],
      description: [""]
    });

    this.accoutLedgerForm = this._fb.group({
      ledgerCode: [""],
      leddgerName: ["", Validators.required],
      accountHead: [""],
      remarks: [""],
      currency: ["", Validators.required],
      date: [""],
      openingBalance: [""],
      previousYearBalance: [""]
    });
    this.treeViewLoading = true;
    this.ledgerService.getLedgerTree().subscribe(
      res => {
        this.ledgerTreeList = res;

        this.treeViewLoading = false;
      },
      error => {
        this.treeViewLoading = false;
      },
      () => {
        this.treeViewLoading = false;
      }
    );
  }
}
