import { Component, OnInit, forwardRef, OnDestroy, Input } from "@angular/core";
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
    <label for="voucher#">Voucher #</label>
    <input class="form-control" [formControl]="VoucherNo" />
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
export class VoucherFormsComponent implements ControlValueAccessor, OnDestroy {
  subscriptions: Subscription[] = [];
  VoucherNo = new FormControl();
  @Input("seriesID") seriesID;
  constructor(private formService: FormsService) {
    // this.formService.getBankAccounts().subscribe((response) => {
    //   this.bankAccount = response.Entity;
    // });
    console.log("SEried ID " + this.seriesID);
    this.subscriptions.push(
      this.VoucherNo.valueChanges.subscribe((value: number) => {
        this.registerOnChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // changeAccount(VocherNo): void {
  //   this.formService.getLedgerDetails(VocherNo).subscribe((response) => {
  //     this.currentAmount = response;
  //   });
  // }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: number) {
    this.onChange = fn;
  }

  writeValue(value: number) {
    if (value) {
      //  this.changeAccount(value);
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
