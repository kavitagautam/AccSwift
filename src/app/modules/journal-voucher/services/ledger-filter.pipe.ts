import { Pipe, PipeTransform } from '@angular/core';
import { initTimestamp } from 'ngx-bootstrap/chronos/units/timestamp';

@Pipe({
  name: 'ledgerFilter'
})
export class LedgerFilterPipe implements PipeTransform {

  transform(
    items: any[],
    searchByLedgerName: string,
    searchByLedgerCode: string,
    searchByLedgerType: string,
  ): any {
    if (items && items.length) {
      return items.filter(item => {
        if (searchByLedgerName && item.LedgerName.toLowerCase()
          .indexOf(searchByLedgerName.toLowerCase().trim()) === -1) {
          return false;
        }

        if (searchByLedgerCode && item.LedgerCode.toLowerCase()
          .indexOf(searchByLedgerCode.toLowerCase().trim()) === -1) {
          return false;
        }

        if (searchByLedgerType && item.LedgerType.toLowerCase()
          .indexOf(searchByLedgerType.toLowerCase().trim()) === -1) {
          return false;
        }
        return true;
      });
    } else {
      return items;
    }

  }

}
