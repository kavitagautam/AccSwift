import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./admin-panel/footer/footer.component";
import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import { RouterModule } from "@angular/router";
import { MenuItemComponent } from "./admin-panel/side-nav/menu-item/menu-item.component";
// import { MenuItemComponent } from "./admin-panel/sidebar/menu-item/menu-item.component";
import { MatIconModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@app/shared/shared.module";
import { ConfirmationDialogComponent } from "@app/shared/component/confirmation-dialog/confirmation-dialog.component";
import { NavBarComponent } from "./admin-panel/nav-bar/nav-bar.component";
import { SideNavComponent } from "./admin-panel/side-nav/side-nav.component";

@NgModule({
  declarations: [
    AdminPanelComponent,
    // TopbarComponent,
    // SidebarComponent,
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
    SharedModule
  ],
  entryComponents: [ConfirmationDialogComponent, FooterComponent],
  exports: [ConfirmationDialogComponent, FooterComponent]
})
export class LayoutModule {}
