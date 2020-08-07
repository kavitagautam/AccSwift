import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";
import { LedgerDetails } from "../../models/ledger.models";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-account-ledger",
  templateUrl: "./account-ledger.component.html",
  styleUrls: ["./account-ledger.component.scss"],
})
export class AccountLedgerComponent implements OnInit, OnChanges {
  @ViewChild("openingBalanceModal") openingBalanceModal: ElementRef;
  @ViewChild("previousYearBalanceModal") previousYearBalanceModal: ElementRef;
  @Input("selectedItem") selectedItem;
  date: Date = new Date();
  selectedLedgerId: number;
  accountLedgerForm: FormGroup;
  ledgerDetails: LedgerDetails;

  editMode: boolean;
  addMode: boolean;
  title: string;
  rowSubmitted: boolean;
  submitted: boolean;
  private editedRowIndex: number;

  modalRef: BsModalRef;
  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  constructor(
    private _fb: FormBuilder,
    public ledgerService: LedgerService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.buildAccountLedgerForm();
    if (this.selectedItem == null) {
      this.addAccountLedger();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      if (this.selectedItem) {
        this.selectedLedgerId = this.selectedItem.ID;
        if (this.selectedLedgerId) {
          this.editMode = true;
          this.addMode = false;
          this.title = "Edit ";
          this.getLedgerDetails();
        } else {
          this.addAccountLedger();
        }
      }
    }
  }

  public balanceType: Array<{ type: string; Name: string; id: number }> = [
    { type: "DEBIT", Name: "DEBIT", id: 1 },
    { type: "CREDIT", Name: "CREDIT", id: 2 },
  ];

  getLedgerDetails(): void {
    this.ledgerService
      .getLedgerDetails(this.selectedLedgerId)
      .subscribe((res) => {
        this.ledgerDetails = res.Entity;
        // this.accountLedgerForm.setControl(
        //   "OpeningBalance",
        //   this.ledgerDetails.OpeningBalance
        // );
        //this.accountLedgerForm.patchValue(this.ledgerDetails);
        this.buildAccountLedgerForm();
      });
  }

  buildAccountLedgerForm(): void {
    this.accountLedgerForm = this._fb.group({
      ID: [this.ledgerDetails ? this.ledgerDetails.ID : null],
      LedgerCode: [
        this.ledgerDetails ? this.ledgerDetails.LedgerCode : "",
        Validators.required,
      ],
      Name: [
        this.ledgerDetails ? this.ledgerDetails.Name : "",
        Validators.required,
      ],
      PreviousYearBalance: [
        this.ledgerDetails ? this.ledgerDetails.PreviousYearBalance : 0,
      ],
      PreviousYearBalanceDebitCredit: [
        this.ledgerDetails
          ? this.ledgerDetails.PreviousYearBalanceDebitCredit
          : "",
      ],
      Currency: [this.ledgerDetails ? this.ledgerDetails.Currency : ""],
      DrCr: [this.ledgerDetails ? this.ledgerDetails.DrCr : ""],
      GroupID: [this.ledgerDetails ? this.ledgerDetails.GroupID : null],
      PersonName: [this.ledgerDetails ? this.ledgerDetails.PersonName : ""],
      Address1: [this.ledgerDetails ? this.ledgerDetails.Address1 : ""],
      Address2: [this.ledgerDetails ? this.ledgerDetails.Address2 : ""],
      City: [this.ledgerDetails ? this.ledgerDetails.City : ""],
      Phone: [this.ledgerDetails ? this.ledgerDetails.Phone : ""],
      Email: [this.ledgerDetails ? this.ledgerDetails.Email : ""],
      Company: [this.ledgerDetails ? this.ledgerDetails.Company : ""],
      Website: [this.ledgerDetails ? this.ledgerDetails.Website : ""],
      VatPanNo: [this.ledgerDetails ? this.ledgerDetails.VatPanNo : ""],
      CreditLimit: [this.ledgerDetails ? this.ledgerDetails.CreditLimit : ""],
      IsActive: [this.ledgerDetails ? this.ledgerDetails.IsActive : ""],
      OpeningBalance: this._fb.group({
        ID: [this.ledgerDetails ? this.ledgerDetails.OpeningBalance.ID : null],
        AccClassID: [
          this.ledgerService.accountClass.length > 0
            ? this.ledgerService.accountClass[0].ID
            : null,
        ],
        OpenBal: [
          this.ledgerDetails ? this.ledgerDetails.OpeningBalance.OpenBal : 0,
        ],
        OpenBalDrCr: [
          this.ledgerDetails
            ? this.ledgerDetails.OpeningBalance.OpenBalDrCr
            : "",
        ],
      }),
      Remarks: [this.ledgerDetails ? this.ledgerDetails.Remarks : ""],
    });
  }

  changeAccountHead(): void {
    const groupId = this.accountLedgerForm.get("GroupID").value;
    const selectedItem = this.ledgerService.ledgerGroupLists.filter(
      (x) => x.ID == groupId
    );
    this.accountLedgerForm
      .get("PreviousYearBalanceDebitCredit")
      .setValue(selectedItem[0].DrCr === "DR" ? "DEBIT" : "CREDIT");
    this.accountLedgerForm.get("DrCr").setValue(selectedItem[0].DrCr);
    this.accountLedgerForm
      .get("OpeningBalance")
      .get("OpenBalDrCr")
      .setValue(selectedItem[0].DrCr === "DR" ? "DEBIT" : "CREDIT");
  }

  save(): void {
    if (this.addMode) {
      if (this.accountLedgerForm.invalid) return;

      this.ledgerService
        .addLedgerAccount(this.accountLedgerForm.value)
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
            this.toastr.success("Ledger Account added successfully");
          }
        );
    } else {
      this.ledgerService
        .updateLedgerAccount(this.accountLedgerForm.value)
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
            this.toastr.success("Ledger Account edited successfully");
          }
        );
    }
  }

  addNewLedger(): void {
    this.addMode = true;
    this.editMode = false;
    this.title = "Add New Ledger ";
    this.accountLedgerForm.reset();
    this.accountLedgerForm
      .get("GroupID")
      .setValue(this.ledgerDetails ? this.ledgerDetails.GroupID : null);
    this.ledgerDetails = null;
  }

  cancel(event): void {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  addAccountLedger(): void {
    this.ledgerDetails = null;
    this.editMode = false;
    this.addMode = true;
    this.title = "Add Account Ledger ";
    this.buildAccountLedgerForm();
  }

  deleteAccountLedger(): void {
    this.modalRef = this.modalService.show(
      ConfirmationDialogComponent,
      this.config
    );
    this.modalRef.content.data = "ledger Account";
    this.modalRef.content.action = "delete";
    this.modalRef.content.onClose.subscribe((confirm) => {
      if (confirm) {
        this.deleteAccountLedgertByID(this.selectedLedgerId);
      }
    });
  }

  public deleteAccountLedgertByID(id): void {
    this.ledgerService.deleteLedgerById(id).subscribe(
      (response) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.toastr.success(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product deleted successfully");
      }
    );
  }
}
