import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { UnitMaintenanceService } from "../../services/unit-maintenance.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-add-unit-maintenance",
  templateUrl: "./add-unit-maintenance.component.html",
  styleUrls: ["./add-unit-maintenance.component.scss"]
})
export class AddUnitMaintenanceComponent implements OnInit {
  addUnitForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    public unitServices: UnitMaintenanceService
  ) {}

  ngOnInit() {
    this.buildAddUnitForm();
  }

  buildAddUnitForm(): void {
    this.addUnitForm = this._fb.group({
      unit: [""],
      symbol: [""],
      remarks: [""]
    });
  }

  public save(): void {
    if (this.addUnitForm.valid) {
      this.unitServices.saveUnit(this.addUnitForm.value).subscribe(res => {
        console.log("res " + JSON.stringify(res));
        this.router.navigate(["/unit-maintenance"]);
      }),
        error => {
          this.toastr.success("Unauthorized to Add Unit");
        },
        () => {
          this.toastr.success("Units added successfully");
        };
    } else {
      return;
    }
  }

  public cancel(): void {
    this.addUnitForm.reset();
    this.router.navigate(["/unit-maintenance"]);
  }
}
