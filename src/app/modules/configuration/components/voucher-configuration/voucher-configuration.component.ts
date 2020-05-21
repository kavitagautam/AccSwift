import { Component, OnInit } from "@angular/core";
import { VoucherConfiguration, Tree } from "../../models/configuration.model";
import { ConfigurationService } from "../../services/configuration.service";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "accSwift-voucher-configuration",
  templateUrl: "./voucher-configuration.component.html",
  styleUrls: ["./voucher-configuration.component.scss"],
})
export class VoucherConfigurationComponent implements OnInit {
  seriesTreeView: Tree[];
  seriesNode: string[];
  treeViewLoading: boolean;
  configDetails: VoucherConfiguration;
  numberingConfigForm: FormGroup;
  public expandedKeys: any[] = ["Main"];
  constructor(
    private configService: ConfigurationService,
    private _fb: FormBuilder
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
      }),
    });
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
        this.buildNumberingConfigForms();
      });
  }

  expandAllNode(): void {
    this.expandedKeys = this.seriesNode;
  }
}
