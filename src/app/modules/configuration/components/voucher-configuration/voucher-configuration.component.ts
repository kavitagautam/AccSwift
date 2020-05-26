import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  VoucherConfiguration,
  Tree,
  SeriesList,
} from "../../models/configuration.model";
import { ConfigurationService } from "../../services/configuration.service";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "accSwift-voucher-configuration",
  templateUrl: "./voucher-configuration.component.html",
  styleUrls: ["./voucher-configuration.component.scss"],
})
export class VoucherConfigurationComponent implements OnInit {
  seriesTreeView: Tree[];
  seriesNode: string[];
  seriesID: number;
  selectedRow: number;
  seriesDropDownList: SeriesList[];
  treeViewLoading: boolean;
  configDetails: VoucherConfiguration;
  numberingConfigForm: FormGroup;
  modalRef: BsModalRef;
  setClickedRow: Function;
  hideNumberFormatting: boolean = false;
  public expandedKeys: any[] = ["Main"];
  symbol: string;
  dateType: string;

  constructor(
    private configService: ConfigurationService,
    private _fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.setClickedRow = function (index) {
      this.selectedRow = index;
    };
  }

  numberingTypes = [
    { id: 1, type: "Automatic" },
    { id: 2, type: "Manual" },
    { id: 3, type: "Not Required" },
  ];
  voucherNoValidation = [
    { id: 1, type: "WARNING_ONLY", value: "Warning Only" },
    { id: 2, type: "DONT_ALLOW", value: "Don't Allow" },
    { id: 3, type: "NO_ACTION", value: "No Action" },
  ];

  dateTypeDD = [
    {
      id: 1,
      type: "ENGLISH_FISCAL_YEAR",
      value: "English Fiscal Year (eg. 09/02)",
    },
    {
      id: 2,
      type: "NEPALI_FISCAL_YEAR",
      value: "Nepali Fiscal Year (eg. 068/069)",
    },
  ];

  renumberingFreq = [
    { id: 1, value: "Annual" },
    { id: 2, value: "Daily" },
  ];

  ngOnInit(): void {
    this.buildNumberingConfigForms();
    this.getSeriesTreeView();
  }

