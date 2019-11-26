import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  forwardRef,
  Renderer2,
  Self
} from "@angular/core";
import { CurrencyFormatPipe } from "@app/shared/pipes/currency-format.pipe";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
@Directive({
  selector: "[nepaleseCurrencyInput]",

  providers: [
    CurrencyFormatPipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyDirective),
      multi: true
    }
  ]
})
export class CurrencyDirective implements ControlValueAccessor {
  @Input() nepaleseCurrencyInput: string;
  @Output() nepaleseCurrencyInputChange: EventEmitter<
    string
  > = new EventEmitter<string>();

  _onChange: (_: any) => void;
  _touched: () => void;

  constructor(
    @Self() private el: ElementRef,
    private currencyPipe: CurrencyFormatPipe,
    private _renderer: Renderer2
  ) {}

  @HostListener("focus", ["$event.target.value", "$event"])
  onFocus(value, event) {
    const onFocusV = this.currencyPipe.revertTransform(value);
    this.el.nativeElement.value = this.currencyPipe.revertTransform(value);
  }

  @HostListener("blur", ["$event.target.value", "$event"])
  onBlur(value, event) {
    //this._onChange(value);
    //this.el.nativeElement.value = this.currencyPipe.transform(value);
    //  const onBlurV = this.currencyPipe.transform(value);
    // console.log("onBlurV value Changed" + onBlurV);

    this._renderer.setProperty(this.el.nativeElement, "value", value);
  }

  @HostListener("change", ["$event.target.value", "$event"])
  onChange(value, event) {
    this._onChange(value);
  }

  @HostListener("keyup", ["$event"]) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  }

  /** Implementation for ControlValueAccessor interface */
  writeValue(value: any): void {
    this.el.nativeElement.value = this.currencyPipe.transform(value);
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
