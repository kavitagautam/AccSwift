import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company/company.component';
import { AddCompanyComponent } from './company/add-company/add-company.component';
import { ListCompanyComponent } from './company/list-company/list-company.component';
import { EditCompanyComponent } from './company/edit-company/edit-company.component';

@NgModule({
  declarations: [CompanyComponent, AddCompanyComponent, ListCompanyComponent, EditCompanyComponent],
  imports: [
    CommonModule,
    CompanyRoutingModule
  ]
})
export class CompanyModule { }
