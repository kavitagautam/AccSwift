import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherFormsComponent } from './voucher-forms.component';

describe('VoucherFormsComponent', () => {
  let component: VoucherFormsComponent;
  let fixture: ComponentFixture<VoucherFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
