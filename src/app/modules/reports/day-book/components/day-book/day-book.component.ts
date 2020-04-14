import { Component, OnInit } from "@angular/core";
import { DayBookService } from "../../services/day-book.service";

@Component({
  selector: "accSwift-day-book",
  templateUrl: "./day-book.component.html",
  styleUrls: ["./day-book.component.scss"],
})
export class DayBookComponent implements OnInit {
  dayBookList: any[] = [];
  listLoading: boolean;

  debitTotal: number;
  creditTotal: number;

  constructor(private dayBookService: DayBookService) {}

  ngOnInit() {
    this.getDayBook();
  }

  getDayBook(): void {
    this.listLoading = true;
    this.dayBookService.getDayBookData().subscribe(
      (response) => {
        this.dayBookList = response.Entity.Entity;
        this.debitTotal = response.Entity.DebitTotal;
        this.creditTotal = response.Entity.CreditTotal;
      },
      (error) => {
        this.listLoading = false;
      },
      () => {
        this.listLoading = false;
      }
    );
  }
}
