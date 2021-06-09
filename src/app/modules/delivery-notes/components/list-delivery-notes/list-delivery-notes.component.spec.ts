import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDeliveryNotesComponent } from './list-delivery-notes.component';

describe('ListDeliveryNotesComponent', () => {
  let component: ListDeliveryNotesComponent;
  let fixture: ComponentFixture<ListDeliveryNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDeliveryNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDeliveryNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
