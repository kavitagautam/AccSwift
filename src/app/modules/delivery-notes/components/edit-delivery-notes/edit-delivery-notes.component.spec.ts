import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeliveryNotesComponent } from './edit-delivery-notes.component';

describe('EditDeliveryNotesComponent', () => {
  let component: EditDeliveryNotesComponent;
  let fixture: ComponentFixture<EditDeliveryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDeliveryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeliveryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
