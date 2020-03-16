import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  forwardRef,
  Input
} from "@angular/core";
import {
  ControlValueAccessor,
  FormGroup,
  FormBuilder,
  Validators,
  NG_VALUE_ACCESSOR
} from "@angular/forms";

@Component({
  selector: "accSwift-account-ledger-more-details",
  templateUrl: "./account-ledger-more-details.component.html",
  styleUrls: ["./account-ledger-more-details.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountLedgerMoreDetailsComponent),
      multi: true
    }
  ]
})
export class AccountLedgerMoreDetailsComponent
  implements OnInit, ControlValueAccessor {
  @Output() formReady = new EventEmitter<FormGroup>();
  ledgerMoreDetailsForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildLedgerMoreDetailsForm();
  }

  buildLedgerMoreDetailsForm(): void {
    this.ledgerMoreDetailsForm = this._fb.group({
      contactPerson: [""],
      address1: [""],
      address2: [""],
      city: ["", Validators.required],
      telephone: ["", Validators.required],
      email: [""],
      company: [""],
      webSite: [""],
      VATPANNo: [""],
      autoCalculate: [false]
    });
  }

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.ledgerMoreDetailsForm.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.ledgerMoreDetailsForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.ledgerMoreDetailsForm.disable()
      : this.ledgerMoreDetailsForm.enable();
  }

  save(): void {
    //this.formReady.emit(this.ledgerMoreDetailsForm);
  }

  cancel(event): void {}
}
