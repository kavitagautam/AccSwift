import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  forwardRef
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormGroup,
  FormControl,
  Validator,
  Validators,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";

@Component({
  selector: "accSwift-product-more-detail",
  templateUrl: "./product-more-detail.component.html",
  styleUrls: ["./product-more-detail.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductMoreDetailComponent),
      multi: true
    }
  ]
})
export class ProductMoreDetailComponent
  implements OnInit, ControlValueAccessor {
  @Output() formReady = new EventEmitter<FormGroup>();
  productMoreDetailsForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildProductMoreDetailsForm();
  }

  buildProductMoreDetailsForm(): void {
    this.productMoreDetailsForm = this._fb.group({
      contactPerson: [""],
      address1: [""],
      address2: [""],
      city: ["", Validators.required],
      telephone: ["", Validators.required],
      email: [""],
      company: [""],
      webSite: [""]
    });
  }

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.productMoreDetailsForm.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: any): void {
    console.log("on change");
    this.productMoreDetailsForm.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.productMoreDetailsForm.disable()
      : this.productMoreDetailsForm.enable();
  }
  save(): void {
    //this.formReady.emit(this.productMoreDetailsForm);
  }
  cancel(event): void {}
}
