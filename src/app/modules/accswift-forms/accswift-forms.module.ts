import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SeriesFormsComponent } from "./forms-components/series-forms/series-forms.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ProjectFormsComponent } from "./forms-components/project-forms/project-forms.component";
import { CashAccountComponent } from "./forms-components/cash-account/cash-account.component";

@NgModule({
  declarations: [
    SeriesFormsComponent,
    ProjectFormsComponent,
    CashAccountComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SeriesFormsComponent, ProjectFormsComponent, CashAccountComponent],
})
export class AccswiftFormsModule {}
