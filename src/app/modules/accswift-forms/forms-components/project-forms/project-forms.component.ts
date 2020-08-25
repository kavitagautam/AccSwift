import {
  Component,
  OnInit,
  OnDestroy,
  forwardRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { FormsService } from "../../services/forms.service";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  FormBuilder
} from "@angular/forms";
import { Subscription } from "rxjs";
import { Project } from "@accSwift-modules/accswift-shared/models/project.model";

@Component({
  selector: "accSwift-project-forms",
  template: ` <div class="form-group">
    <label for="project">Project</label>
    <select
      class="form-control"
      type="number"
      [formControl]="ProjectID"
      (change)="projectChange($event.target.value)"
    >
      <option [ngValue]="null">Choose Option....</option>
      <option
        *ngFor="let project of formService.projectList"
        [value]="project.ID"
        >{{ project.EngName }}</option
      >
    </select>
  </div>`,

  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProjectFormsComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProjectFormsComponent,
      multi: true,
    },
  ],
})
export class ProjectFormsComponent implements ControlValueAccessor, OnDestroy {
  ProjectID = new FormControl();
  projectList: Project[];

  subscriptions: Subscription[] = [];

  get value(): number {
    return this.ProjectID.value;
  }

  set value(value: number) {
    this.ProjectID.setValue(value);

    this.onChange(value);
    this.onTouched();
  }

  get ProjectControl() {
    return this.ProjectID;
  }

  constructor(
    private formBuilder: FormBuilder,
    public formService: FormsService
  ) {
    this.subscriptions.push(
      this.ProjectID.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  projectChange(value: number) {
    this.value = value;
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

  writeValue(value: number) {
    if (value) {
      this.value = value;
      this.ProjectID.patchValue(value, { emitEvent: false });
    }

    if (value === null) {
      this.ProjectID;
    }
  }

  registerOnTouched(fn: number) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.ProjectID ? null : { projectID: { valid: false } };
  }
}
