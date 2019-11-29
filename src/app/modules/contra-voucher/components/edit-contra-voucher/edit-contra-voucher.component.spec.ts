import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContraVoucherComponent } from './edit-contra-voucher.component';

describe('EditContraVoucherComponent', () => {
  let component: EditContraVoucherComponent;
  let fixture: ComponentFixture<EditContraVoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContraVoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContraVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
