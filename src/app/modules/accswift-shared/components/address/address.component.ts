import { Country, StateProvince } from "@accSwift-modules/accswift-shared/models/address.model";
import { AddressService } from "@accSwift-modules/accswift-shared/services/address-services/address.service";
import { Component, forwardRef, Input, OnChanges, OnInit } from "@angular/core";
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
export class AddressComponent
  implements OnInit, ControlValueAccessor, OnChanges {
  @Input("") addressForms: FormGroup;
  stateProvince: StateProvince[] = [];
  country: Country[] = [];
  constructor(
    private _fb: FormBuilder,
    public addressService: AddressService
  ) {}

  ngOnInit(): void {
    this.getCountryList();
  }

  ngOnChanges(): void {
    if (this.addressForms.get("CountryID").value !== null) {
      this.changeCountry();
    }
  }

  public onTouched: () => void = () => {};

  changeCountry(): void {
    if (this.addressForms.get("CountryID").value !== null) {
      this.addressService
        .getStateProvince(this.addressForms.get("CountryID").value)
        .subscribe((response) => {
          this.stateProvince = response.Entity;
        });
    }
  }

  getCountryList(): void {
    this.addressService.getCountryLists().subscribe((response) => {
      this.country = response.Entity;
    });
  }

  filterCountry(value):void {
    this.country = this.addressService.countryList.filter(
      (s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
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
