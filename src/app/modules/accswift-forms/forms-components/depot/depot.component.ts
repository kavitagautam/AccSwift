import { Component, OnDestroy, forwardRef } from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  ControlValueAccessor,
} from "@angular/forms";
import { FormsService } from "../../services/forms.service";
import { Subscription } from "rxjs";

@Component({
  selector: "accSwift-depot",
  template: `<div class="form-group">
    <label>Depot/ Location<sup>*</sup></label>
    <select class="form-control" [formControl]="DepotID" accSwiftFormValidator>
      <option [ngValue]="null">Choose Option....</option>
      <option *ngFor="let depot of formService.depotList" [ngValue]="depot.ID">
        {{ depot.DepotName }}
      </option>
    </select>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DepotComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DepotComponent),
      multi: true,
    },
  ],
})
export class DepotComponent implements ControlValueAccessor, OnDestroy {
  subscriptions: Subscription[] = [];
  DepotID = new FormControl();
  constructor(public formService: FormsService) {
    this.subscriptions.push(
      this.DepotID.valueChanges.subscribe((value: number) => {
        this.registerOnChange(value);
        this.onTouched();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: number) {
    this.onChange = fn;
  }

  writeValue(value: number) {
    if (value) {
      this.DepotID.setValue(value);
    }

    if (value === null) {
      this.DepotID.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.DepotID.valid ? null : { profile: { valid: false } };
  }
}
