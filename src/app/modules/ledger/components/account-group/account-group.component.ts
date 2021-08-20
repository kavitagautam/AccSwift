import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { LedgerGroup } from "../../models/ledger-group.model";

@Component({
  selector: "accSwift-account-group",
  templateUrl: "./account-group.component.html",
  styleUrls: ["./account-group.component.scss"],
})
export class AccountGroupComponent implements OnInit, OnChanges {
  @Input("selectedItem") selectedItem;
  @Input("branchArray") branchArray;
  selectedLedgerGroupId: number;
  ledgerGroupDetails: LedgerGroup;
  accountGroupForm: FormGroup;
  ledgerGroup: LedgerGroup[] = [];
  suggestCodeList = [];
  editMode: boolean;
  addMode: boolean;
  title: string;

  // modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(
    public _fb: FormBuilder,
    public ledgerService: LedgerService,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildAccountGroupForm();
    this.getLedgerGroup();
    this.addMode = true;
    if (this.selectedItem == null) {
      this.editMode = false;
      this.addMode = true;
      this.title = "Add ";
      this.addLedgerGroup();
      this.suggestCode();
    } else {
      this.editMode = true;
      this.addMode = false;
      this.title = "Edit ";
      this.getLedgerGroupDetails();
    }
  }

  getLedgerGroup(): void {
    this.ledgerService.getLedgerGroupList().subscribe((response) => {
      this.ledgerGroup = response.Entity;
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      if (this.selectedItem && this.selectedItem.TypeOf == 0) {
        this.selectedLedgerGroupId = this.selectedItem.ID;
        if (this.selectedLedgerGroupId) {
          this.editMode = true;
          this.addMode = false;
          this.title = "Edit ";
          this.getLedgerGroupDetails();
        } else {
          this.title = "Add ";
          this.addLedgerGroup();
        }
      }
    }
  }

  getLedgerGroupDetails(): void {
    this.ledgerService
      .getLedgerGroupDetails(this.selectedItem.ID)
      .subscribe((res) => {
        this.ledgerGroupDetails = res.Entity;
        this.buildAccountGroupForm();
        this.selectedLedgerGroupId = this.selectedItem.ID;
      });
  }

  buildAccountGroupForm(): void {
    this.accountGroupForm = this._fb.group({
      ID: [this.ledgerGroupDetails ? this.ledgerGroupDetails.ID : null],
      LedgerCode: [
        this.ledgerGroupDetails ? this.ledgerGroupDetails.LedgerCode : "",
        Validators.required,
      ],
      ParentGroupID: [
        {
          value: this.ledgerGroupDetails
            ? this.ledgerGroupDetails.ParentGroupID
            : null,
          disabled: this.ledgerGroupDetails
            ? this.ledgerGroupDetails.IsBuiltIn
            : false,
        },
        Validators.required,
      ],
      Name: [
        this.ledgerGroupDetails ? this.ledgerGroupDetails.Name : "",
        Validators.required,
      ],
      DrCr: [this.ledgerGroupDetails ? this.ledgerGroupDetails.DrCr : ""],
      Remarks: [this.ledgerGroupDetails ? this.ledgerGroupDetails.Remarks : ""],
    });
  }

  suggestCode(): void {
    this.ledgerService.getSuggestedCode("GROUP").subscribe((response) => {
      this.suggestCodeList.push({ Code: response.Code, Type: response.Type });
    });
  }

  changeAccountHead(): void {
    const groupId = this.accountGroupForm.get("ParentGroupID").value;
    const selectedItem = this.ledgerService.ledgerGroupLists.filter(
      (x) => x.ID == groupId
    );
    this.accountGroupForm.get("DrCr").setValue(selectedItem[0].DrCr);
  }

  // Filterable Cash Party Drop-down
  ledgerGroupDDFilter(value): void {
    this.ledgerGroup = this.ledgerService.ledgerGroupLists.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  public saveAccountGroup(): void {
    if (this.addMode) {
      if (this.accountGroupForm.invalid) return;

      this.ledgerService.addLedgerGroup(this.accountGroupForm.value).subscribe(
        (response) => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Ledger Group added successfully");
        }
      );
    } else {
      if (this.accountGroupForm.invalid) return;

      this.ledgerService
        .updateLedgerGroup(this.accountGroupForm.value)
        .subscribe(
          (response) => {
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          },
          (error) => {
            this.toastr.error(JSON.stringify(error.error.Message));
          },
          () => {
            this.toastr.success("Ledger Group edited successfully");
          }
        );
    }
  }

  public cancelAccountGroup(): void {
    this.ledgerGroupDetails = null;
    this.buildAccountGroupForm();
  }

  addLedgerGroup(): void {
    this.addMode = true;
    this.editMode = false;
    this.title = "Add New Group ";
    this.accountGroupForm.reset();
    if (this.selectedLedgerGroupId) {
      this.accountGroupForm
        .get("ParentGroupID")
        .setValue(this.selectedLedgerGroupId);
    } else {
      this.accountGroupForm
        .get("ParentGroupID")
        .setValue(
          this.ledgerGroupDetails ? this.ledgerGroupDetails.ParentGroupID : null
        );
    }
    this.ledgerGroupDetails = null;
  }

  public deleteLedgerGroupByID(id): void {
    this.ledgerService.deleteLedgerGroupByID(id).subscribe(
      (response) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
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
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteLedgerGroupByID(this.selectedLedgerGroupId);
      }
    });
  }

  close():void
  {
    this.modalRef.hide();
    this.modalRef = null;
  }
}
