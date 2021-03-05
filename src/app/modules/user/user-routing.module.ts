import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { profile } from 'console';
import { UserListComponent } from "./components/user-list/user-list.component";
import { UserprofileComponent } from './components/userprofile/userprofile.component';


const routes: Routes = [{ path: "", component: UserListComponent },
{ path: "profile/:id", component: UserprofileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
