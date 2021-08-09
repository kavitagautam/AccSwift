import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyInvoicesComponent } from './party-invoices.component';

describe('PartyInvoicesComponent', () => {
  let component: PartyInvoicesComponent;
  let fixture: ComponentFixture<PartyInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
