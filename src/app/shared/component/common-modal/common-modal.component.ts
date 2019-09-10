import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})
export class CommonModalComponent implements OnInit {
 @ViewChild('childModal') public childModal: ModalDirective;
  @Input() title?:string;

  constructor() { }

  ngOnInit() {
  }

  show(){
    this.childModal.show();
  }
  hide(){
    this.childModal.hide();
  }

}
