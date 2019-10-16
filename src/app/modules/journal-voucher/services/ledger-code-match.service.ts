import { Injectable } from "@angular/core";
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn
} from "@angular/forms";
import { JournalService } from "./journal.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class LedgerCodeMatchService {
  constructor(public journalService: JournalService) {}
  ledgerCodeMatch(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.journalService.checkLedgerCode(control.value).pipe(
        map(
          res => {
            if (control.value) {
              if (res.Status == 1) {
                return null;
              } else {
                return {
                  codeUnMatch: true
                };
              }
            } else {
              return null;
            }
          },
          error => {
            return Promise.resolve({
              codeUnMatch: true
            });
          }
        )
      );
    };
  }
}
