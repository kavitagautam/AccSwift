import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundUnitComponent } from './compound-unit.component';

describe('CompoundUnitComponent', () => {
  let component: CompoundUnitComponent;
  let fixture: ComponentFixture<CompoundUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
