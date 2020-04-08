import {
  Directive,
  ElementRef,
  HostListener,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  Self,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
  selector: "[formControlName][accSwiftDecimalPlace]",
  providers: [
    DecimalPlaceDirective,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DecimalPlaceDirective),
      multi: true,
    },
  ],
})
export class DecimalPlaceDirective implements ControlValueAccessor {
  @Input() nepaleseCurrencyInput: string;
  @Output() nepaleseCurrencyInputChange: EventEmitter<
    string
  > = new EventEmitter<string>();

  _onChange: (_: any) => void;
  _touched: () => void;
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = [
    "Backspace",
    "Tab",
    "End",
    "Home",
    "-",
    "ArrowLeft",
    "ArrowRight",
    "Del",
    "Delete",
  ];
  constructor(@Self() private el: ElementRef, private _renderer: Renderer2) {
    // this.el.nativeElement.value = parseFloat(
    //   this.el.nativeElement.value
    // ).toFixed(2);
  }
  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [
      current.slice(0, position),
      event.key == "Decimal" ? "." : event.key,
      current.slice(position),
    ].join("");
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  /** Implementation for ControlValueAccessor interface */
  writeValue(value: any): void {
    console.log("value" + this.el.nativeElement.value);

    this.el.nativeElement.value = parseFloat(
      this.el.nativeElement.value
    ).toFixed(2);
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnTouched(fn: () => void): void {
    this._touched = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this.el.nativeElement, "disabled", isDisabled);
  }
}
