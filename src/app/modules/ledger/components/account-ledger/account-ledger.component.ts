import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChange
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";
import { LedgerDetails } from "../../models/ledger.models";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-account-ledger",
  templateUrl: "./account-ledger.component.html",
  styleUrls: ["./account-ledger.component.scss"]
})
export class AccountLedgerComponent implements OnInit, OnChanges {
  @ViewChild("openingBalanceModal") openingBalanceModal: ElementRef;
  @ViewChild("previousYearBalanceModal") previousYearBalanceModal: ElementRef;
  @Input("selectedItem") selectedItem;
  date: Date = new Date();
  selectedLedgerId: number;
  accoutLedgerForm: FormGroup;
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
    ignoreBackdropClick: true
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

  public balanceType: Array<{ type: string; id: number }> = [
    { type: "DEBIT", id: 1 },
    { type: "CREDIT", id: 2 }
  ];

  getLedgerDetails(): void {
    this.ledgerService
      .getLedgerDetails(this.selectedLedgerId)
      .subscribe(res => {
        this.ledgerDetails = res.Entity;
        this.buildAccountLedgerForm();
      });
  }

  buildAccountLedgerForm(): void {
    this.accoutLedgerForm = this._fb.group({
      ledgerCode: [
        this.ledgerDetails ? this.ledgerDetails.LedgerCode : "",
        Validators.required
      ],
      ledgerName: [
        this.ledgerDetails ? this.ledgerDetails.Name : "",
        Validators.required
      ],
      groupID: [this.ledgerDetails ? this.ledgerDetails.GroupID : null],
      remarks: [this.ledgerDetails ? this.ledgerDetails.Remarks : ""],
      currency: [this.ledgerDetails ? this.ledgerDetails.Currency : ""],
      date: [this.ledgerDetails ? new Date() : ""],
      openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()]),
      previousYearBalanceList: this._fb.array([
        this.addPreviousYearBalanceFormGroup()
      ]),
      moreDetails: new FormControl("")
    });
  }

  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      ID: [""],
      accountClassId: [
        this.ledgerService.accountClass
          ? this.ledgerService.accountClass[0].ID
          : null
      ],
      accountClassName: [
        {
          value: this.ledgerService.accountClass
            ? this.ledgerService.accountClass[0].Name
            : "",
          disabled: true
        }
      ],
      openingBalance: [
        this.ledgerDetails ? this.ledgerDetails.OpeningBalance.OpenBal : ""
      ],
      balanceType: [
        this.ledgerDetails ? this.ledgerDetails.OpeningBalance.OpenBalDrCr : ""
      ]
    });
  }

  addPreviousYearBalanceFormGroup(): FormGroup {
    return this._fb.group({
      PreviousYearBalanceDebitCredit: [
        this.ledgerDetails
          ? this.ledgerDetails.PreviousYearBalanceDebitCredit
          : ""
      ],
      PreviousYearBalance: [
        this.ledgerDetails ? this.ledgerDetails.PreviousYearBalance : ""
      ]
    });
  }

  get getOpeningBalanceList(): FormArray {
    return <FormArray>this.accoutLedgerForm.get("openingBalanceList");
  }

  get getPreviousYearBalanceList(): FormArray {
    return <FormArray>this.accoutLedgerForm.get("previousYearBalanceList");
  }

  openModal(index: number): void {}

  save(): void {
    const openingBalanceArray = <FormArray>(
      this.accoutLedgerForm.get("openingBalanceList")
    );
    const previousYearBalanceArray = <FormArray>(
      this.accoutLedgerForm.get("previousYearBalanceList")
    );
    const moreDetails = <FormArray>this.accoutLedgerForm.get("moreDetails");

    if (this.addMode) {
      if (this.accoutLedgerForm.invalid) return;

      const obj = {
        LedgerCode: this.accoutLedgerForm.get("ledgerCode").value,
        Name: this.accoutLedgerForm.get("ledgerName").value,
        PreviousYearBalance: previousYearBalanceArray.controls[0].get(
          "PreviousYearBalance"
        ).value,
        PreviousYearBalanceDebitCredit: previousYearBalanceArray.controls[0].get(
          "PreviousYearBalanceDebitCredit"
        ).value,
        DrCr: "DR",
        GroupID: this.accoutLedgerForm.get("groupID").value,
        OpCCYID: 1,
        PersonName: moreDetails ? moreDetails.get("PersonName") : "",
        Address1: moreDetails ? moreDetails.get("Address1") : "",
        Address2: moreDetails ? moreDetails.get("Address2") : "",
        City: moreDetails ? moreDetails.get("City") : "",
        Phone: moreDetails ? moreDetails.get("Phone") : "",
        Email: moreDetails ? moreDetails.get("Email") : "",
        Company: moreDetails ? moreDetails.get("Company") : "",
        Website: moreDetails ? moreDetails.get("Website") : "",
        VatPanNo: moreDetails ? moreDetails.get("VatPanNo") : "",
        CreditLimit: moreDetails ? moreDetails.get("CreditLimit") : 0,
        IsActive: moreDetails ? moreDetails.get("IsActive") : false,
        OpeningBalance: {
          ID: openingBalanceArray.controls[0].get("ID").value,
          AccClassID: openingBalanceArray.controls[0].get("accountClassId")
            .value,
          OpenBal: openingBalanceArray.controls[0].get("openingBalance").value,
          OpenBalDrCr: openingBalanceArray.controls[0].get("balanceType").value
        },
        Remarks: this.accoutLedgerForm.get("remarks").value
      };
      this.ledgerService.addLedgerAccount(obj).subscribe(
        response => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Ledger Account added successfully");
        }
      );
    } else {
      const obj = {
        ID: this.ledgerDetails.ID,
        LedgerCode: this.accoutLedgerForm.get("ledgerCode").value,
        Name: this.accoutLedgerForm.get("ledgerName").value,
        PreviousYearBalance: previousYearBalanceArray.controls[0].get(
          "PreviousYearBalance"
        ).value,
        PreviousYearBalanceDebitCredit: previousYearBalanceArray.controls[0].get(
          "PreviousYearBalanceDebitCredit"
        ).value,
        DrCr: "DR",
        GroupID: 1,
        OpCCYID: 1,
        PersonName: moreDetails ? moreDetails.get("PersonName") : "",
        Address1: moreDetails ? moreDetails.get("Address1") : "",
        Address2: moreDetails ? moreDetails.get("Address2") : "",
        City: moreDetails ? moreDetails.get("City") : "",
        Phone: moreDetails ? moreDetails.get("Phone") : "",
        Email: moreDetails ? moreDetails.get("Email") : "",
        Company: moreDetails ? moreDetails.get("Company") : "",
        Website: moreDetails ? moreDetails.get("Website") : "",
        VatPanNo: moreDetails ? moreDetails.get("VatPanNo") : "",
        CreditLimit: moreDetails ? moreDetails.get("CreditLimit") : 0,
        IsActive: moreDetails ? moreDetails.get("IsActive") : false,
        OpeningBalance: {
          ID: openingBalanceArray.controls[0].get("ID").value,
          AccClassID: openingBalanceArray.controls[0].get("accountClassId")
            .value,
          OpenBal: openingBalanceArray.controls[0].get("openingBalance").value,
          OpenBalDrCr: openingBalanceArray.controls[0].get("balanceType").value
        },
        Remarks: this.accoutLedgerForm.get("remarks").value
      };
      this.ledgerService.updateLedgerAccount(obj).subscribe(
        response => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Ledger Account edited successfully");
        }
      );
    }
  }

  cancel(event): void {}

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
    this.modalRef.content.onClose.subscribe(confirm => {
      if (confirm) {
        this.deleteAccountLedgertByID(this.selectedLedgerId);
      }
    });
  }

  public deleteAccountLedgertByID(id): void {
    this.ledgerService.deleteLedgerById(id).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error => {
        this.toastr.success(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product deleted successfully");
      }
    );
  }
}
