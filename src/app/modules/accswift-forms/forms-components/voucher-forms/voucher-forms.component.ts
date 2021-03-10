import {
  Component,
  OnInit,
  forwardRef,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChange,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FormsService } from "../../services/forms.service";

@Component({
  selector: "accSwift-voucher-forms",
  template: ` <div class="form-group">
    <label>Voucher No. <sup>*</sup></label>
    <input type="text" class="form-control" [formControl]="VoucherNo" />
    <span
      *ngIf="voucherNoType"
      style="
    top: 32px;
    padding:0 10px;
    right:5%;
    display: inline-block;
    position: absolute;
  "
      >({{ voucherNoType }})</span
    >
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VoucherFormsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VoucherFormsComponent),
      multi: true,
    },
  ],
})
export class VoucherFormsComponent
  implements ControlValueAccessor, OnDestroy, OnChanges, OnDestroy {
  subscriptions: Subscription[] = [];
  VoucherNo = new FormControl("");
  voucherNoType: string = "";

  voucherAutoCount: number = 0; // Counter to count the numbers of changes in the component

  @Input("series") seriesID;

  constructor(private formService: FormsService, private router: Router) {
    this.subscriptions.push(
      this.VoucherNo.valueChanges.subscribe((value: string) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get value(): string {
    return this.VoucherNo.value;
  }

  set value(value: string) {
    this.VoucherNo.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    if (!this.router.url.includes("edit")) {
      // For  Route  include Edit routing
      for (let p in changes) {
        let c = changes[p];
        this.seriesID = c.currentValue;
        if (!c.firstChange) {
          // Check If the Change is not first
          this.seriesValueChange(c.currentValue);
        } else {
          this.seriesValueChange(c.currentValue);
        }
      }
    } else {
      // Else block is used for Route Include Add  routing
      for (let p in changes) {
        let c = changes[p];
        this.seriesID = c.currentValue;
        if (c.firstChange) {
          // Check If the Change  first
          if (c.currentValue) {
            this.seriesValueChange(c.currentValue);
          }
        } else {
          this.voucherAutoCount++; // Increment the counter if changes appers
          if (c.currentValue && this.voucherAutoCount > 1) {
            // If Changes current Value  has value and voucher count is greater than 1
            this.seriesValueChange(c.currentValue);
          }
        }
      }
    }
  }

  seriesValueChange(value): void {
    if (value > 0) {
      this.formService
        .getVoucherNoWithSeriesChange(value)
        .subscribe((response) => {
          this.voucherNoType = response.VoucherNoType;
          this.VoucherNo.disable(
            response.IsEnabled ? response.IsEnabled : false
          );
          this.value = response.VoucherNO;
          this.VoucherNo.setValue(response.VoucherNO);
        });
    } else {
      this.VoucherNo.reset();
      this.value = "";
    }
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: string) {
    this.onChange = fn;
  }

  writeValue(value: string) {
    if (value) {
      this.value = value;
      this.VoucherNo.setValue(value);
    }

    if (value === null) {
      this.VoucherNo.reset();
    }
  }

  registerOnTouched(fn: string) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.VoucherNo.valid ? null : { profile: { valid: false } };
  }
}
