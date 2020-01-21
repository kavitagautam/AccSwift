import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "accSwift-edit-product-group",
  templateUrl: "./edit-product-group.component.html",
  styleUrls: ["./edit-product-group.component.scss"]
})
export class EditProductGroupComponent implements OnInit {
  editProductGroupForm: FormGroup;
  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildProductGroupForm();
  }

  buildProductGroupForm(): void {
    this.editProductGroupForm = this._fb.group({
      groupName: ["", Validators.required],
      parentGroup: ["", Validators.required],
      remarks: [""]
    });
  }
  save(): void {
    if (this.editProductGroupForm.invalid) return;
  }

  cancel(): void {}
}
