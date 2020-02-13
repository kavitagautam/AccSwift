import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-compound-unit",
  templateUrl: "./compound-unit.component.html",
  styleUrls: ["./compound-unit.component.scss"]
})
export class CompoundUnitComponent implements OnInit {
  compoundUnitForm: FormGroup;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.buildCompoundUnitForm();
  }

  buildCompoundUnitForm() {
    this.compoundUnitForm = this._fb.group({
      firstUnitValue: "",
      firstUnitName: "",
      secondUnitValue: "",
      secondUnitName: ""
    });
  }
}
