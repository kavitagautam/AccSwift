export interface IExportColumnHeaders {
  field: string;
  locked?: boolean;
  cssClass?: string;
  title: string;
  width?: number;
  hasTemplate?: boolean;
}
export interface IExport {
  data: any[];
  columnHeaders: IExportColumnHeaders[];
  columnHeaderNotToBeIncluded?: any[];
}
