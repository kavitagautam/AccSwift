import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBalanceReportComponent } from './group-balance-report.component';

describe('GroupBalanceReportComponent', () => {
  let component: GroupBalanceReportComponent;
  let fixture: ComponentFixture<GroupBalanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBalanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
