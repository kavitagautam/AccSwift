import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { ProductService } from "@app/modules/product/services/product.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ToastrService } from "ngx-toastr";
import { SelectEvent } from "@progress/kendo-angular-upload";
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: "accSwift-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  private editedRowIndex: number;
  imageChangedEvent: Array<any> = [];
  croppedImage: any = "";

  submitted: boolean;

  rowSubmitted: boolean;
  selectedProductId: number;

  // modal config to unhide modal when clicked outside
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  constructor(
    private _fb: FormBuilder,
    public productService: ProductService,
    private toastr: ToastrService,
    public modalRef: BsModalRef,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.buildProductForm();
  }

  buildProductForm(): void {
    this.productForm = this._fb.group({
      ID: 0,
      Name: ["", Validators.required],
      GroupID: [null, Validators.required],
      ProductCode: ["", Validators.required],
      ProductColor: [""],
      DepotID: [null, Validators.required],
      UnitID: [null, Validators.required],
      ParentProductID: 0,
      Size: 0,
      IsVatApplicable: [false, Validators.required],
      IsInventoryApplicable: [false],
      IsDecimalApplicable: [false],
      IsActive: true,
      ProductImage: [""],
      ContactPerson: [""],
      Address1: [""],
      Address2: [""],
      City: [""],
      Telephone: [""],
      Email: [""],
      Company: [""],
      Website: [""],
      BackColor: 0,
      OpeningQuantity: this._fb.array([this.addOpeningBalanceFormGroup()]),
      Remarks: [""],

      // productCode: ["", Validators.required],
      // productName: ["", Validators.required],
      // productGroupId: [null, Validators.required],
      // departmentandLocationId: [null, Validators.required],
      // baseUnitId: [null, Validators.required],
      // isVatApplicable: [false, Validators.required],
      // isDecimalApplicable: [false],
      // isInventoryApplicable: [false],
      // remarks: [""],
      // openingBalanceList: this._fb.array([this.addOpeningBalanceFormGroup()]),
      // moreDetails: new FormControl(""),
    });
  }

  addOpeningBalanceFormGroup(): FormGroup {
    return this._fb.group({
      ID: 0,
      ProductID: 0,
      AccClassID: [
        this.productService.accountClass
          ? this.productService.accountClass[0].ID
          : null,
      ],
      OpenPurchaseQty: 0,
      OpenPurchaseRate: 0,
      OpenSalesRate: 0,
      OpenQuantityDate: [new Date()],
    });
  }

  get getOpeningBalanceList(): FormArray {
    return <FormArray>this.productForm.get("OpeningQuantity");
  }

  fileChangeEvent(event): void {
    this.imageChangedEvent = event;
  }
  public events: string[] = [];
  public imagePreviews: any[] = [];

  public selectEventHandler(e: SelectEvent): void {
    const that = this;

    e.files.forEach((file) => {
      that.log(`File selected: ${file.name}`);

      if (!file.validationErrors) {
        const reader = new FileReader();

        reader.onload = function (ev) {
          const image = {
            src: ev.target["result"],
            uid: file.uid,
          };

          that.imagePreviews.unshift(image);
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  private log(event: string): void {
    this.events.unshift(`${event}`);
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  //File Select
  urls = [];
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
        this.productForm.get("ProductImage").setValue(reader);
      }
    }
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.submitted = true;
    this.rowSubmitted = true;
    if (this.productForm.get("OpeningQuantity").invalid) return;
    (<FormArray>this.productForm.get("OpeningQuantity")).push(
      this.addOpeningBalanceFormGroup()
    );
    this.rowSubmitted = false;
    this.submitted = false;
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.productForm.get("OpeningQuantity"));
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const product = formGroup.value;
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem, rowIndex }): void {
    (<FormArray>this.productForm.get("OpeningQuantity")).removeAt(rowIndex);
  }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
  }

  save(): void {
    if (this.productForm.invalid) return;

    this.productService.addProduct(this.productForm.value).subscribe(
      (response) => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.toastr.success("Product added successfully");
      }
    );
  }

  cancel(event): void {
    this.buildProductForm();
  }

  formInitialized(name: string, form: FormGroup) {
    this.productForm.setControl(name, form);
  }
}
