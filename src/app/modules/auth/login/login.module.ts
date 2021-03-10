import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./component/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { ForgetPasswordComponent } from '@accSwift-modules/accswift-shared/components/forget-password/forget-password.component';
import { AccswiftSharedModule } from '@accSwift-modules/accswift-shared/accswift-shared.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule,AccswiftSharedModule, SharedModule, LoginRoutingModule],
  providers: [CookieService],
  entryComponents:[ForgetPasswordComponent]
})
export class LoginModule {}
