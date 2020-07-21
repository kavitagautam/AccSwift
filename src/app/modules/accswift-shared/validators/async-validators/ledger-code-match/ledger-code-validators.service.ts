import { Injectable } from "@angular/core";
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { LedgerCodeMatchService } from "@app/modules/accswift-shared/services/ledger-code-match/ledger-code-match.service";

@Injectable({
  providedIn: "root",
})
export class LedgerCodeAsyncValidators {
  constructor(public ledgerCodeService: LedgerCodeMatchService) {}

  ledgerCodeMatch(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.ledgerCodeService.checkLedgerCode(control.value).pipe(
        map(
          (res) => {
            if (control.value) {
              if (res.StatusCode == 200) {
                return null;
              } else {
                return {
                  codeUnMatch: true,
                };
              }
            } else {
              return null;
            }
          },
          (error) => {
            return Promise.resolve({
              codeUnMatch: true,
            });
          }
        )
      );
    };
  }
}
