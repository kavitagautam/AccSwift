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
      *ngIf="IsAutomatic"
      style="
      top: 32px;
      margin-left: 172px;
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
  @Input("seriesID") seriesID;
  IsAutomatic: boolean;
  constructor(private formService: FormsService) {
    this.subscriptions.push(
      this.VoucherNo.valueChanges.subscribe((value: number) => {
        this.registerOnChange(value);
        this.onTouched();
      })
    );
    console.log("series " + this.seriesID);

    formService.seriesSelect$.subscribe((value) => {
      this.seriesID = value;
      this.seriesValueChange(value);
    });
    this.seriesValueChange(this.seriesID);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngOnChanges(changes): void {
    console.log("changes :: " + changes);
    console.log("series " + this.seriesID);
  }

  seriesValueChange(value): void {
    if (value) {
      this.formService
        .getVoucherNoWithSeriesChange(value)
        .subscribe((response) => {
          this.VoucherNo.setValue(response.VoucherNO);
          if (response.IsEnabled) {
            this.VoucherNo.enable();
          } else {
            this.VoucherNo.disable();
          }
          if (response.VoucherNoType === "Automatic") {
            this.IsAutomatic = true;
          }
        });
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
      this.formService.seriesSelect$.subscribe((res) => {
        console.log("dsd" + res);
        this.seriesID = res;
        this.seriesValueChange(res);
      });
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
