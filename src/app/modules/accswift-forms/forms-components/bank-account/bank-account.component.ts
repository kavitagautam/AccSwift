import { Component, OnInit, OnDestroy, forwardRef } from "@angular/core";
import {
  FormControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { FormsService } from "../../services/forms.service";
import { BankAccounts } from "@app/modules/accswift-shared/models/bank-account.model";

@Component({
  selector: "accSwift-bank-account",
  template: ` <div class="form-group">
    <label>Bank Account </label>
    <select
      class="form-control"
      [formControl]="LedgerID"
      (change)="changeAccount(LedgerID.value)"
    >
      <option [ngValue]="null">Choose Option....</option>
      <option *ngFor="let account of bankAccount" [ngValue]="account.LedgerID">
        {{ account.LedgerName }}
      </option>
    </select>
    <span class="current-balance">Current Amount : {{ currentAmount }}</span>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BankAccountComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BankAccountComponent),
      multi: true,
    },
  ],
})
export class BankAccountComponent implements ControlValueAccessor, OnDestroy {
  currentAmount: string = "0.00";
  subscriptions: Subscription[] = [];
  LedgerID = new FormControl();
  bankAccount: BankAccounts[] = [];
  constructor(private formService: FormsService) {
    this.formService.getBankAccounts().subscribe((response) => {
      this.bankAccount = response.Entity;
    });

    this.subscriptions.push(
      this.LedgerID.valueChanges.subscribe((value: number) => {
        this.registerOnChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  changeAccount(ledgerId): void {
    this.formService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: number) {
    this.onChange = fn;
  }

  writeValue(value: number) {
    if (value) {
      this.changeAccount(value);
      this.LedgerID.setValue(value);
    }

    if (value === null) {
      this.LedgerID.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.LedgerID.valid ? null : { profile: { valid: false } };
  }
}
