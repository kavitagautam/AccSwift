import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { LedgerService } from "../../services/ledger.service";
import { Router } from "@angular/router";
import { LedgerDetails } from "../../models/ledger.models";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ConfirmationDialogComponent } from "@app/shared/components/confirmation-dialog/confirmation-dialog.component";
import { ToastrService } from "ngx-toastr";
import { LedgerGroup } from "@accSwift-modules/ledger/models/ledger-group.model";

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
  ledgerGroup: LedgerGroup[] = [];
  suggestCodeList = [];
  private editedRowIndex: number;
  balanceDrCr: string;
  modalRef: BsModalRef;
  modelRefSubLedger: BsModalRef;
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
    this.getLedgerGroup();
    if (this.selectedItem == null) {
      this.editMode = false;
      this.addMode = true;
      this.title = "Add ";
      this.addAccountLedger();
      this.suggestCode();
    } else {
      this.editMode = true;
      this.addMode = false;
      this.title = "Edit ";
      this.getLedgerDetails();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      if (this.selectedItem) {
        this.selectedLedgerId = this.selectedItem.ID;
        if (this.selectedLedgerId && this.selectedItem.TypeOf == 1) {
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

  getLedgerGroup(): void {
    this.ledgerService.getLedgerGroupList().subscribe((response) => {
      this.ledgerGroup = response.Entity;
    });
  }

  getLedgerDetails(): void {
    this.ledgerService
      .getLedgerDetails(this.selectedItem.ID)
      .subscribe((res) => {
        this.ledgerDetails = res.Entity;
        this.setOpeningBalanceList();
        this.setSubLedgerList();
        this.accountLedgerForm.patchValue(this.ledgerDetails);
        this.selectedLedgerId = this.ledgerDetails.ID;
        this.balanceDrCr = this.ledgerDetails.DrCr == "DR" ? "DEBIT" : "CREDIT";
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
      CreditLimit: [0],
      IsActive: [true],
      OpeningBalance: this._fb.array([this.addOpeningBalanceFormGroup()]),
      SubLedgerList: this.setMultipleSubLedger(),
      Remarks: [this.ledgerDetails ? this.ledgerDetails.Remarks : ""],
    });
  }

  get getOpeningBalanceList(): FormArray {
    return <FormArray>this.accountLedgerForm.get("OpeningBalance");
  }

  get getSubLedgerList(): FormArray {
    return <FormArray>this.accountLedgerForm.get("SubLedgerList");
  }

  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      AccClassID: [
        this.ledgerService.accountClass.length > 0
          ? this.ledgerService.accountClass[0].ID
          : null,
        Validators.required,
      ],
      OpenBal: [0],
      OpenBalDrCr: [this.balanceDrCr ? this.balanceDrCr : ""],
    });
  }

  setMultipleSubLedger(): FormArray {
    const subLedger = new FormArray([]);
    for (let i = 0; i < 5; i++) {
      subLedger.push(
        this._fb.group({
          LedgerID: [null],
          Name: [""],
          Code: [""],
          LedgerName: [""],
          IsActive: [false],
          IsBuiltIn: [false],
          OpenBalanceSubLedgers: this._fb.array([
            this.addSubLedgerBalanceFormGroup(),
          ]),
          CreatedBy: [""],
          CreatedDate: [new Date()],
          ModifiedBy: [""],
          ModifiedDate: [""],
          Remarks: [""],
        })
      );
    }
    return subLedger;
  }

  addSubLedgerFormGroup(): FormGroup {
    return this._fb.group({
      LedgerID: [null],
      Name: [""],
      Code: [""],
      LedgerName: [""],
      IsActive: [false],
      IsBuiltIn: [false],
      OpenBalanceSubLedgers: this._fb.array([
        this.addSubLedgerBalanceFormGroup(),
      ]),
      CreatedBy: [""],
      CreatedDate: [new Date()],
      ModifiedBy: [""],
      ModifiedDate: [""],
      Remarks: [""],
    });
  }

  addSubLedgerBalanceFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      SubLedgerID: [null],
      AccClassID: [
        this.ledgerService.accountClass.length > 0
          ? this.ledgerService.accountClass[0].ID
          : null,
        Validators.required,
      ],
      OpenBal: [0],
      OpenBalDrCr: [this.balanceDrCr ? this.balanceDrCr : ""],
      OpenBalDate: [new Date()],
      OpenBalCCYID: [""],
    });
  }

  setOpeningBalanceList(): void {
    this.accountLedgerForm.setControl(
      "OpeningBalance",
      this.setOpeningBalanceArray(this.ledgerDetails.OpeningBalance)
    );
  }

  setSubLedgerList(): void {
    this.accountLedgerForm.setControl(
      "SubLedgerList",
      this.setSubLedgerListArray(this.ledgerDetails.SubLedgerList)
    );
  }

  // this block of code is used to show form array data in the template.....
  setOpeningBalanceArray(openingBalance): FormArray {
    const openingList = new FormArray([]);
    if (openingBalance && openingBalance.length > 0) {
      openingBalance.forEach((element) => {
        openingList.push(
          this._fb.group({
            ID: [element.ID],
            AccClassID: [element.AccClassID],
            OpenBal: [element.OpenBal],
            OpenBalDrCr: [element.OpenBalDrCr],
          })
        );
      });
    } else {
      openingList.push(
        this._fb.group({
          ID: [null],
          AccClassID: [
            this.ledgerService.accountClass.length > 0
              ? this.ledgerService.accountClass[0].ID
              : null,
            Validators.required,
          ],
          OpenBal: [0],
          OpenBalDrCr: [this.balanceDrCr ? this.balanceDrCr : ""],
        })
      );
    }
    return openingList;
  }

  // this block of code is used to show form array data in the template.....
  setSubLedgerListArray(subLedgerList): FormArray {
    const subLedger = new FormArray([]);
    if (subLedgerList && subLedgerList.length > 0) {
      subLedgerList.forEach((element) => {
        subLedger.push(
          this._fb.group({
            LedgerID: [element.LedgerID],
            Name: [element.Name],
            Code: [element.Code],
            LedgerName: [element.LedgerName],
            IsActive: [element.IsActive],
            IsBuiltIn: [element.IsBuiltIn],
            OpenBalanceSubLedgers: this.setSubLedgerOpeningBalanceArray(
              element.OpenBalanceSubLedgers
            ),
            CreatedBy: [element.CreatedBy],
            CreatedDate: [element.CreatedDate],
            ModifiedBy: [element.ModifiedBy],
            ModifiedDate: [element.ModifiedDate],
            Remarks: [element.Remarks],
            ID: [element.ID],
            AccClassID: [element.AccClassID],
            OpenBal: [element.OpenBal],
            OpenBalDrCr: [element.OpenBalDrCr],
          })
        );
      });
    } else {
      for (let i = 0; i < 5; i++) {
        subLedger.push(
          this._fb.group({
            LedgerID: [null],
            Name: [""],
            Code: [""],
            LedgerName: [""],
            IsActive: [false],
            IsBuiltIn: [false],
            OpenBalanceSubLedgers: this._fb.array([
              this.addSubLedgerBalanceFormGroup(),
            ]),
            CreatedBy: [""],
            CreatedDate: [new Date()],
            ModifiedBy: [""],
            ModifiedDate: [""],
            Remarks: [""],
          })
        );
      }
    }
    return subLedger;
  }
  // this block of code is used to show form array data in the template.....
  setSubLedgerOpeningBalanceArray(subOpeningBalance): FormArray {
    const subOpeningBlc = new FormArray([]);
    if (subOpeningBalance && subOpeningBalance.length > 0) {
      subOpeningBalance.forEach((element) => {
        subOpeningBlc.push(
          this._fb.group({
            ID: [element.ID],
            AccClassID: [element.AccClassID],
            OpenBal: [element.OpenBal],
            OpenBalDrCr: [element.OpenBalDrCr],
          })
        );
      });
    } else {
      subOpeningBlc.push(
        this._fb.group({
          ID: [null],
          AccClassID: [
            this.ledgerService.accountClass.length > 0
              ? this.ledgerService.accountClass[0].ID
              : null,
            Validators.required,
          ],
          OpenBal: [0],
          OpenBalDrCr: [this.balanceDrCr ? this.balanceDrCr : ""],
        })
      );
    }
    return subOpeningBlc;
  }

  suggestCode(): void {
    this.ledgerService.getSuggestedCode("LEDGER").subscribe((response) => {
      this.suggestCodeList.push({ Code: response.Code, Type: response.Type });
    });
  }

  changeAccountHead(): void {
    const groupId = this.accountLedgerForm.get("GroupID").value;
    const selectedItem = this.ledgerService.ledgerGroupLists.filter(
      (x) => x.ID == groupId
    );
    if (selectedItem && selectedItem[0].DrCr === "DR") {
      this.balanceDrCr = "DEBIT";
    } else {
      this.balanceDrCr = "CREDIT";
    }
    this.accountLedgerForm
      .get("PreviousYearBalanceDebitCredit")
      .setValue(selectedItem[0].DrCr === "DR" ? "DEBIT" : "CREDIT");
    this.accountLedgerForm.get("DrCr").setValue(selectedItem[0].DrCr);
    const openingBalance = <FormArray>(
      this.accountLedgerForm.get("OpeningBalance")
    );
    openingBalance.controls[0].get("OpenBalDrCr").setValue(this.balanceDrCr);
  }

  // Filterable Cash Party Drop-down
  ledgerGroupDDFilter(value): void {
    this.ledgerGroup = this.ledgerService.ledgerGroupLists.filter(
      (s) => s.CodeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
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
    this.modalRef.content.data = "Ledger Account";
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
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Account Ledger deleted successfully");
      }
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    const openingList = <FormArray>this.accountLedgerForm.get("OpeningBalance");
    // Remove the Row
    openingList.removeAt(rowIndex);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.accountLedgerForm.get("OpeningBalance").invalid) return;
    (<FormArray>this.accountLedgerForm.get("OpeningBalance")).push(
      this.addOpeningBalanceFormGroup()
    );
    this.rowSubmitted = false;
    this.rowSubmitted = false;
  }

  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }
}
