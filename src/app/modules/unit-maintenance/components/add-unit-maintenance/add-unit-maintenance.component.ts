import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: "accSwift-add-unit-maintenance",
  templateUrl: "./add-unit-maintenance.component.html",
  styleUrls: ["./add-unit-maintenance.component.scss"]
})
export class AddUnitMaintenanceComponent implements OnInit {
  addUnitForm: FormGroup;
  constructor(private _fb: FormBuilder,private router: Router) {}

  ngOnInit() {
    this.buildAddUnitForm();
  }

  buildAddUnitForm(): void {
    this.addUnitForm = this._fb.group({
      unit: [""],
      symbol: [""],
      description: [""]
    });
  }

  public save(): void {
    if (this.addUnitForm.valid) {
      this.router.navigate(["/unit-maintenance"]);
    } else {
    }
  }

  public cancel(): void {
    this.addUnitForm.reset();
    this.router.navigate(["/unit-maintenance"]);
  }
}
