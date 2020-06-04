import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "currencyFormat",
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: any, currencySign: string = "रू "): string {
    console.log("value" + value);
    if (value) {
      let parseNumber = parseFloat(value);
      let res = parseNumber.toFixed(2);

      var result = res.toString().split(".");

      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != "") lastThree = "," + lastThree;
      var output =
        otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      if (result.length > 1) {
        output += "." + result[1];
      }
      return currencySign + output;
    } else {
      return currencySign + (0.0).toFixed(2);
    }
  }

  revertTransform(value: string): number {
    let doublenumber = Number(
      value.replace(/[, ]+/g, "").replace(/[^0-9\.]+/g, "")
    );
    return doublenumber ? doublenumber : null;
  }
}
