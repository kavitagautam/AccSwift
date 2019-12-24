import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesReturnComponent } from './edit-sales-return.component';

describe('EditSalesReturnComponent', () => {
  let component: EditSalesReturnComponent;
  let fixture: ComponentFixture<EditSalesReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSalesReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSalesReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
