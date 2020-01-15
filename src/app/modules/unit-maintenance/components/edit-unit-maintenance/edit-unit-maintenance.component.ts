import { Component, OnInit } from "@angular/core";
import { UnitMaintenanceService } from "../../services/unit-maintenance.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Units } from "../../models/unit-maintenance.model";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "accSwift-edit-unit-maintenance",
  templateUrl: "./edit-unit-maintenance.component.html",
  styleUrls: ["./edit-unit-maintenance.component.scss"]
})
export class EditUnitMaintenanceComponent implements OnInit {
  unitDetails: Units;
  unitsId: number;
  editUnitForm: FormGroup;
  constructor(
    private _fb: FormBuilder,
    public unitService: UnitMaintenanceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildEditUnitForm();
    this.getIdFromURL();
  }

  getIdFromURL() {
    this.route.paramMap.subscribe(params => {
      this.unitsId = parseInt(params.get("id"));
      if (this.unitsId) {
        this.unitService.getUnitDetails(this.unitsId).subscribe(res => {
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
      remarks: [this.unitDetails ? this.unitDetails.Remarks : ""]
    });
  }

  public save(): void {
    if (this.editUnitForm.valid) {
      this.unitService.updateUnit(this.unitsId, this.editUnitForm.value).subscribe(res=>{
        this.router.navigate(["/unit-maintenance"]);
      }),error =>{
        //
        console.log(error);
      },()=>{
        //
        console.log("success");

      }
    } else {
    }
  }

  public cancel(): void {
    this.editUnitForm.reset();
    this.router.navigate(["/unit-maintenance"]);
  }
}
