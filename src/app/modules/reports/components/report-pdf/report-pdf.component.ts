import { Component, OnInit, ViewEncapsulation  } from '@angular/core';

@Component({
  selector: 'app-report-pdf',
  templateUrl: './report-pdf.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./report-pdf.component.scss']
})
export class ReportPdfComponent implements OnInit {
  public repeatHeaders = true;

  constructor() { }

  ngOnInit() {
  }

}
