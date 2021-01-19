import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TimeZoneService {
  constructor() {}
  convetTimeZone(value): string {
    console.log("Value" + value);
    const date = new Date(value);
    console.log("Return Date " + date.toLocaleString());
    return date.toLocaleString();
  }
}
