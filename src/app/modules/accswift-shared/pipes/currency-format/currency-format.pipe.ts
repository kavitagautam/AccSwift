import { Pipe, PipeTransform, OnInit } from "@angular/core";
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from "@angular/platform-browser";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";

@Pipe({
  name: "currencyFormat",
})
export class CurrencyFormatPipe implements PipeTransform {
  currencySign: string;

  constructor(
    protected sanitizer: DomSanitizer,
    private settingService: SettingsService
  ) {
    // this.settingService.getSettingsData().subscribe((response) => {

    //   if (response.Entity.DEFAULT_CURRENCY.Value == 1) {
    //     this.currencySign = "रू ";
    //   }
    //   if (response.Entity.DEFAULT_CURRENCY.Value == 2) {
    //     this.currencySign = "$ ";
    //   }
    //   if (response.Entity.DEFAULT_CURRENCY.Value == 249) {
    //     this.currencySign = "€ ";
    //   }
    //   if (response.Entity.DEFAULT_CURRENCY.Value == 260) {
    //     this.currencySign = "£ ";
    //   }
    // });
    // if (this.settingService.currencyDetails) {
    // this.currencySign = this.settingService.currencyDetails
    //   ? this.settingService.currencyDetails.Symbol
    //   : "रू ";
    this.currencySign = this.settingService.getCurrencySymbol;
    // console.log("this currency" + this.currencySign);
    // }
    // this.settingService.getSettingsData().subscribe((response) => {
    //   this.settingService
    //     .getCurrencyDetails(response.Entity.DEFAULT_CURRENCY.Value)
    //     .subscribe((res) => {
    //       this.currencySign = res.Entity ? res.Entity[0].Symbol : "रू ";
    //     });
    // });
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
      return this.sanitizer.bypassSecurityTrustHtml((0.0).toFixed(2));
    }
  }

  revertTransform(value: string): number {
    let doublenumber = Number(
      value.replace(/[, ]+/g, "").replace(/[^0-9\.]+/g, "")
    );
    return doublenumber ? doublenumber : null;
  }
}
