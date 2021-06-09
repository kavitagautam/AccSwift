import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAccessRolesComponent } from './list-access-roles.component';

describe('ListAccessRolesComponent', () => {
  let component: ListAccessRolesComponent;
  let fixture: ComponentFixture<ListAccessRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAccessRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAccessRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
