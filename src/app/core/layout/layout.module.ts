import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TopbarComponent } from "./admin-panel/topbar/topbar.component";
import { SidebarComponent } from "./admin-panel/sidebar/sidebar.component";
import { FooterComponent } from "./admin-panel/footer/footer.component";
import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import { RouterModule } from "@angular/router";
import { MenuItemComponent } from "./admin-panel/sidebar/menu-item/menu-item.component";
import { MatIconModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@app/shared/shared.module";
import { ConfirmationDialogComponent } from '@app/shared/component/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AdminPanelComponent,
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
    MenuItemComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  entryComponents: [ConfirmationDialogComponent],
  exports: [ConfirmationDialogComponent]
})
export class LayoutModule {}
