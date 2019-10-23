import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "currencyFormat"
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(
    value: number,
    currencySign: string = "Rs. ",
  ): string {
    var result = value.toString().split(".");

    var lastThree = result[0].substring(result[0].length - 3);
    var otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers != "") lastThree = "," + lastThree;
    var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  
    if (result.length > 1) {
      output += "." + result[1];
    }
    return currencySign + output;
   }
}
