import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccessRolesComponent } from './edit-access-roles.component';

describe('EditAccessRolesComponent', () => {
  let component: EditAccessRolesComponent;
  let fixture: ComponentFixture<EditAccessRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccessRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
