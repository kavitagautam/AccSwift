import { Component, OnInit } from "@angular/core";
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: "accSwift-product-image",
  templateUrl: "./product-image.component.html",
  styleUrls: ["./product-image.component.scss"]
})
export class ProductImageComponent implements OnInit {
  imageChangedEvent: Array<any> = [];
  croppedImage: any = "";

  constructor() {}

  ngOnInit() {}

  fileChangeEvent(event: any): void {
    console.log("Event " + event);
    this.imageChangedEvent = event;
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
      }
    }
  }
}
