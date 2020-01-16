import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";

@Pipe({
  name: "dateStringFormat"
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string, fromat: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, fromat);
    return value;
  }
}
