import { Component, OnInit, forwardRef, OnDestroy } from "@angular/core";
import { CashParty } from "@accSwift-modules/accswift-shared/models/cash-party.model";
import { FormsService } from "../../services/forms.service";
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormControl,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { CashPartyModalPopupComponent } from "@accSwift-modules/accswift-shared/components/cash-party-modal-popup/cash-party-modal-popup.component";
import { ReloadComponentService } from "@accSwift-modules/accswift-shared/services/reload-component/reload-component.service";


@Component({
  selector: "accSwift-cash-party-account",
  template: ` <div class="form-group" style="margin-bottom:0px !important">
    <div class="col-md-12 p-0">
      <div class="col-md-11 pl-0">
        <label>Cash/ Party /A/C <sup>*</sup></label>
        <!-- <h1>{{this.ledgerName | json}}</h1> -->
        <!-- {{addedLedgerName}} -->
        <!-- <h3>{{this.CashPartyLedgerID.value | json}}</h3> -->
        <kendo-dropdownlist
          class="form-control"
          [data]="cashPartyList"
          [filterable]="true"
          [textField]="'LedgerName'"
          [valueField]="'LedgerID'"
          [(ngModel)]="ledgerName"
          [formControl]="CashPartyLedgerID"
          (filterChange)="cashPartyDDFilter($event)"
          (valueChange)="cashPartyChange(CashPartyLedgerID.value)"
        >
        </kendo-dropdownlist>

        <!-- <ng-select [items]="cashPartyList" 
           bindLabel="LedgerName" 
           bindValue="LedgerID" 
           [(ngModel)]="ledgerName">
        </ng-select> -->
      </div>
      <div class="col-md-1 p-0">
        <a (click)="openCashPartyModel()"
          ><i
            class="fa fa-eye pull-right ledgerSelectIcon"
            style="margin-top: 25px; font-size: 18px;"
            aria-hidden="true"
          ></i>
        </a>
      </div>
      <span class="current-balance">Current Amount : {{ currentAmount }}</span>
    </div>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CashPartyAccountComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CashPartyAccountComponent),
      multi: true,
    },
  ],
})
export class CashPartyAccountComponent
  implements ControlValueAccessor, OnDestroy, OnInit {
  addedLedgerName:any;
  ledger:any;
  ledgerName:any;
  public cashPartyList: CashParty[] = [];
  currentAmount: string = "0.00";
  subscriptions: Subscription[] = [];
  CashPartyLedgerID = new FormControl();
  //Open the Ledger List Modal on PopUp
  modalRef: BsModalRef;
  //  modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    centered: true,
    class: "modal-lg",
  };
  constructor(
    public formService: FormsService,
    private modalService: BsModalService,
    private reloadComponentService: ReloadComponentService
  ) {

  
    this.subscriptions.push(
      this.CashPartyLedgerID.valueChanges.subscribe((value: number) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit() {
    this.getCashPartyLedgerList();
    console.log(localStorage.getItem('addedCashPartyName'));
    this.addedLedgerName = localStorage.getItem('addedCashPartyName');
    this.addedLedger();
    this.reloadComponentService.onDataListen().subscribe((ledger:any)=> {
      this.addedLedger(ledger);
      this.getCashPartyLedgerList();
    });
  }


  getCashPartyLedgerList():void {
    this.formService.getCashPartyAccountDD().subscribe((response) => {
      this.cashPartyList = response.Entity; //Get response after a refresh
    });
  }

  public addedLedger(ledger?):void 
  {
    // this.reloadComponentService.onDataListen().subscribe((ledgerNew:any)=> {
    // })
    // console.log(ledger);
    // this.ledgerName = ledger;
    // console.log(this.ledgerName);
    this.formService.cashPartyList = this.cashPartyList;
    //if (localStorage.getItem('addedCashPartyName'))
    // {
    
    //   this.ledger = this.cashPartyList.filter((s)=> {
    //    console.log("get newly added ledger object to show in dropdown!")
    //    return  s.LedgerName == this.addedLedgerName;
       
    //   }
    //   );
    //   if (this.ledger && this.ledger[0])
    //   {
    //     console.log(this.ledger[0]); 
    //     this.ledgerName = this.ledger[0];
    //   }
    // }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get value(): number {
    return this.CashPartyLedgerID.value;
  }

  set value(value: number) {
    this.CashPartyLedgerID.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  // Filterable Cash Party Drop-down
  cashPartyDDFilter(value): void {
    this.cashPartyList = this.formService.cashPartyList.filter(
      (s) => s.LedgerName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  cashPartyChange(value: number): void {
    const selectedTaxValue = this.formService.cashPartyList.filter(
      (s) => s.LedgerID === value
    );
    if (selectedTaxValue.length > 0) {
      this.currentAmount = selectedTaxValue[0].LedgerBalance;
    }
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  openCashPartyModel(): void {
    this.modalRef = this.modalService.show(
      CashPartyModalPopupComponent,
      this.config
    );
    this.modalRef.content.action = "Select";

    this.modalRef.content.onSelected.subscribe((data) => {
      if (data) {
        // Do After the the sucess
        this.CashPartyLedgerID.setValue(data.LedgerID);
        this.currentAmount = data.LedgerBalance;
      }
    });
    this.modalRef.content.onClose.subscribe((data) => {
      //Do after Close the Modal
    });
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: number) {
    this.onChange = fn;
  }

  writeValue(value: number) {
    if (value) {
      this.cashPartyChange(value);
      this.value = value;
      this.CashPartyLedgerID.setValue(value);
    }

    if (value === null) {
      this.CashPartyLedgerID.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.CashPartyLedgerID.valid ? null : { profile: { valid: false } };
  }
}
