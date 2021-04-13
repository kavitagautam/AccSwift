import { Component, OnInit} from '@angular/core';
import { PreferenceService } from "../../../preference/services/preference.service";
import { ToastrService } from "ngx-toastr";
import { BsModalService, BsModalRef } from "ngx-bootstrap";
import { Users } from "@accSwift-modules/user/models/user.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@accSwift-modules/user/services/user.service';
import { Route } from '@angular/compiler/src/core';
import { profile } from 'console';

@Component({
  selector: 'accSwift-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {

  fieldTextType: boolean;
  users: Users;
  profileForm: FormGroup;
  userID: number;

  constructor(
    public preferenceService: PreferenceService,
    private router: Router, public userService: UserService,
    private route: ActivatedRoute,
    private _fb: FormBuilder, 
    private toastr: ToastrService, 
    private modalService: BsModalService) { }

  ngOnInit() {
    this.buildProfileForm()
    this.getIdFromRoute();
    this.getProfile();
  }

  // Get id from route
  getIdFromRoute(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get("id");
      if(param){
        this.userID=parseInt(param);
      }
    });
  }

  getProfile(): void {
    this.userService.getUserProfile().subscribe(
      (response) => {
        this.users = response.Entity;
        this.profileForm.patchValue(this.users);
      },
    );
  }

  buildProfileForm(): void {
    this.profileForm = this._fb.group({
      Password: [this.users ? this.users.Password : "", Validators.required],
      VerifyPassword: ["", Validators.required],
      UserID: [""],
      UserName: [this.users ? this.users.UserName : "", Validators.required],
      Name: [this.users ? this.users.Name : "", Validators.required],
      Address: [this.users ? this.users.Address : ""],
      Contact: [this.users ? this.users.Contact : ""],
      Email: [this.users ? this.users.Email : ""],
      Department: [this.users ? this.users.Department : ""],
      AccessRoleID: [this.users ? this.users.AccessRoleID : null, Validators.required],
      AccessRoleName: [this.users ? this.users.AccessRoleName : ""],
      AccClassID: [this.preferenceService.preferences
        ? this.preferenceService.preferences.DEFAULT_ACC_CLASS.Value
        : null,
      Validators.required,],
    
      AccClassName: [this.users ? this.users.AccClassName : ""],
    })
  }

  togglePwFieldType():void {
    this.fieldTextType = !this.fieldTextType;
  }

  onSubmitUser(): void {
      if (this.profileForm.invalid) return;
      console.log(this.profileForm.value);
      this.profileForm.get("UserID").setValue(this.userID);
      this.editUser();
  }

  editUser(): void {
    this.userService.updateUser(this.profileForm.value).subscribe(
      (response) => {
       this.router.navigate(["/user"]);

      },
      (error) => {
        this.toastr.error(JSON.stringify(error.error.Message));
      },
      () => {
        this.buildProfileForm();
        this.toastr.success("User edited successfully");
      }
    );
  }

  close(): void {
    this.router.navigate(["/user"]);
  }

}
