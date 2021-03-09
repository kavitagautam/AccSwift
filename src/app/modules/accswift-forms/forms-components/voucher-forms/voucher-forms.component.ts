import {
  Component,
  OnInit,
  forwardRef,
  OnDestroy,
  Input,
  OnChanges,
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  DoCheck,
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
  implements
    ControlValueAccessor,
    OnDestroy,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
  subscriptions: Subscription[] = [];
  VoucherNo = new FormControl("");
  voucherNoType: string = "";

  @Input("series") seriesID;

  constructor(private formService: FormsService) {
    // console.log("Constuctor");
    this.subscriptions.push(
      this.VoucherNo.valueChanges.subscribe((value: string) => {
        this.onChange(value);
        // console.log("subscription");
        this.onTouched();
      })
    );

    // formService.seriesSelect$.subscribe((value) => {
    //   this.seriesID = value;
    //   if (value > 0) {
    //     //  console.log("series Value" + value);
    //     this.seriesValueChange(value);
    //   }
    // });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  ngDoCheck() {
    // console.log("Series Value" + this.seriesID);
    // console.log("Voucher No" + this.VoucherNo.value);
    // console.log("AppComponent: DoCheck");
    // if (this.seriesID && !this.VoucherNo.value) {
    //   this.seriesValueChange(this.seriesID);
    // }
    // this.formService.seriesSelect$.subscribe((value) => {
    //   this.seriesID = value;
    //   if (value > 0) {
    //     this.seriesValueChange(value);
    //   }
    // });
  }

  ngAfterContentInit() {
    //console.log("AppComponent: AfterContentInit");
  }

  ngAfterContentChecked() {
    // console.log("Series Value" + this.seriesID);
    // console.log("Voucher No" + this.VoucherNo.value);
    // console.log("AppComponent:AfterContentChecked");
  }

  ngAfterViewInit() {
    // console.log("Series Value" + this.seriesID);
    // console.log("Voucher No" + this.VoucherNo.value);
    // console.log("AppComponent:AfterViewInit");
  }

  ngAfterViewChecked() {
    // console.log("Series Value" + this.seriesID);
    // console.log("Voucher No" + this.VoucherNo.value);
    // console.log("AppComponent:AfterViewChecked");
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
    console.log(" on Changes ");

    // this.formService.seriesSelect$.subscribe((value) => {
    //   this.seriesID = value;
    //   if (value > 0) {
    //     this.seriesValueChange(value);
    //   }
    // });
    // if (this.seriesID) {
    //   this.seriesValueChange(this.seriesID);
    // }
    // if (this.seriesID && !this.VoucherNo.value) {
    //   this.seriesValueChange(this.seriesID);
    // }
    // this.formService.seriesSelect$.subscribe((value) => {
    //   this.seriesID = value;
    //   if (value > 0) {
    //     this.seriesValueChange(value);
    //   }
    // });
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
