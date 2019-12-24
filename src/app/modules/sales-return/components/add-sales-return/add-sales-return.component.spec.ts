import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesReturnComponent } from './add-sales-return.component';

describe('AddSalesReturnComponent', () => {
  let component: AddSalesReturnComponent;
  let fixture: ComponentFixture<AddSalesReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
