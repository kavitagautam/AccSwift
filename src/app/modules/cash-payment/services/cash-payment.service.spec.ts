import { TestBed } from '@angular/core/testing';
import { CashPaymentService } from './cash-payment.service';


describe('CashPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashPaymentService = TestBed.get(CashPaymentService);
    expect(service).toBeTruthy();
  });
});
