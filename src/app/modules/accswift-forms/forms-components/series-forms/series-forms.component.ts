import { Component, OnDestroy, forwardRef, Input, OnInit } from "@angular/core";
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { FormsService } from "../../services/forms.service";
import { Series } from "@accSwift-modules/accswift-shared/models/series.model";
// describes what the return value of the form control will look like

@Component({
  selector: "accSwift-series-forms",
  template: `<div class="form-group">
    <label for="series">Series</label>
    <select
      class="form-control"
      type="number"
      [formControl]="SeriesID"
      (change)="seriesChange($event.target.value)"
    >
      <option [value]="null">Choose Option....</option>
      <option *ngFor="let series of seriesList" [value]="series.ID">
        {{ series.Name }}
      </option>
    </select>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SeriesFormsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SeriesFormsComponent),
      multi: true,
    },
  ],
})
export class SeriesFormsComponent
  implements ControlValueAccessor, OnDestroy, OnInit {
  @Input("voucherType") voucherType: string;
  subscriptions: Subscription[] = [];
  SeriesID = new FormControl();
  seriesList: Series[];

  get value(): number {
    return this.SeriesID.value;
  }

  set value(value: number) {
    this.SeriesID.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(private formSerivice: FormsService) {
    this.subscriptions.push(
      this.SeriesID.valueChanges.subscribe((value: number) => {
        this.formSerivice.seriesSelect(value);
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.formSerivice.getSeriesList(this.voucherType).subscribe((response) => {
      this.seriesList = response.Entity;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(fn: (_: number | null) => void): void {
    this.onChange = (value) => {
      fn(value == "" ? null : parseInt(value));
    };
  }
  seriesChange(value: number) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
  writeValue(value: number) {
    if (value) {
      this.SeriesID.setValue(value);
      this.value = value;
      this.formSerivice.seriesSelect(value);
    }
    if (value === null) {
      this.SeriesID.reset();
      this.formSerivice.seriesSelect(value);
    }
  }

  registerOnTouched(fn: number) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.SeriesID.valid ? null : { profile: { valid: false } };
  }
}
