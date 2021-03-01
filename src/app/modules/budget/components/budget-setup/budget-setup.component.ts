import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  BudgetMinListView,
  BudgetMinListViewRootModel,
  BudgetDetails,
  BudgetDetailsRootModel,
} from "@accSwift-modules/budget/models/budget-model";
import { BudgetService } from "../../services/budget.service";
import { ToastrService } from "ngx-toastr";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { LedgerGroup } from "@accSwift-modules/ledger/models/ledger-group.model";
import { LedgerService } from "@accSwift-modules/ledger/services/ledger.service";
import { LedgerMin } from "@accSwift-modules/ledger/models/ledger.models";

@Component({
  selector: "budget-setup",
  templateUrl: "./budget-setup.component.html",
  styleUrls: ["./budget-setup.component.scss"],
})
export class BudgetSetupComponent implements OnInit {
  @Input("selectedItem") selectedItem;
  selectedBudgetId: number;
  BudgetMinListView: any;
  BudgetDetails: BudgetDetails;
  budgetForm: FormGroup;
  editMode: boolean;
  addMode: boolean;
  modalRef: BsModalRef;

  ledgerGroupList: LedgerGroup[] = [];
  ledgerMinList: LedgerMin[] = [];

  constructor(
    private BudgetService: BudgetService,
    public _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: BsModalService,
    public ledgerService: LedgerService
  ) {}

  ngOnInit() {
    this.buildBudgetForm();
    this.getBudget();
    this.getLedgerGroup();
    this.getLedgerMin();
    this.addMode = true;
    if (this.selectedItem == null) {
      this.editMode = false;
      this.addMode = true;
      this.addBudget();
    } else {
      this.editMode = true;
      this.addMode = false;
      this.getBudgetDetails();
    }
  }

  getBudget(): void {
    this.BudgetService.getBudgetMinListView().subscribe((response) => {
      this.BudgetMinListView = response.Entity;
    });
  }

  getLedgerGroup(): void {
    this.ledgerService.getLedgerGroupList().subscribe((response) => {
      this.ledgerGroupList = response.Entity;
    });
  }

  getLedgerMin(): void {
    this.ledgerService.getLedgerMin().subscribe((response) => {
      this.ledgerMinList = response.Entity;
    });
  }

  getBudgetDetails(): void {
    this.BudgetService.getBudgetDetails(this.selectedItem.ID).subscribe(
      (res) => {
        this.BudgetDetails = res.Entity;
        this.setBudgetAllocationDetails();
        this.setBudgetAllocationMasters();
        this.budgetForm.patchValue(this.BudgetDetails);
        this.selectedBudgetId = this.BudgetDetails.ID;
      }
    );
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let log: string[] = [];
    for (let p in changes) {
      let c = changes[p];
      this.selectedItem = c.currentValue;
      if (this.selectedItem) {
        this.selectedBudgetId = this.selectedItem.ID;
        if (this.selectedBudgetId && this.selectedItem.TypeOf == 1) {
          this.editMode = true;
          this.addMode = false;
          this.getBudgetDetails();
        }
      }
    }
  }

  buildBudgetForm(): void {
    this.budgetForm = this._fb.group({
      ID: [this.BudgetMinListView ? this.BudgetMinListView.ID : null],
      Name: [
        this.BudgetMinListView ? this.BudgetMinListView.Name : "",
        Validators.required,
      ],
      StartDate: [
        this.BudgetMinListView ? this.BudgetMinListView.StartDate : "",
        Validators.required,
      ],
      EndDate: [
        this.BudgetMinListView ? this.BudgetMinListView.EndDate : "",
        Validators.required,
      ],
      Remarks: [this.BudgetDetails ? this.BudgetDetails.Remarks : ""],
      BudgetAllocationMasters: this._fb.array([
        this.budgetAllocationMastersFormGroup(),
      ]),
    });
  }

  get getBudgetAllocationDetails(): FormArray {
    return <FormArray>this.budgetForm.get("BudgetAllocationDetails");
  }

  get getBudgetAllocationMasters(): FormArray {
    return <FormArray>this.budgetForm.get("BudgetAllocationMasters");
  }

  budgetAllocationMastersFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      BudgetID: [null],
      AccountID: [null],
      AccountName: "",
      AccountType: "",
      AllocationAmount: [null],
      BudgetAllocationDetails: this._fb.array([
        this.budgetAllocationDetailsFormGroup(),
      ]),
    });
  }

  budgetAllocationDetailsFormGroup(): FormGroup {
    return this._fb.group({
      ID: [null],
      BudgetMasterID: [null],
      AccClassID: [null],
      AccClassName: "",
      Amount: [null],
    });
  }

  setBudgetAllocationDetails(): void {
    this.budgetForm.setControl(
      "BudgetAllocationDetails",
      this.setBudgetAllocationDetailsArray(
        this.BudgetDetails.BudgetAllocationMasters[1].BudgetAllocationDetails
      )
    );
  }

  setBudgetAllocationMasters(): void {
    this.budgetForm.setControl(
      "BudgetAllocationMasters",
      this.setBudgetAllocationMastersArray(
        this.BudgetDetails.BudgetAllocationMasters
      )
    );
  }

  ledgerGroup = false;
  ledgerGroupChange(event): void {
    console.log("clicked Ledger Group ");
    if (this.ledgerGroup) {
      this.ledgerGroup = false;
    } else {
      this.ledgerGroup = true;
    }
    //this.ledgerGroup = true;
  }

  ledger = false;
  ledgerChange(event): void {
    console.log("clicked Ledger  ");

    if (this.ledger) {
      this.ledger = false;
    } else {
      this.ledger = true;
    }
    ///  this.ledger = true;
  }
  // this block of code is used to show form array data in the template.....
  setBudgetAllocationDetailsArray(budgetAllocationDetails): FormArray {
    const detailsList = new FormArray([]);
    if (budgetAllocationDetails && budgetAllocationDetails.length > 0) {
      budgetAllocationDetails.forEach((element) => {
        detailsList.push(
          this._fb.group({
            ID: [element.ID],
            BudgetMasterID: [element.BudgetMasterID],
            AccClassID: [element.AccClassID],
            AccClassName: [element.AccClassName],
            Amount: [element.Amount],
          })
        );
      });
    } else {
      detailsList.push(
        this._fb.group({
          ID: [null],
          BudgetMasterID: [null],
          AccClassID: [null],
          AccClassName: [""],
          Amount: [null],
        })
      );
    }
    return detailsList;
  }

  // this block of code is used to show form array data in the template.....
  setBudgetAllocationMastersArray(budgetAllocationMasters): FormArray {
    const mastersList = new FormArray([]);
    if (budgetAllocationMasters && budgetAllocationMasters.length > 0) {
      budgetAllocationMasters.forEach((element) => {
        mastersList.push(
          this._fb.group({
            ID: [element.ID],
            BudgetID: [element.BudgetID],
            AccountID: [element.AccountID],
            AccountName: [element.AccountName],
            AccountType: [element.AccountType],
            AllocationAmount: [element.AllocationAmount],
            BudgetAllocationDetails: this.setBudgetAllocationDetailsArray(
              element.BudgetAllocationDetails
            ),
          })
        );
      });
    } else {
      for (let i = 0; i < 5; i++) {
        mastersList.push(
          this._fb.group({
            ID: [null],
            BudgetID: [null],
            AccountID: [null],
            AccountName: [""],
            AccountType: [""],
            AllocationAmount: [null],
            BudgetAllocationDetails: this._fb.array([
              this.budgetAllocationDetailsFormGroup(),
            ]),
          })
        );
      }
    }
    return mastersList;
  }

  public saveBudget(): void {
    if (this.addMode) {
      if (this.budgetForm.invalid) return;

      this.BudgetService.addBudget(this.budgetForm.value).subscribe(
        (response) => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Budget added successfully");
        }
      );
    } else {
      if (this.budgetForm.invalid) return;

      this.BudgetService.updateBudget(this.budgetForm.value).subscribe(
        (response) => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Budget edited successfully");
        }
      );
    }
  }

  public cancelBudget(): void {
    this.BudgetMinListView = null;
    this.buildBudgetForm();
  }

  addBudget(): void {
    this.addMode = true;
    this.editMode = false;
    this.budgetForm.reset();
    this.budgetForm
      .get("ID")
      .setValue(this.BudgetMinListView ? this.BudgetMinListView.ID : null);
    this.BudgetMinListView = null;
  }
}
