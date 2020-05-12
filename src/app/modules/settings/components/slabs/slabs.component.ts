import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-slabs",
  templateUrl: "./slabs.component.html",
  styleUrls: ["./slabs.component.scss"],
})
export class SlabsComponent implements OnInit {
  slabsForms: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private settingsService: SettingsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildSlabsForms();
  }

  buildSlabsForms(): void {
    this.slabsForms = this._fb.group({
      DEFAULT_SALES_TAX1CHECK: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_SALES_TAX1CHECK.Value
          : "1",
      ],
      DEFAULT_SALES_TAX1: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_SALES_TAX1.Value
          : "",
      ],
      DEFAULT_SALES_TAX2CHECK: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_SALES_TAX2CHECK.Value
          : "1",
      ],

      DEFAULT_SALES_TAX2: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_SALES_TAX2.Value
          : "",
      ],
      DEFAULT_SALES_TAX3CHECK: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_SALES_TAX3CHECK.Value
          : "1",
      ],

      DEFAULT_SALES_TAX3: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_SALES_TAX3.Value
          : "",
      ],
      DEFAULT_SALES_VAT: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_SALES_VAT.Value
          : "",
      ],
      DEFAULT_PURCHASE_TAX1CHECK: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_PURCHASE_TAX1CHECK.Value
          : "1",
      ],

      DEFAULT_PURCHASE_TAX1: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_PURCHASE_TAX1.Value
          : "",
      ],
      DEFAULT_PURCHASE_TAX2CHECK: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_PURCHASE_TAX2CHECK.Value
          : "1",
      ],

      DEFAULT_PURCHASE_TAX2: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_PURCHASE_TAX2.Value
          : "",
      ],
      DEFAULT_PURCHASE_TAX3CHECK: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_PURCHASE_TAX3CHECK.Value
          : "1",
      ],

      DEFAULT_PURCHASE_TAX3: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_PURCHASE_TAX3.Value
          : "",
      ],
      DEFAULT_PURCHASE_VAT: [
        this.settingsService.settings
          ? this.settingsService.settings.DEFAULT_PURCHASE_VAT.Value
          : "",
      ],
      CUSTOMDUTY: [
        this.settingsService.settings
          ? this.settingsService.settings.CUSTOMDUTY.Value
          : "",
      ],
    });
  }

  save(): void {
    this.settingsService.updateSettings(this.slabsForms.value).subscribe(
      (response) => {
        this.router.navigate(["/settings"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Slabs settings edited successfully");
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/settings"]);
  }
}
