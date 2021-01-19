import { Directive } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[formControlName][accSwiftTimezone]",
  host: {
    "(ngModelChange)": "onInputChange($event)",
  },
})
export class TimezoneDirective {
  constructor(public ngControl: NgControl) {}

  onInputChange(value) {
    const now = new Date(value);
    const newDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    this.ngControl.valueAccessor.writeValue(newDate);
  }
}
