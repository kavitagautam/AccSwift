import { Injectable } from "@angular/core";

@Injectable()
export class ValidationMessageService {
  public getValidationMsg(valErrors, inputLabelName: string) {
    const firstKey = Object.keys(valErrors)[0];
    if (firstKey == "required") {
      return inputLabelName + " is Required";
    } else if (firstKey == "minlength") {
      return (
        inputLabelName +
        " must have " +
        valErrors.minlength.requiredLength +
        " characters"
      );
    } else if (firstKey == "maxlength") {
      return (
        inputLabelName +
        " cannot exceed " +
        valErrors.maxlength.requiredLength +
        " characters"
      );
    } else if (firstKey == "pattern") {
      return inputLabelName + " is Invalid";
    } else {
      return "Invalid Input";
    }
  }
}
