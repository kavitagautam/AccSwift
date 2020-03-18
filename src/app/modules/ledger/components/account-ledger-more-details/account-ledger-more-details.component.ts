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
import { LedgerDetails } from "../../models/ledger.models";

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
  @Input("ledgerDetails") ledgerDetails: LedgerDetails;
  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildLedgerMoreDetailsForm();
  }

  buildLedgerMoreDetailsForm(): void {
    this.ledgerMoreDetailsForm = this._fb.group({
      contactPerson: [this.ledgerDetails ? this.ledgerDetails.PersonName : ""],
      address1: [this.ledgerDetails ? this.ledgerDetails.Address1 : ""],
      address2: [this.ledgerDetails ? this.ledgerDetails.Address2 : ""],
      city: [this.ledgerDetails ? this.ledgerDetails.City : ""],
      telephone: [this.ledgerDetails ? this.ledgerDetails.Phone : ""],
      email: [this.ledgerDetails ? this.ledgerDetails.Email : ""],
      company: [this.ledgerDetails ? this.ledgerDetails.Company : ""],
      webSite: [this.ledgerDetails ? this.ledgerDetails.Website : ""],
      VATPANNo: [this.ledgerDetails ? this.ledgerDetails.VatPanNo : ""],
      autoCalculate: [this.ledgerDetails ? this.ledgerDetails.IsActive : false]
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
}
