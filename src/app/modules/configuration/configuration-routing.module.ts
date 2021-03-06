import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VoucherConfigurationComponent } from "./components/voucher-configuration/voucher-configuration.component";

const routes: Routes = [{ path: "", component: VoucherConfigurationComponent ,data:{breadcrumb: "Voucher Configuration"}}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
