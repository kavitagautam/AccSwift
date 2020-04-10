import { TestBed } from "@angular/core/testing";
import { DayBookService } from "./day-book.service";

describe("DayBookService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: DayBookService = TestBed.get(DayBookService);
    expect(service).toBeTruthy();
  });
});
