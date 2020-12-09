import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartsModule } from '@progress/kendo-angular-charts';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./component/dashboard.component";
import { GridModule } from '@progress/kendo-angular-grid';
import { AccswiftSharedModule } from "@accSwift-modules/accswift-shared/accswift-shared.module";


@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, ChartsModule, GridModule, AccswiftSharedModule]
})
export class DashboardModule {}
