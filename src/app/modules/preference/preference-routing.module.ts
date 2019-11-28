import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PreferenceComponent } from "./components/preference/preference.component";

const routes: Routes = [
  {
    path: "",
    component: PreferenceComponent,
    data: { breadcrumb: "Preferences" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenceRoutingModule {}
