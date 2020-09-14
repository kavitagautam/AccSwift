import { StateProvince } from "@accSwift-modules/accswift-shared/models/address.model";
import { AddressService } from "@accSwift-modules/accswift-shared/services/address-services/address.service";
import { Component, forwardRef, Input, OnInit } from "@angular/core";
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";

@Component({
  selector: "accSwift-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true,
    },
  ],
})
export class AddressComponent implements OnInit, ControlValueAccessor {
  @Input("") addressForms: FormGroup;
  //@Input("") addressForms: FormGroup;
  stateProvince: StateProvince[] = [];
  constructor(
    private _fb: FormBuilder,
    public addressService: AddressService
  ) {}
  ngOnInit() {}

  public onTouched: () => void = () => {};

  changeCountry(): void {
    console.log(this.addressForms.get("Country").value);
    this.addressService
      .getStateProvince(this.addressForms.get("Country").value)
      .subscribe((response) => {
        this.stateProvince = response.Entity;
      });
  }
  writeValue(val: any): void {
    val && this.addressForms.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.addressForms.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.addressForms.disable() : this.addressForms.enable();
  }
}
