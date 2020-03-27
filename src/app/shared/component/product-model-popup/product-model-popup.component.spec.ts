import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModelPopupComponent } from './product-model-popup.component';

describe('ProductModelPopupComponent', () => {
  let component: ProductModelPopupComponent;
  let fixture: ComponentFixture<ProductModelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductModelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
