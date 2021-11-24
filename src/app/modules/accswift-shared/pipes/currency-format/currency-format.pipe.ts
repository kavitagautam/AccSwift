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
    // console.log(this.inWords(12345));
  }

  transform(value: any, event?: number): SafeHtml {
    this.currencySign = localStorage.getItem("currencySymbol");
    // console.log(this.currencySign);
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

  a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

  //Currency in Number to Words Transformation
  inWords(num)
  {
    // console.log(num); //12345
    if ((num = num.toString()).length > 9) return 'overflow';
    let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/); //substr(start, length) If negative, index starts counting from last and match method returns array
    // 0: "000012345"
    // 1: "00"
    // 2: "00"
    // 3: "12"
    // 4: "3"
    // 5: "45"
    // console.log(n);
    if (!n) return; var str = '';
    str += (Number(n[1]) != 0) ?(this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'crore ' :'';
    str += (Number(n[2]) != 0) ?(this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'lakh ' :'';
    str += (Number(n[3]) != 0) ?(this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'thousand ' :'';
    str += (Number(n[4]) != 0) ?(this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'hundred ' :'';
    str += (Number(n[5]) != 0) ?((str != '') ? 'and ' : '') + (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' + this.a[n[5][1]]) + 'only ' :'';
    return str;
  }

  
}
