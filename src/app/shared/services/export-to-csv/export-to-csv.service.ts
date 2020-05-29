import { Injectable } from "@angular/core";
import { IExport } from "@app/shared/models/iexport";

@Injectable({
  providedIn: "root"
})
export class ExportToCsvService {
  constructor() {}

  // Export to csv file
  ExportToCSV(exportConfig: IExport) {
    /* If you want to give custom file name 
          make a form with input file e.g.fileName control and ask user for the input and it will be custom file name for your CSV
          something like this.
          //let filename = this.customFileNameForm.controls["fileName"].value + ".csv"; 
      */

    let fileName = "ExportCSV.csv";
    this.ConvertDataToCSVFile(
      exportConfig.columnHeaders,
      exportConfig.data,
      exportConfig.columnHeaderNotToBeIncluded,
      fileName
    );
  }

  // Method to convert data into csv format
  ConvertDataToCSVFile(
    HeaderColumns: any[],
    data: any,
    HeaderColumnsIgnored: any[],
    filename: string
  ) {
    let csvArray: any;
    console.log(data);
    const replacer = (key, value) =>
      value === null
        ? ""
        : value.toString().indexOf('"') > 0
        ? value.replace(/"/g, " ")
        : value; // specify how you want to handle null values here
    if (data.length > 0) {
      const header_original = Object.keys(data[0]).filter(function(item) {
        return HeaderColumnsIgnored.indexOf(item) === -1;
      });
      const header_show = header_original.map(function(
        value: string,
        index: number
      ) {
        return HeaderColumns.filter(function(item) {
          return item.field === value;
        })[0].title;
      });
      let csv = data.map(row =>
        header_original
          .map(fieldName => JSON.stringify(row[fieldName], replacer))
          .join(",")
      );
      csv.unshift(header_show.join(","));
      csvArray = csv.join("\r\n");
    } else {
      // no record rows
      const header_show = HeaderColumns.map(function(
        value: string,
        index: number
      ) {
        return value["title"];
      });
      let csv = data.map(row =>
        header_show
          .map(fieldName => JSON.stringify(row[fieldName], replacer))
          .join(",")
      );
      csv.unshift(header_show.join(","));
      csvArray = csv.join("\r\n");
    }
    var a = document.createElement("a");
    var blob = new Blob([csvArray], { type: "text/csv" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
