import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateConversion'
})
export class DateConversionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
