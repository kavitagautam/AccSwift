import { IExportColumnHeaders } from "@app/shared/models/iexport";

export class PayrollExportColumnHeaders {
  // Headers for file
  public static get Columns(): Array<IExportColumnHeaders> {
    return [
      { field: "ssn", title: "SSN" },
      { field: "last_name", title: "Last Name" },
      { field: "first_name", title: "First Name" },
      { field: "pay_type", title: "Pay Type" },
      { field: "hours_worked", title: "Hours Worked" },
      { field: "pay_rate", title: "Pay Rate" },
      { field: "wc_code", title: "WC Code" },
      { field: "location", title: "Location" },
      { field: "department", title: "Department" },
      { field: "one_time_ded", title: "1 Time Ded" },
      { field: "one_time_ded_amount", title: "1 Time Ded Amount" }
    ];
  }
}
