import { Component, OnInit, OnDestroy, forwardRef } from "@angular/core";
import { FormsService } from "../../services/forms.service";
import { ProjectList } from "../../models/forms-data.model";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "accSwift-project-forms",
  template: `<div class="form-group">
    <label for="project">Project</label>
    <select class="form-control" [formControl]="ProjectID">
      <option [ngValue]="null">Choose Option....</option>
      <option *ngFor="let project of projectList" [value]="project.ID">{{
        project.EngName
      }}</option>
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
  projectList: ProjectList[];

  // get value(): number {
  //   return this.ProjectID.value;
  // }

  // set value(value) {
  //   this.ProjectID.setValue(value);
  //   this.onChange(value);
  //   this.onTouched();
  // }

  constructor(private formService: FormsService) {
    this.formService.getProjectLists().subscribe((response) => {
      this.projectList = response.Entity;
    });

    this.subscriptions.push(
      this.ProjectID.valueChanges.subscribe((value: number) => {
        //  this.onChange(value);
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
