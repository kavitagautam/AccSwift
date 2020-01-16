import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./admin-panel/footer/footer.component";
import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import { RouterModule } from "@angular/router";
import { MenuItemComponent } from "./admin-panel/side-nav/menu-item/menu-item.component";
import { BreadcrumbsModule } from "ng6-breadcrumbs";
import { MatIconModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@app/shared/shared.module";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { NavBarComponent } from "./admin-panel/nav-bar/nav-bar.component";
import { SideNavComponent } from "./admin-panel/side-nav/side-nav.component";

@NgModule({
  declarations: [
    AdminPanelComponent,

    FooterComponent,
    MenuItemComponent,
    ConfirmationDialogComponent,
    NavBarComponent,
    SideNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    BrowserAnimationsModule,
    SharedModule,
    BreadcrumbsModule
  ],
  entryComponents: [ConfirmationDialogComponent, FooterComponent],
  exports: [ConfirmationDialogComponent, FooterComponent]
})
export class LayoutModule {}
