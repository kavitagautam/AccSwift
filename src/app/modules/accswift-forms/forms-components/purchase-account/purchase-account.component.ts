import {
  Component,
  OnInit,
  forwardRef,
  OnDestroy,
  OnChanges,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormControl,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { FormsService } from "../../services/forms.service";
import { PurchaseAccounts } from "@accSwift-modules/accswift-shared/models/purchase-account.model";

@Component({
  selector: "accSwift-purchase-account",
  template: ` <div class="form-group">
    <label>Purchase Account </label>
    <select
      class="form-control"
      [formControl]="LedgerID"
      (change)="changePurchaseAccount(LedgerID.value)"
    >
      <option [ngValue]="null">Choose option...</option>
      <option
        *ngFor="let account of purchaseAccountLists"
        [ngValue]="account.LedgerID"
      >
        {{ account.LedgerName }}
      </option>
    </select>
    <span class="current-balance">Current Amount : {{ currentAmount }}</span>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PurchaseAccountComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PurchaseAccountComponent),
      multi: true,
    },
  ],
})
export class PurchaseAccountComponent
  implements ControlValueAccessor, OnDestroy {
  currentAmount: string = "0.00";
  subscriptions: Subscription[] = [];
  LedgerID = new FormControl();
  purchaseAccountLists: PurchaseAccounts[] = [];
  constructor(private formService: FormsService) {
    this.formService.getPurchaseAccounts().subscribe((response) => {
      this.purchaseAccountLists = response.Entity;
    });

    this.subscriptions.push(
      this.LedgerID.valueChanges.subscribe((value: number) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  get value(): number {
    return this.LedgerID.value;
  }

  set value(value: number) {
    this.LedgerID.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  changePurchaseAccount(ledgerId): void {
    this.formService.getLedgerDetails(ledgerId).subscribe((response) => {
      this.currentAmount = response;
    });
    this.value = ledgerId;
    //  this.onChange(ledgerId);
    // this.onTouched();
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: (_: number | null) => void): void {
    this.onChange = (value) => {
      fn(value == "" ? null : parseInt(value));
    };
  }

  writeValue(value: number) {
    if (value) {
      this.value = value;
      this.changePurchaseAccount(value);
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
