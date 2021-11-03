import { DOCUMENT } from '@angular/common';
import { Component, OnInit, forwardRef, Inject, Input, ElementRef, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl } from "@angular/forms";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { SimpleChanges } from '@angular/core';
import { NepaliDatePickerSettings } from '@accSwift-modules/accswift-shared/models/nepali-date-settings';
declare var jQuery

@Component({
    selector: 'nepali-date-picker',
    templateUrl: 'nepali-date-picker.component.html',
    styleUrls: ['nepali-date-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NepaliDatePickerComponent),
            multi: true
        }
    ],
})
export class NepaliDatePickerComponent implements OnInit, ControlValueAccessor,OnChanges {

    private onChange: (value: string[]) => void = () => { };
    private onTouch: any = () => { };
    @Input() id: string = "";
    @Input() label: string = "";
    @Input() public disableProperty:boolean;
    @Input() public nepaliDatePickerSettings:NepaliDatePickerSettings;
    @Input() disableBefore:string;

    public dateControl = new FormControl();
    constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private document: Document,
    private cdr:ChangeDetectorRef) {

    }

    ngOnInit() {
        this.isNullOrEmpty(this.id);
        this.cdr.detectChanges()

    }
      // "src/assets/js/jquery.min.js",


    ngAfterViewInit() {

        var _this = this;

        jQuery(document).ready(function () {
            jQuery(document).on('click', `#${_this.id}`, function () {
                document.getElementById(`${_this.id}Picker`).focus()
            })
        })

        jQuery(document).ready(function () {
            jQuery(document).on('focus', `#${_this.id}Picker`, function () {
                jQuery(`#${_this.id}Picker`).nepaliDatePicker({
                    // language: "english",
                    language:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.language ? _this.nepaliDatePickerSettings.language:"english",
                    onChange: function () {
                        _this.dateControl.setValue(jQuery(`#${_this.id}Picker`).val());
                        _this.propagateChange(_this.dateControl.value);
                    },
                    // dateFormat: "DD/MM/YYYY",
                    dateFormat:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.dateFormat ? _this.nepaliDatePickerSettings.dateFormat:"YYYY-MM-DD",
                    ndpMonth:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.ndpMonth ? _this.nepaliDatePickerSettings.ndpMonth:false,
                    ndpYear:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.ndpYear ? _this.nepaliDatePickerSettings.ndpYear:false,
                    disableBefore:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.disableBefore ? _this.nepaliDatePickerSettings.disableBefore:null,
                })
            })

        })
    }
    refresh(){
      var _this = this;


        jQuery(document).ready(function () {
            jQuery(document).on('click', `#${_this.id}`, function () {
                document.getElementById(`${_this.id}Picker`).focus()
            })
        })

        jQuery(document).ready(function () {
            jQuery(document).on('focus', `#${_this.id}Picker`, function () {
                jQuery(`#${_this.id}Picker`).nepaliDatePicker({
                    // language: "english",
                    language:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.language ? _this.nepaliDatePickerSettings.language:"english",
                    onChange: function () {
                        _this.dateControl.setValue(jQuery(`#${_this.id}Picker`).val());
                        _this.propagateChange(_this.dateControl.value);
                    },
                    // dateFormat: "DD/MM/YYYY",
                    dateFormat:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.dateFormat ? _this.nepaliDatePickerSettings.dateFormat:"MM/DD/YYYY",
                    disableBefore:_this.disableBefore ? _this.disableBefore :null,
                    ndpMonth:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.ndpMonth ? _this.nepaliDatePickerSettings.ndpMonth:false,
                    ndpYear:_this.nepaliDatePickerSettings&& _this.nepaliDatePickerSettings.ndpYear ? _this.nepaliDatePickerSettings.ndpYear:false,
                })
            })

        })
    }
    ngOnChanges(simpleChanges:SimpleChanges){
      if(simpleChanges['disableBefore']){
        this.refresh();
      }

    }


    writeValue = (obj: any): void => {
        this.dateControl.setValue(obj);
    }

    registerOnChange = (_fn: any): void => {

        this.onChange = _fn;
    }

    registerOnTouched = (_fn: any): void => {
        this.onTouch = _fn;
    }



    private propagateChange = (value: any) => {
        this.onChange(value);
        this.onTouch(value);
        this.elementRef.nativeElement.dispatchEvent(new CustomEvent('change',
            { detail: { 'value': value }, bubbles: true }));


    }



    isNullOrEmpty(val) {
        console.log(val);
        if (typeof val !== "string") {
            throw Error("Invalid Type for Id");
        }

        if (val == "" || val == null || val == undefined) {
            throw Error("Invalid Id");
        }
    }
}
