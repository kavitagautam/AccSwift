import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductModalPopupComponent } from "./product-modal-popup.component";

describe("ProductModalPopupComponent", () => {
  let component: ProductModalPopupComponent;
  let fixture: ComponentFixture<ProductModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductModalPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
