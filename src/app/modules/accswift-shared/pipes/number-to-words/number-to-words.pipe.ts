import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberToWordsConvert",
})
export class NumberToWordsPipe implements PipeTransform {
  transform(value, args?: any): any {
    var th = ["", "thousand", "million", "billion", "trillion"];
    var dg = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    var tn = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    var tw = [
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    value = value.toString();
    value = value.replace(/[\, ]/g, "");
    if (value != parseFloat(value)) return "not a number";
    var x = value.indexOf(".");
    if (x == -1) x = value.length;
    if (x > 15) return "too big";
    var n = value.split("");
    var str = "";
    var sk = 0;
    for (var i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == "1") {
          str += tn[Number(n[i + 1])] + " ";
          i++;
          sk = 1;
        } else if (n[i] != 0) {
          str += tw[n[i] - 2] + " ";
          sk = 1;
        }
      } else if (n[i] != 0) {
        str += dg[n[i]] + " ";
        if ((x - i) % 3 == 0) str += "hundred ";
        sk = 1;
      }

      if ((x - i) % 3 == 1) {
        if (sk) str += th[(x - i - 1) / 3] + " ";
        sk = 0;
      }
    }
    if (x != value.length) {
      var y = value.length;
      str += "point ";
      for (var i: number = x + 1; i < y; i++) str += dg[n[i]] + " ";
    }
    return str.replace(/\s+/g, " ");
    //return null;
  }
}
