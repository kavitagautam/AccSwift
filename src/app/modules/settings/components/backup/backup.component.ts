import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-backup",
  templateUrl: "./backup.component.html",
  styleUrls: ["./backup.component.scss"],
})
export class BackupComponent implements OnInit {
  backUpForms: FormGroup;
  constructor(
    private _fb: FormBuilder,
    private settingsService: SettingsService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}
  buildBackUpForms(): void {
    this.backUpForms = this._fb.group({
      AUTO_BACKUP: [
        this.settingsService.settings
          ? this.settingsService.settings.AUTO_BACKUP.Value
          : "",
      ],
      BACKUP_INTERVAL_DAY: [
        this.settingsService.settings
          ? this.settingsService.settings.BACKUP_INTERVAL_DAY.Value
          : "",
      ],
      BACKUP_PATH: [
        this.settingsService.settings
          ? this.settingsService.settings.BACKUP_PATH.Value
          : "",
      ],
    });
  }
  save(): void {
    this.settingsService.updateSettings(this.backUpForms.value).subscribe(
      (response) => {
        this.router.navigate(["/settings"]);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Backup settings edited successfully");
      }
    );
  }

  cancel(): void {
    this.router.navigate(["/settings"]);
  }
}
