import {
  Component,
  OnInit,
  forwardRef,
  OnDestroy,
  Input,
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

@Component({
  selector: "accSwift-voucher-forms",
  template: ` <div class="form-group">
    <label>Voucher No. <sup>*</sup></label>
    <input type="text" class="form-control" [formControl]="VoucherNo" />
    <span
      *ngIf="voucherNoType"
      style="
    top: 32px;
    margin-left: 155px;
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
  implements ControlValueAccessor, OnDestroy, OnChanges {
  subscriptions: Subscription[] = [];
  VoucherNo = new FormControl();
  voucherNoType: string = "";

  @Input("series") seriesID;

  constructor(private formService: FormsService) {
    this.subscriptions.push(
      this.VoucherNo.valueChanges.subscribe((value: number) => {
        this.onChange(value);
        this.onTouched();
      })
    );

    formService.seriesSelect$.subscribe((value) => {
      this.seriesID = value;
      if (value > 0) {
        this.seriesValueChange(value);
      }
    });
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

  ngOnChanges(changes): void {
    if (this.seriesID) {
      this.seriesValueChange(this.seriesID);
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
