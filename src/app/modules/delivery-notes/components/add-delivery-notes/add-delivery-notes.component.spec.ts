import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryNotesComponent } from './add-delivery-notes.component';

describe('AddDeliveryNotesComponent', () => {
  let component: AddDeliveryNotesComponent;
  let fixture: ComponentFixture<AddDeliveryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeliveryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeliveryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
