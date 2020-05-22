import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  VoucherConfiguration,
  Tree,
  SeriesList,
} from "../../models/configuration.model";
import { ConfigurationService } from "../../services/configuration.service";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";

@Component({
  selector: "accSwift-voucher-configuration",
  templateUrl: "./voucher-configuration.component.html",
  styleUrls: ["./voucher-configuration.component.scss"],
})
export class VoucherConfigurationComponent implements OnInit {
  seriesTreeView: Tree[];
  seriesNode: string[];
  seriesID: number;
  seriesDropDownList: SeriesList[];
  treeViewLoading: boolean;
  configDetails: VoucherConfiguration;
  numberingConfigForm: FormGroup;
  modalRef: BsModalRef;
  public expandedKeys: any[] = ["Main"];
  constructor(
    private configService: ConfigurationService,
    private _fb: FormBuilder,
    private modalService: BsModalService
  ) {}

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
  renumberingFreq = [
    { id: 1, value: "Annual" },
    { id: 2, value: "Daily" },
  ];

  ngOnInit(): void {
    this.getSeriesTreeView();
    this.buildNumberingConfigForms();
  }

  buildNumberingConfigForms(): void {
    this.numberingConfigForm = this._fb.group({
      VouchNumberConfiguration: this._fb.group({
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
        VoucherFormat: this._fb.array([this.addNumberingFormatFromGroup()]),
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
            SeriesID: [element.seriesID],
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
      class: "modal-sm",
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

  selectedNode(dataItem): void {
    this.configService
      .getVoucherConfigDetails(dataItem.ID)
      .subscribe((response) => {
        this.configDetails = response.Entity;
        this.getSeriesDD(response.Entity.VoucherType);
        this.seriesID = dataItem.ID;
        this.buildNumberingConfigForms();
        this.setNumberingFormatFormArray(this.configDetails.VoucherFormat);
      });
  }

  getSeriesDD(voucherType): void {
    this.configService.getSeriesList(voucherType).subscribe((response) => {
      this.seriesDropDownList = response.Entity;
    });
  }

  expandAllNode(): void {
    this.expandedKeys = this.seriesNode;
  }
}
