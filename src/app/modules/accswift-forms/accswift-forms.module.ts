import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SeriesFormsComponent } from "./forms-components/series-forms/series-forms.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ProjectFormsComponent } from "./forms-components/project-forms/project-forms.component";

@NgModule({
  declarations: [SeriesFormsComponent, ProjectFormsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SeriesFormsComponent, ProjectFormsComponent],
})
export class AccswiftFormsModule {}
