import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "@accSwift-modules/user/services/user.service";

@Component({
  selector: 'accSwift-basic-add-edit-user',
  templateUrl: './basic-add-edit-user.component.html',
  styleUrls: ['./basic-add-edit-user.component.scss']
})
export class BasicAddEditUserComponent implements OnInit {
  addUserForm: FormGroup;

  constructor( 
    private _fb: FormBuilder,
    private toastr: ToastrService,
    public modalRef: BsModalRef,
    private modalService: BsModalService,
    public userService: UserService) { }

  ngOnInit() {
    this.buildUserForm();
  }
  buildUserForm(): void {
    this.addUserForm = this._fb.group({
      Password: ["", Validators.required],
      VerifyPassword: ["", Validators.required],
      UserID: [0],
      UserName: ["", Validators.required],
      Name: ["", Validators.required],
      Address: [""],
      Contact: [""],
      Email: [""],
      Department: [""],
      AccessRoleID: [null, Validators.required],
      AccessRoleName: [""],
      AccClassID: [null],
      AccClassName: [""],
    });
  }
 
}
