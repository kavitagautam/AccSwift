import { Component, OnInit } from '@angular/core';
import { PreferenceService } from "../../../preference/services/preference.service";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Users } from "@accSwift-modules/user/models/user.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@accSwift-modules/user/services/user.service';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'accSwift-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {
  users: Users;
  profileForm: FormGroup;
  editableForm: boolean = false;
  editMode: boolean = false;
  modalRef: BsModalRef;
  userID: number;

  constructor(
    public preferenceService: PreferenceService,
    private router: Router, public userService: UserService,
    private route: ActivatedRoute,
    private _fb: FormBuilder, 
    private toastr: ToastrService, 
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getIdFromRoute();
    this.buildProfileForm()
    this.getProfile();
  }



  // Get id from route
  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if(param){
        console.log("Params" + params)
        this.userID=parseInt(param)
      }
     
    });
  }

  getProfile(): void {
    this.userService.getUserProfile().subscribe(
      (response) => {
        this.users = response.Entity;
      },
    );
  }

  buildProfileForm(): void{
    this.profileForm = this._fb.group({
      Password: ["", Validators.required],
      VerifyPassword: ["", Validators.required],
      UserID: [""],
      UserName: ["", Validators.required],
      Name: [this.users ? this.users.Name : "", Validators.required],
      Address: [""],
      Contact: [""],
      Email: [this.users ? this.users.Email : ""],
      Department: [""],
      AccessRoleID: [null, Validators.required],
      AccessRoleName: [""],
      AccClassID: [this.preferenceService.preferences
        ? this.preferenceService.preferences.DEFAULT_ACC_CLASS.Value
        : null,
      Validators.required,],
    
      AccClassName: [""],
    })
  }

  onSubmitUser(): void {
    // console.log(this.profileForm.invalid);
    if (this.profileForm.invalid) return;
    console.log(this.profileForm.value);
    this.profileForm.get("UserID").setValue(this.userID);
    this.userService.updateUser(this.profileForm.value).subscribe(
      (response) => {
      //  this.getProfile();
       this.router.navigate(["/user"]);

      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        // this.modalRef.hide();
        this.buildProfileForm();
        this.toastr.success("User edited successfully");
      }
    );
  }

  close(): void {
    // this.modalRef.hide();
    this.editableForm = false;
    this.buildProfileForm();
  }
  
}
