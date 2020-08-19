import {
  Component,
  OnInit,
  forwardRef,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
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
      *ngIf="IsAutomatic.value"
      style="
      top: 32px;
      margin-left: 155px;
      display: inline-block;
      position: absolute;
    "
      >Automatic</span
    >
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  IsAutomatic = new FormControl();
  @Input("series") seriesID;

  constructor(private formService: FormsService) {
    this.subscriptions.push(
      this.VoucherNo.valueChanges.subscribe((value: number) => {
        this.registerOnChange(value);
        this.seriesID = null;
        this.IsAutomatic.setValue(true);
        this.onTouched();
      })
    );

    formService.seriesSelect$.subscribe((value) => {
      this.seriesID = value;
      this.seriesValueChange(value);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnChanges(changes): void {
    if (this.seriesID) {
      this.seriesValueChange(this.seriesID);
    }
  }

  seriesValueChange(value): void {
    if (value) {
      this.formService
        .getVoucherNoWithSeriesChange(value)
        .subscribe((response) => {
          this.IsAutomatic.setValue(
            response.VoucherNoType === "Automatic" ? true : false
          );
          this.VoucherNo.setValue(response.VoucherNO);
          if (response.IsEnabled) {
            this.VoucherNo.enable();
          } else {
            this.VoucherNo.disable();
          }
        });
    } else {
      this.VoucherNo.reset();
    }
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: number) {
    this.onChange = fn;
  }

  writeValue(value: number) {
    if (value) {
      this.VoucherNo.setValue(value);
    }

    if (value === null) {
      this.VoucherNo.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.VoucherNo.valid ? null : { profile: { valid: false } };
  }
}
