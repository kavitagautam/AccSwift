import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SettingsComponent } from "./components/settings.component";

const routes: Routes = [
  { path: "", component: SettingsComponent, data: { breadcrumb: "Settings" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
