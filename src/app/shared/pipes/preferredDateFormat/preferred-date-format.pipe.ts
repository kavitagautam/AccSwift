import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { SettingsService } from "@accSwift-modules/settings/services/settings.service";
import { DATE_FORMAT } from "@accSwift-modules/settings/models/settings.model";

@Pipe({
  name: "preferredDateFormat"
})
export class PreferredDateFormatPipe implements PipeTransform {

  dateFormats: DATE_FORMAT[];
  selectedDateFormatId:any;

  constructor(private settingsService: SettingsService) {
    this.getDateFormat();
    this.selectedDateFormatId = localStorage.getItem("SelectedDateFormat");
  }

  getDateFormat(): void {
    this.settingsService.getDateFormats().subscribe((response) => {
      this.dateFormats = response.Entity;
      console.log(this.dateFormats);
    });
  }

  transform(value: string, formatId: any) {
    formatId = this.selectedDateFormatId;
    console.log(value);
    console.log(formatId);
    console.log(this.dateFormats);
    const dateFormat = this.dateFormats.filter((date) => {return date.ID == formatId});
    console.log(dateFormat);
    var datePipe = new DatePipe("en-US");
    // if (dateFormat[0] && dateFormat[0].Format)
    // {
      value = datePipe.transform(value, dateFormat[0].Format);
      // value = formatDate(
      //     value,
      //     dateFormat[0].Format,
      //     "en_US"
      // );
    // }
    console.log(value);
    return value;
  }
  
}

