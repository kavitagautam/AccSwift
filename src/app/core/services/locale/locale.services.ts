import { Injectable, Inject, LOCALE_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  IntlService,
  CldrIntlService,
  setData
} from "@progress/kendo-angular-intl";
import { LocaleDataNe } from "@app/core/models/ne-locale.model";
import { registerLocaleData } from "@angular/common";
import enUS from "@progress/kendo-angular-intl/locales/en/all";
@Injectable({  providedIn: "root"
})
export class LocaleService {
  //   private url =
  //     "https://unpkg.com/@progress/kendo-angular-intl/locales/json/{0}/all.json"; // get locale Data From Server
  private loaded: any = {};

  constructor(
    private http: HttpClient,
    private intl: IntlService,
    @Inject(LOCALE_ID) public localeId: string
  ) {
    this.loaded[localeId] = true;
  }

  public set(localeId: string): void {
    if (this.loaded[localeId]) {
      this.setLocale(localeId);
      return;
    }
    /* Change Nepali locale data for the proper Format*/
    if (localeId === "ne") {
      registerLocaleData(LocaleDataNe, "ne");

      setData(LocaleDataNe);

      this.loaded[localeId] = true;

      // set the local as current
      this.setLocale(localeId);
    } else {
      registerLocaleData(enUS, "en-US");
    }

    /*Getting locale data on the locale change and change the locale data as per required */
    // this.http.get(this.intl.format(this.url, localeId)).subscribe(result => {
    //   console.log("result " + JSON.stringify(result));
    //   // set the recieved locale data
    //   if (localeId === "ne") {
    //     result = LocaleDataNe;
    //   }
    //   setData(result);

    //   this.loaded[localeId] = true;

    //   // set the local as current
    //   this.setLocale(localeId);
    // });
  }

  private setLocale(localeId: string): void {
    (this.intl as CldrIntlService).localeId = localeId;
    this.localeId = localeId;
  }
}
