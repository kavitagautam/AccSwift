
  export interface Settings {
        ID: number;
        Name: string;
        Code: string;
        Value: string;
        CompanyID: number;
    }

    export interface SettingsDataModel {
        StatusCode: number;
        Message: string;
        Entity: Settings[];
    }

