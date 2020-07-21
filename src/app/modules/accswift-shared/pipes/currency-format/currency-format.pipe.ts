import { Pipe, PipeTransform, OnInit } from "@angular/core";
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from "@angular/platform-browser";
import { SettingsService } from "@app/modules/settings/services/settings.service";

@Pipe({
  name: "currencyFormat",
})
export class CurrencyFormatPipe implements PipeTransform {
  currencySign: string = "रू ";

  constructor(
    protected sanitizer: DomSanitizer,
    private settingService: SettingsService
  ) {
    if (
      this.settingService.settings &&
      this.settingService.settings.DEFAULT_LANGUAGE.Value === "Nepali"
    ) {
      this.currencySign = "रू ";
    } else {
      this.currencySign = "$ ";
    }
  }

  transform(value: any, event?: number): SafeHtml {
    if (value > 0) {
      let parseNumber = parseFloat(value);
      let res = parseNumber.toFixed(2);

      var result = res.toString().split(".");

      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != "") lastThree = "," + lastThree;
      if (this.currencySign == "रू ") {
        var output =
          otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      } else {
        var output =
          otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
      }

      if (result.length > 1) {
        output += "." + result[1];
      }
      return this.sanitizer.bypassSecurityTrustHtml(this.currencySign + output);
    } else if (value < 0) {
      let parseNumber = Math.abs(parseFloat(value));
      let res = parseNumber.toFixed(2);

      var result = res.toString().split(".");

      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != "") lastThree = "," + lastThree;
      if (this.currencySign == "रू ") {
        var output =
          otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      } else {
        var output =
          otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
      }

      if (result.length > 1) {
        output += "." + result[1];
      }
      return this.sanitizer.bypassSecurityTrustHtml(
        '<span style="color:red">(' + this.currencySign + output + ")</span>"
      );
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(
        this.currencySign + (0.0).toFixed(2)
      );
    }
  }

  revertTransform(value: string): number {
    let doublenumber = Number(
      value.replace(/[, ]+/g, "").replace(/[^0-9\.]+/g, "")
    );
    return doublenumber ? doublenumber : null;
  }
}
