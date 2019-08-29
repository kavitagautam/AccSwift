import { HttpClient } from "@angular/common/http";

import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateService } from '@ngx-translate/core';

export const TRANSLATE_STORAGE_KEY: string = "ngx-translate-lang";
export const SUPPORTED_LANGS: any[] = ["en-US", "es"];
/**
 * Utility method to get selected language from sessionStorage or browser
 */
export function getSelectedLanguage(
  translateService: TranslateService
): string {
  let storedLanguage: string = sessionStorage.getItem(TRANSLATE_STORAGE_KEY);
  // Check if the lenguage has been stored else if the language wasnt stored, then use browser default if supported
  if (
    storedLanguage &&
    translateService.getLangs().indexOf(storedLanguage) > -1
  ) {
    return storedLanguage;
  } else if (
    translateService
      .getLangs()
      .indexOf(translateService.getBrowserCultureLang()) > -1
  ) {
    return translateService.getBrowserCultureLang();
  }
  // If everything fails, then use default lang
  return translateService.getDefaultLang();
}
