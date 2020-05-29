export class MapCustomerInvoiceExportData {
  static mapCustomerInvoice(payroll: any) {
    let csvRow: any = {};
    csvRow.last_name = payroll.last_name;
    csvRow.first_name = payroll.first_name;
    csvRow.pay_type = payroll.pay_type;
    csvRow.hours_worked = payroll.hours_worked;
    csvRow.pay_rate = payroll.pay_rate;
    csvRow.wc_code = payroll.wc_code;
    csvRow.location = payroll.location;
    csvRow.department = payroll.department;
    csvRow.one_time_ded = payroll.one_time_ded;
    csvRow.one_time_ded_amount = payroll.one_time_ded_amount;
    // rows can grow as per need.
    return csvRow;
  }
}
