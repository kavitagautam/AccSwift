import { Component, OnInit } from "@angular/core";
import { ImageCroppedEvent} from "ngx-image-cropper";
import { SelectEvent } from "@progress/kendo-angular-upload";

@Component({
  selector: "accSwift-product-image",
  templateUrl: "./product-image.component.html",
  styleUrls: ["./product-image.component.scss"],
})
export class ProductImageComponent implements OnInit {
  imageChangedEvent: Array<any> = [];
  croppedImage: any = "";

  constructor() {}

  ngOnInit() {}

  fileChangeEvent(event): void {
    console.log("Event " + JSON.stringify(event));
    this.imageChangedEvent = event;
    console.log("data of image " + JSON.stringify(this.imageChangedEvent));
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  saveCroppedImg(): void {
    this.imageChangedEvent = null;
  }

  cancel(event): void {
   
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
            src: ev.target['result'],
            uid: file.uid
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
      }
    }
  }
}
