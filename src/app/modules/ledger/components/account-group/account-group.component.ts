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
import { LedgerGroup } from "../../models/ledger.models";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: "accSwift-account-group",
  templateUrl: "./account-group.component.html",
  styleUrls: ["./account-group.component.scss"]
})
export class AccountGroupComponent implements OnInit, OnChanges {
  @Input("selectedItem") selectedItem;
  selectedLedgerGroupId: number;
  ledgerGroupDetails: LedgerGroup;
  accountGroupForm: FormGroup;

  editMode: boolean;
  addMode: boolean;
  title: string;

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    public _fb: FormBuilder,
    public ledgerService: LedgerService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildAccountGroupForm();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      if (this.selectedItem) {
        this.selectedLedgerGroupId = this.selectedItem.ID;
        if (this.selectedLedgerGroupId) {
          this.editMode = true;
          this.addMode = false;
          this.title = "Edit ";
          this.getLedgerGroupDetails();
        } else {
          this.addLedgerGroup();
        }
      }
    }
  }

  getLedgerGroupDetails(): void {
    this.ledgerService
      .getLedgerGroupDetails(this.selectedLedgerGroupId)
      .subscribe(res => {
        this.ledgerGroupDetails = res.Entity;
        this.buildAccountGroupForm();
      });
  }

  buildAccountGroupForm(): void {
    this.accountGroupForm = this._fb.group({
      groupCode: [
        this.ledgerGroupDetails ? this.ledgerGroupDetails.LedgerCode : "",
        Validators.required
      ],
      groupName: [
        this.ledgerGroupDetails ? this.ledgerGroupDetails.Name : "",
        Validators.required
      ],
      parentGroupId: [
        this.ledgerGroupDetails ? this.ledgerGroupDetails.ParentGroupID : null,
        Validators.required
      ],
      description: [
        this.ledgerGroupDetails ? this.ledgerGroupDetails.Remarks : ""
      ]
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

  addLedgerGroup(): void {
    this.ledgerGroupDetails = null;
    this.editMode = false;
    this.addMode = true;
    this.title = "Add Account Group ";
    this.buildAccountGroupForm();
  }

  public deleteLedgerGroupByID(id): void {
    this.ledgerService.deleteLedgerGroupByID(id).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.toastr.success(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Ledger Group deleted successfully");
      }
    );
  }

  deleteLedgerGroup(): void {
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "Ledger group";
    this.modalRef.content.action = "delete ";
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteLedgerGroupByID(this.selectedLedgerGroupId);
      }
    });
  }
}
