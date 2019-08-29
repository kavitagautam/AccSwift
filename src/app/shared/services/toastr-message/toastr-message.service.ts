import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class ToastrMessageService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message): void {
    this.toastr.success(message);
  }

  showError(message): void {
    for (var key in message) {
      this.toastr.error(JSON.stringify(message[key]));
      return;
    }
  }

  showWarning(message) {
    this.toastr.warning(message);
  }
}
