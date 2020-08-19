import { Component, forwardRef, OnDestroy } from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  ControlValueAccessor,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { SalesAccounts } from "@app/modules/accswift-shared/models/sales-account.model";
import { FormsService } from "../../services/forms.service";

@Component({
  selector: "accSwift-sales-account",
  template: ` <div class="form-group">
    <label>Sales /A/C <sup>*</sup></label>
    <select class="form-control" [formControl]="SalesLedgerID">
      <option [ngValue]="null">Choose Option....</option>
      <option
        *ngFor="let salesAccount of salesAccountList"
        [ngValue]="salesAccount.LedgerID"
      >
        {{ salesAccount.LedgerName }}
      </option>
    </select>
    <span class="current-balance">Current Amount : {{ currentAmount }}</span>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SalesAccountComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SalesAccountComponent),
      multi: true,
    },
  ],
})
export class SalesAccountComponent implements ControlValueAccessor, OnDestroy {
  currentAmount: string = "0.00";
  subscriptions: Subscription[] = [];
  SalesLedgerID = new FormControl();
  salesAccountList: SalesAccounts[] = [];
  constructor(private formService: FormsService) {
    this.formService.getSalesAccountDD().subscribe((response) => {
      this.salesAccountList = response.Entity;
    });
    this.subscriptions.push(
      this.SalesLedgerID.valueChanges.subscribe((value: number) => {
        this.registerOnChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  changeSalesAccount(ledgerId): void {
    const selectedTaxValue = this.salesAccountList.filter(
      (s) => s.LedgerID === ledgerId
    );
    if (selectedTaxValue) {
      this.currentAmount = selectedTaxValue[0].LedgerBalance;
    }
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: number) {
    this.onChange = fn;
  }

  writeValue(value: number) {
    if (value) {
      this.changeSalesAccount(value);
      this.SalesLedgerID.setValue(value);
    }

    if (value === null) {
      this.SalesLedgerID.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.SalesLedgerID.valid ? null : { profile: { valid: false } };
  }
}
