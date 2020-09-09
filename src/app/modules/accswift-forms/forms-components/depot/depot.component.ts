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
    <select
      class="form-control"
      [formControl]="DepotID"
      accSwiftFormValidator
      (change)="depotValueChange($event.target.value)"
    >
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
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get value(): number {
    return this.DepotID.value;
  }

  set value(value: number) {
    this.DepotID.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: (_: number | null) => void): void {
    this.onChange = (value) => {
      fn(value == "" ? null : parseInt(value));
    };
  }

  depotValueChange(value: number) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: number) {
    if (value) {
      this.value = value;
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