  buildNumberingConfigForms(): void {
    this.numberingConfigForm = this._fb.group({
      ID: this.configDetails ? this.configDetails.ID : 0,
      Name: this.configDetails ? this.configDetails.Name : "",
      VoucherType: this.configDetails ? this.configDetails.VoucherType : "",
      AutoNumber: this.configDetails ? this.configDetails.AutoNumber : 0,
      VoucherFormat: this._fb.array([]),
      VouchNumberConfiguration: this._fb.group({
        ID: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.ID
            : 0,
        ],
        NumberingType: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.NumberingType
            : null,
        ],
        DuplicateVoucherNumber: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.DuplicateVoucherNumber
            : null,
        ],
        BlankVoucherNumber: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.BlankVoucherNumber
            : null,
        ],
        StartingNo: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.StartingNo
            : "",
        ],
        IsHideVoucherNumber: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.IsHideVoucherNumber
            : "",
        ],
        IsSpecifyEndNo: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.IsSpecifyEndNo
            : "",
        ],
        EndNo: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.EndNo
            : "",
        ],
        WarningVouLeft: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.WarningVouLeft
            : "",
        ],
        WarningMessage: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.WarningMessage
            : "",
        ],
        RenumberingFrequency: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.RenumberingFrequency
            : null,
        ],
        IsNumericPart: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.IsNumericPart
            : "",
        ],
        TotalLengthNumPart: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.TotalLengthNumPart
            : "",
        ],
        PaddingChar: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.PaddingChar
            : "",
        ],
        SerieID: [
          this.configDetails
            ? this.configDetails.VouchNumberConfiguration.SerieID
            : null,
        ],
      }),
      OptionalFields: this._fb.group({
        Field1: [
          this.configDetails ? this.configDetails.OptionalFields.Field1 : "",
        ],
        Field2: [
          this.configDetails ? this.configDetails.OptionalFields.Field2 : "",
        ],
        Field3: [
          this.configDetails ? this.configDetails.OptionalFields.Field3 : "",
        ],
        Field4: [
          this.configDetails ? this.configDetails.OptionalFields.Field4 : "",
        ],
        Field5: [
          this.configDetails ? this.configDetails.OptionalFields.Field5 : "",
        ],
        VoucherType: [""],
        IsField1Required: [
          this.configDetails
            ? this.configDetails.OptionalFields.IsField1Required
            : "",
        ],
        IsField2Required: [
          this.configDetails
            ? this.configDetails.OptionalFields.IsField2Required
            : "",
        ],
        IsField3Required: [
          this.configDetails
            ? this.configDetails.OptionalFields.IsField3Required
            : "",
        ],
        IsField4Required: [
          this.configDetails
            ? this.configDetails.OptionalFields.IsField4Required
            : "",
        ],
        IsField5Required: [
          this.configDetails
            ? this.configDetails.OptionalFields.IsField5Required
            : "",
        ],
      }),
    });
  }

  addNumberingFormatFromGroup(): FormGroup {
    return this._fb.group({
      ID: [""],
      FormatType: [""],
      Parameter: [""],
      SeriesID: [""],
    });
  }

  get getNumberFormatList(): FormArray {
    return <FormArray>this.numberingConfigForm.get("VoucherFormat");
  }

  setNumberingFormatList(): void {
    this.numberingConfigForm.setControl(
      "VoucherFormat",
      this.setNumberingFormatFormArray(this.configDetails.VoucherFormat)
    );
  }

  // this block of code is used to show form array data in the template.....
  setNumberingFormatFormArray(format): FormArray {
    const formatFormArray = new FormArray([]);
    if (format && format.length > 0) {
      format.forEach((element) => {
        formatFormArray.push(
          this._fb.group({
            ID: [element.ID],
            FormatType: [element.FormatType],
            Parameter: [element.Parameter],
            SeriesID: [element.SeriesID],
          })
        );
      });
    } else {
      formatFormArray.push(
        this._fb.group({
          ID: [""],
          FormatType: [""],
          Parameter: [""],
          SeriesID: [""],
        })
      );
    }
    return formatFormArray;
  }

  getSeriesTreeView(): void {
    this.treeViewLoading = true;
    this.configService.getSeriesTreeView().subscribe(
      (response) => {
        this.seriesTreeView = response.Tree;
        this.seriesNode = response.Node;
      },
      (error) => {
        this.treeViewLoading = false;
      },
      () => {
        this.treeViewLoading = false;
      }
    );
  }

  openNumberFormatting(template: TemplateRef<any>): void {
    const config = {
      backdrop: true,
      ignoreBackdropClick: true,
      centered: true,
      class: "modal-lg",
    };
    this.modalRef = this.modalService.show(template, config);
  }

  public onTabSelect(e): void {
    if (e.index == 1) {
      this.getSeriesTreeView();
    }
  }

  public colorGroupOrProduct({ Title, TypeOf }: any): any {
    return {
      "tree-child": TypeOf == 0,
      "tree-node": TypeOf == 1,
    };
  }

  save(): void {
    this.configService
      .updateVoucherConfig(JSON.stringify(this.numberingConfigForm.value))
      .subscribe(
        (response) => {
          this.router.navigate(["/voucher-configuration"]);
        },
        (error) => {
          this.toastr.error(JSON.stringify(error.error.Message));
        },
        () => {
          this.toastr.success("Voucher Configuration updated successfully");
        }
      );
  }

  cancel(): void {
    this.router.navigate(["/voucher-configuration"]);
  }

  numberingTypeChange(event): void {
    const vouchNumberConfig = <FormArray>(
      this.numberingConfigForm.get("VouchNumberConfiguration")
    );
    if (vouchNumberConfig.controls["NumberingType"].value === "Automatic") {
      vouchNumberConfig.controls["DuplicateVoucherNumber"].disable();
      vouchNumberConfig.controls["BlankVoucherNumber"].disable();
      this.hideNumberFormatting = true;
    }
    if (vouchNumberConfig.controls["NumberingType"].value === "Manual") {
      vouchNumberConfig.disable();
      vouchNumberConfig.controls["NumberingType"].enable();
      vouchNumberConfig.controls["DuplicateVoucherNumber"].enable();
      vouchNumberConfig.controls["BlankVoucherNumber"].enable();
      this.hideNumberFormatting = false;
    }
    if (vouchNumberConfig.controls["NumberingType"].value === "Not Required") {
      vouchNumberConfig.disable();
      vouchNumberConfig.controls["NumberingType"].enable();
      this.hideNumberFormatting = false;
    }
  }

  selectedNode(dataItem): void {
    this.configService
      .getVoucherConfigDetails(dataItem.ID)
      .subscribe((response) => {
        this.configDetails = response.Entity;
        this.getSeriesDD(response.Entity.VoucherType);
        this.seriesID = dataItem.ID;
        this.buildNumberingConfigForms();
        this.setNumberingFormatList();
      });
  }

  autonumberInput(): void {
    (<FormArray>this.numberingConfigForm.get("VoucherFormat")).push(
      this._fb.group({
        ID: this.getNumberFormatList.value
          ? this.getNumberFormatList.value.length + 1
          : 1,
        FormatType: "AutoNumber",
        Parameter: "(Auto)",
        SeriesID: this.seriesID,
      })
    );
  }

  symbolInput(event): void {
    (<FormArray>this.numberingConfigForm.get("VoucherFormat")).push(
      this._fb.group({
        ID: this.getNumberFormatList.value
          ? this.getNumberFormatList.value.length + 1
          : 1,
        FormatType: "Symbol",
        Parameter: this.symbol,
        SeriesID: this.seriesID,
      })
    );
    this.symbol = "";
  }

  dateInput(event): void {
    if (this.dateType) {
      (<FormArray>this.numberingConfigForm.get("VoucherFormat")).push(
        this._fb.group({
          ID: this.getNumberFormatList.value
            ? this.getNumberFormatList.value.length + 1
            : 1,
          FormatType: "Date",
          Parameter: this.dateType,
          SeriesID: this.seriesID,
        })
      );
    }

    this.dateType = "";
  }

  downItem(): void {
    const index = this.selectedRow;
    const length = this.numberingConfigForm.controls["VoucherFormat"].value
      .length;
    if (index != length - 1) {
      (<FormArray>this.numberingConfigForm.controls["VoucherFormat"]).at(index);
      console.log(
        JSON.stringify(this.numberingConfigForm.controls["VoucherFormat"].value)
      );
      let group = (<FormArray>this.numberingConfigForm.get("VoucherFormat")).at(
        index
      );
      (<FormArray>this.numberingConfigForm.get("VoucherFormat")).removeAt(
        index
      );
      (<FormArray>this.numberingConfigForm.get("VoucherFormat")).insert(
        index + 1,
        group
      );
      this.selectedRow = index + 1;
    }
  }

  upItem(): void {
    const index = this.selectedRow;
    if (index != 0) {
      const temp = Object.assign(
        {},
        (<FormArray>this.numberingConfigForm.controls["VoucherFormat"]).at(
          index - 1
        ).value
      );
      (<FormArray>this.numberingConfigForm.controls["VoucherFormat"])
        .at(index - 1)
        .setValue(
          (<FormArray>this.numberingConfigForm.controls["VoucherFormat"]).at(
            index
          ).value
        );
      (<FormArray>this.numberingConfigForm.controls["VoucherFormat"])
        .at(index)
        .setValue(temp);
      this.selectedRow = index - 1;
    }
  }

  deleteItem(): void {
    const index = this.selectedRow;
    (<FormArray>this.numberingConfigForm.controls["VoucherFormat"]).removeAt(
      index
    );
  }

  getSeriesDD(voucherType): void {
    this.configService.getSeriesList(voucherType).subscribe((response) => {
      this.seriesDropDownList = response.Entity;
    });
  }

  expandAllNode(): void {
    this.expandedKeys = this.seriesNode;
  }

  public addHandler({ sender }) {
    const invoiceEntry = <FormArray>(
      this.numberingConfigForm.get("VoucherFormat")
    );
    if (invoiceEntry.invalid) return;
    (<FormArray>this.numberingConfigForm.get("VoucherFormat")).push(
      this.addNumberingFormatFromGroup()
    );
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.numberingConfigForm.get("VoucherFormat")).removeAt(
      rowIndex
    );
  }
}
