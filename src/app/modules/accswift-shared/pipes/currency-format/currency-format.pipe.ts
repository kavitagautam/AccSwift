import { Pipe, PipeTransform, OnInit } from "@angular/core";
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from "@angular/platform-browser";

@Pipe({
  name: "currencyFormat",
})
export class CurrencyFormatPipe implements PipeTransform {
  currencySign: string;

  constructor(protected sanitizer: DomSanitizer) {
    this.currencySign = localStorage.getItem("currencySymbol");
    // console.log(this.currencySign);
    // console.log(this.transform(123678997788));

  }

  transform(value: any, event?: number): SafeHtml {
    if (value > 0) {
      let parseNumber = parseFloat(value);
      // console.log(parseNumber);//2500
      let res = parseNumber.toFixed(2);
      // console.log(res);//2500.00
      var result = res.toString().split(".");
      // console.log(result);//result[0]=2500 and result[1]=00 splitted
      var lastThree = result[0].substring(result[0].length - 3);
      // console.log(lastThree);//500
      var otherNumbers = result[0].substring(0, result[0].length - 3); //str.substring method extracts char(indices position) between start and end including start not end
      // console.log(otherNumbers);//2
      if (otherNumbers != "") lastThree = "," + lastThree; //In case of only numbers
      // console.log(lastThree);//,500
      if (this.currencySign == "Rs") { //In case of currency Rs
        var output =
          otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
          // console.log(output);//2,500
      } else { //In case of others or nepali currency
        var output =
          otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
          // console.log(output);
      }

      if (result.length > 1) {
        output += "." + result[1];
        // console.log(output);//2,500.00
      }
      return this.sanitizer.bypassSecurityTrustHtml(
        this.currencySign + "\u00A0" + output //Rs 2,500.00
      );
    } else if (value < 0) {
      let parseNumber = Math.abs(parseFloat(value)); //an absolute value without regard to pos or neg
      let res = parseNumber.toFixed(2);

      var result = res.toString().split(".");

      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != "") lastThree = "," + lastThree;
      if (this.currencySign == "रू") {
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
      return this.sanitizer.bypassSecurityTrustHtml((0.0).toFixed(2)); //To avoid cross site scripting bugs//0.00 if no value 
    }
  }

  revertTransform(value: string): number {
    let doublenumber = Number(
      value.replace(/[, ]+/g, "").replace(/[^0-9\.]+/g, "")
    );
    // console.log(doublenumber);
    return doublenumber ? doublenumber : null;
  }
  
}
