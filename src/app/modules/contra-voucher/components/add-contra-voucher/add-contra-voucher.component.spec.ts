import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContraVoucherComponent } from './add-contra-voucher.component';

describe('AddContraVoucherComponent', () => {
  let component: AddContraVoucherComponent;
  let fixture: ComponentFixture<AddContraVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContraVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContraVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
