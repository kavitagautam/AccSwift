import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUnitMaintenanceComponent } from './list-unit-maintenance.component';

describe('ListUnitMaintenanceComponent', () => {
  let component: ListUnitMaintenanceComponent;
  let fixture: ComponentFixture<ListUnitMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListUnitMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListUnitMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
