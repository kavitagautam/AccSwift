export interface DEFAULTDATE {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DATEFORMAT {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DEFAULTDECIMALPLACES {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface COMMASEPARATED {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DECIMALFORMAT {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DEFAULTCASHACCOUNT {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DEFAULTBANKACCOUNT {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DEFAULTPURCHASEACCOUNT {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DEFAULTSALESACCOUNT {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface ACCOUNTCLASS {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface COMPANYNAME {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface COMPANYADDRESS {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface COMPANYCITY {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface COMPANYPAN {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface COMPANYPHONE {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface COMPANYSLOGAN {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value?: any;
}

export interface DEFAULTDEPOT {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DEFAULTSERIES {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DEFAULTPROJECT {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface DEFAULTACCCLASS {
  ID: number;
  UserID: number;
  PrefernceID: number;
  PreferenceCode: string;
  Value: string;
}

export interface Preferences {
  DEFAULT_DATE: DEFAULTDATE;
  DATE_FORMAT: DATEFORMAT;
  DEFAULT_DECIMALPLACES: DEFAULTDECIMALPLACES;
  COMMA_SEPARATED: COMMASEPARATED;
  DECIMAL_FORMAT: DECIMALFORMAT;
  DEFAULT_CASH_ACCOUNT: DEFAULTCASHACCOUNT;
  DEFAULT_BANK_ACCOUNT: DEFAULTBANKACCOUNT;
  DEFAULT_PURCHASE_ACCOUNT: DEFAULTPURCHASEACCOUNT;
  DEFAULT_SALES_ACCOUNT: DEFAULTSALESACCOUNT;
  ACCOUNT_CLASS: ACCOUNTCLASS;
  COMPANY_NAME: COMPANYNAME;
  COMPANY_ADDRESS: COMPANYADDRESS;
  COMPANY_CITY: COMPANYCITY;
  COMPANY_PAN: COMPANYPAN;
  COMPANY_PHONE: COMPANYPHONE;
  COMPANY_SLOGAN: COMPANYSLOGAN;
  DEFAULT_DEPOT: DEFAULTDEPOT;
  DEFAULT_SERIES: DEFAULTSERIES;
  DEFAULT_PROJECT: DEFAULTPROJECT;
  DEFAULT_ACC_CLASS: DEFAULTACCCLASS;
}

export interface PreferenceModel {
  StatusCode: number;
  Message: string;
  Entity: Preferences;
}

export interface CashAccountsModel {
  Entity: CashAccountList[];
}

export interface CashAccountList {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}
export interface BankAccountsModel {
  Status: number;
  Entity: BankAccounts[];
}

export interface BankAccounts {
  LedgerID: number;
  LedgerCode: string;
  LedgerName: string;
  GroupID: number;
}

export const APIData = {
  StatusCode: 200,
  Message: "List of items found.",
  Entity: [
    {
      ID: 167,
      UserID: 1,
      PrefernceID: 1,
      PreferenceCode: "DEFAULT_DATE",
      Value: "Nepali",
    },
    {
      ID: 168,
      UserID: 1,
      PrefernceID: 2,
      PreferenceCode: "DATE_FORMAT",
      Value: "YYYY/MM/DD",
    },
    {
      ID: 169,
      UserID: 1,
      PrefernceID: 3,
      PreferenceCode: "DEFAULT_DECIMALPLACES",
      Value: "2",
    },
    {
      ID: 170,
      UserID: 1,
      PrefernceID: 5,
      PreferenceCode: "COMMA_SEPARATED",
      Value: "0",
    },
    {
      ID: 171,
      UserID: 1,
      PrefernceID: 4,
      PreferenceCode: "DECIMAL_FORMAT",
      Value: "0",
    },
    {
      ID: 172,
      UserID: 1,
      PrefernceID: 6,
      PreferenceCode: "DEFAULT_CASH_ACCOUNT",
      Value: "191",
    },
    {
      ID: 173,
      UserID: 1,
      PrefernceID: 7,
      PreferenceCode: "DEFAULT_BANK_ACCOUNT",
      Value: "1614",
    },
    {
      ID: 174,
      UserID: 1,
      PrefernceID: 8,
      PreferenceCode: "DEFAULT_PURCHASE_ACCOUNT",
      Value: "577",
    },
    {
      ID: 175,
      UserID: 1,
      PrefernceID: 9,
      PreferenceCode: "DEFAULT_SALES_ACCOUNT",
      Value: "576",
    },
    {
      ID: 176,
      UserID: 1,
      PrefernceID: 10,
      PreferenceCode: "ACCOUNT_CLASS",
      Value: "1",
    },
    {
      ID: 1189,
      UserID: 1,
      PrefernceID: 15,
      PreferenceCode: "COMPANY_NAME",
      Value: "SABAL SUPPLIERS",
    },
    {
      ID: 1190,
      UserID: 1,
      PrefernceID: 16,
      PreferenceCode: "COMPANY_ADDRESS",
      Value: "JWAGAL, KOPUNDOLE,LALITPUR",
    },
    {
      ID: 1191,
      UserID: 1,
      PrefernceID: 17,
      PreferenceCode: "COMPANY_CITY",
      Value: "LALITPUR",
    },
    {
      ID: 1192,
      UserID: 1,
      PrefernceID: 18,
      PreferenceCode: "COMPANY_PAN",
      Value: "600600543",
    },
    {
      ID: 1193,
      UserID: 1,
      PrefernceID: 19,
      PreferenceCode: "COMPANY_PHONE",
      Value: "5539017",
    },
    {
      ID: 1194,
      UserID: 1,
      PrefernceID: 20,
      PreferenceCode: "COMPANY_SLOGAN",
      Value: null,
    },
    {
      ID: 4095,
      UserID: 1,
      PrefernceID: 21,
      PreferenceCode: "DEFAULT_DEPOT",
      Value: "12",
    },
    {
      ID: 4096,
      UserID: 1,
      PrefernceID: 22,
      PreferenceCode: "DEFAULT_SERIES",
      Value: "Main",
    },
    {
      ID: 4097,
      UserID: 1,
      PrefernceID: 23,
      PreferenceCode: "DEFAULT_PROJECT",
      Value: "1",
    },
    {
      ID: 4098,
      UserID: 1,
      PrefernceID: 24,
      PreferenceCode: "DEFAULT_ACC_CLASS",
      Value: "1",
    },
  ],
};
