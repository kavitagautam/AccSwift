import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateSelectionSettingsComponent } from './date-selection-settings.component';

describe('DateSelectionSettingsComponent', () => {
  let component: DateSelectionSettingsComponent;
  let fixture: ComponentFixture<DateSelectionSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateSelectionSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateSelectionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
