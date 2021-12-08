import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  forwardRef,
  Input,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormGroup,
  FormBuilder,
  Validators,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { LedgerDetails } from "../../../ledger/models/ledger.models";

@Component({
  selector: "accSwift-account-ledger-more-details",
  templateUrl: "./account-ledger-more-details.component.html",
  styleUrls: ["./account-ledger-more-details.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountLedgerMoreDetailsComponent),
      multi: true,
    },
  ],
})
export class AccountLedgerMoreDetailsComponent
  implements OnInit, ControlValueAccessor {
  @Output() formReady = new EventEmitter<FormGroup>();
  ledgerMoreDetailsForm: FormGroup;
  @Input("ledgerDetails") ledgerDetails: LedgerDetails;
  @Input("") moreDetailsLedger: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {}

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
