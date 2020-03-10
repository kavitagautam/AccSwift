import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMoreDetailComponent } from './product-more-detail.component';

describe('ProductMoreDetailComponent', () => {
  let component: ProductMoreDetailComponent;
  let fixture: ComponentFixture<ProductMoreDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMoreDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMoreDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
