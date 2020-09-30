import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsReportsComponent } from './settings-reports.component';

describe('SettingsReportsComponent', () => {
  let component: SettingsReportsComponent;
  let fixture: ComponentFixture<SettingsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
