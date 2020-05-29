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
import { SeriesList } from "../../models/forms-data.model";
// describes what the return value of the form control will look like

@Component({
  selector: "accSwift-series-forms",
  template: `<div class="form-group">
    <label for="series">Series</label>
    <select class="form-control" type="number" [formControl]="SeriesID">
      <option [value]="null">Choose Option....</option>
      <option *ngFor="let series of seriesList" [value]="series.ID">{{
        series.Name
      }}</option>
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
  seriesList: SeriesList[];
  // get value(): number {
  //   return this.SeriesID.value;
  // }

  // set value(value) {
  //   this.SeriesID.setValue(value);
  //   this.onChange(value);
  //   this.onTouched();
  // }

  constructor(private seriesServices: FormsService) {
    this.subscriptions.push(
      this.SeriesID.valueChanges.subscribe((value: number) => {
        this.registerOnChange(value);

        //   this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnInit(): void {
    this.seriesServices
      .getSeriesList(this.voucherType)
      .subscribe((response) => {
        this.seriesList = response.Entity;
      });
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
      this.SeriesID.setValue(value);
    }
    // if (value === null) {
    //   this.SeriesID.reset();
    // }
  }

  registerOnTouched(fn: number) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.SeriesID.valid ? null : { profile: { valid: false } };
  }
}
