import { Component, OnInit } from "@angular/core";
import { UnitMaintenanceService } from "../../services/unit-maintenance.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Units } from "../../models/unit-maintenance.model";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-edit-unit-maintenance",
  templateUrl: "./edit-unit-maintenance.component.html",
  styleUrls: ["./edit-unit-maintenance.component.scss"]
})
export class EditUnitMaintenanceComponent implements OnInit {
  unitDetails: Units;
  editUnitForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public unitService: UnitMaintenanceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildEditUnitForm();
    this.getParambyId();
  }

  getParambyId() {
    this.route.paramMap.subscribe(params => {
      const paramGetId = params.get("id");
      if (paramGetId) {
        this.unitService.getUnitDetails(paramGetId).subscribe(res => {
          this.unitDetails = res;
          this.buildEditUnitForm();
        });
      }
    });
  }

  buildEditUnitForm(): void {
    this.editUnitForm = this._fb.group({
      unit: [this.unitDetails ? this.unitDetails.UnitName : ""],
      symbol: [this.unitDetails ? this.unitDetails.Symbol : ""],
      description: [this.unitDetails ? this.unitDetails.Remarks : ""]
    });
  }

  public save(): void {
    if (this.editUnitForm.valid) {
      this.router.navigate(["/unit-maintenance"]);
    } else {
    }
  }

  public cancel(): void {
    this.editUnitForm.reset();
    this.router.navigate(["/unit-maintenance"]);
  }
}
