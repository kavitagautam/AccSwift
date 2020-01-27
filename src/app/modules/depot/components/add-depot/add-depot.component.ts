import { ToastrService } from "ngx-toastr";

import { Router } from "@angular/router";
import { DepotService } from "./../../services/depot.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "accSwift-add-depot",
  templateUrl: "./add-depot.component.html",
  styleUrls: ["./add-depot.component.scss"]
})
export class AddDepotComponent implements OnInit {
  addDepotForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private depotService: DepotService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildAddDepotForm();
  }

  buildAddDepotForm(): void {
    this.addDepotForm = this._fb.group({
      depot: [""],
      city: [""],
      telephone: [""],
      contact: [""],
      license: [""],
      address: [""],
      postalCode: [""],
      mobile: [""],
      regNo: [""],
      remarks: [""]
    });
  }

  public save(): void {
    if (this.addDepotForm.valid) {
      this.depotService.saveDepot(this.addDepotForm.value).subscribe(
        response => {
          this.router.navigate(["/depot"]);
        },
        error => {
          this.toastr.error(JSON.stringify(error.errorMessage));
        },
        () => {
          this.toastr.success("Depot added successfully");
        }
      );
    } else {
    }
  }

  public cancel(): void {
    this.addDepotForm.reset();
    this.router.navigate(["/depot"]);
  }
}
