import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "accSwift-add-product-group",
  templateUrl: "./add-product-group.component.html",
  styleUrls: ["./add-product-group.component.scss"]
})
export class AddProductGroupComponent implements OnInit {
  addProductGroupForm: FormGroup;
  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildProductGroupForm();
  }

  buildProductGroupForm(): void {
    this.addProductGroupForm = this._fb.group({
      groupName: ["", Validators.required],
      parentGroup: ["", Validators.required],
      remarks: [""]
    });
  }

  save(): void {
    if (this.addProductGroupForm.invalid) return;
  }

  cancel(): void {}
}
