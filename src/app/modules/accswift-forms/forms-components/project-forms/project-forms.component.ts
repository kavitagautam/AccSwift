import { Component, OnInit, OnDestroy, forwardRef } from "@angular/core";
import { FormsService } from "../../services/forms.service";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  FormBuilder,
} from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "accSwift-project-forms",
  template: ` <div class="form-group">
    <label for="project">Project</label>
    <select
      class="form-control"
      [formControl]="ProjectID"
      accSwiftFormValidator
      (change)="projectChange($event.target.value)"
    >
      <option [ngValue]="null">Choose Option....</option>
      <option
        *ngFor="let project of formService.projectList"
        [ngValue]="project.ID"
      >
        {{ project.EngName }}
      </option>
    </select>
  </div>`,

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectFormsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProjectFormsComponent),
      multi: true,
    },
  ],
})
export class ProjectFormsComponent implements ControlValueAccessor, OnDestroy {
  subscriptions: Subscription[] = [];
  ProjectID = new FormControl();
  constructor(public formService: FormsService) {
    this.subscriptions.push(
      this.ProjectID.valueChanges.subscribe((value: number) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get value(): number {
    return this.ProjectID.value;
  }

  set value(value: number) {
    this.ProjectID.setValue(value);
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

  projectChange(value: number) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: number) {
    if (value) {
      this.value = value;
      this.ProjectID.setValue(value);
    }

    if (value === null) {
      this.ProjectID.reset();
    }
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.ProjectID.valid ? null : { profile: { valid: false } };
  }
}
