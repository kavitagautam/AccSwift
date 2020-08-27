import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./component/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

@NgModule({
  declarations: [LoginComponent],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, LoginRoutingModule],
  providers: [CookieService],
})
export class LoginModule {}
