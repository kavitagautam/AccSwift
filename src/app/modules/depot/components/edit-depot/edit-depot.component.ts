import { DepotList } from "./../../models/depot.model";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { DepotService } from "./../../services/depot.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-edit-depot",
  templateUrl: "./edit-depot.component.html",
  styleUrls: ["./edit-depot.component.scss"]
})
export class EditDepotComponent implements OnInit {
  editDepotForm: FormGroup;
  depotDetails: DepotList;

  constructor(
    private _fb: FormBuilder,
    private depotService: DepotService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.buildEditDepotForm();
    this.getIdFromURL();
  }

  buildEditDepotForm(): void {
    this.editDepotForm = this._fb.group({
      depotId: [this.depotDetails ? this.depotDetails.ID : ""],
      depot: [
        this.depotDetails ? this.depotDetails.DepotName : "",
        [Validators.required, Validators.maxLength(20)]
      ],
      city: [this.depotDetails ? this.depotDetails.City : ""],
      telephone: [this.depotDetails ? this.depotDetails.Telephone : ""],
      contact: [this.depotDetails ? this.depotDetails.ContactPerson : ""],
      license: [this.depotDetails ? this.depotDetails.LicenceNo : ""],
      address: [this.depotDetails ? this.depotDetails.DepotAddress : ""],
      postalCode: [this.depotDetails ? this.depotDetails.PostalCode : ""],
      mobile: [this.depotDetails ? this.depotDetails.Mobile : ""],
      regNo: [this.depotDetails ? this.depotDetails.RegNo : ""],
      remarks: [this.depotDetails ? this.depotDetails.Remarks : ""]
    });
  }

  getIdFromURL(): void {
    this.route.paramMap.subscribe(params => {
      const paramsId = +params.get("id");
      if (paramsId) {
        this.depotService.getDepotDetails(paramsId).subscribe(response => {
          this.depotDetails = response.Entity;
          this.buildEditDepotForm();
        });
      }
    });
  }

  public save(): void {
    if (this.editDepotForm.valid) {
      this.depotService.updateDepot(this.editDepotForm.value).subscribe(
        response => {
          this.router.navigate(["/depot"]);
        },
        error => {
          this.toastr.error(JSON.stringify(error.errorMessage));
        },
        () => {
          this.toastr.success("Depot edited successfully");
        }
      );
    } else {
    }
  }

  public cancel(): void {
    this.editDepotForm.reset();
    this.router.navigate(["/depot"]);
  }
}
