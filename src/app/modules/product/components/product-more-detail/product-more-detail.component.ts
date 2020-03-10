import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "accSwift-product-more-detail",
  templateUrl: "./product-more-detail.component.html",
  styleUrls: ["./product-more-detail.component.scss"]
})
export class ProductMoreDetailComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormGroup>();
  productMoreDetailsForm: FormGroup;
  @Input() productForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    console.log(this.productForm.value);
    this.buildProductMoreDetailsForm();
  }

  buildProductMoreDetailsForm(): void {
    this.productMoreDetailsForm = this._fb.group({
      contactPerson: [""],
      address1: [""],
      address2: [""],
      city: [""],
      telephone: [""],
      email: [""],
      company: [""],
      webSite: [""]
    });
  }
  save(): void {
    this.formReady.emit(this.productMoreDetailsForm);
  }
}
