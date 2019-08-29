import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddJournalComponent } from './add-journal/add-journal.component';
import { EditJournalComponent } from './edit-journal/edit-journal.component';
import { ListJournalComponent } from './list-journal/list-journal.component';

const routes: Routes = [
    {
        path: "add",
        component: AddJournalComponent
    },
    {
        path: "edit",
        component: EditJournalComponent
    },
    {
        path: "",
        component: ListJournalComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JournalVoucherRoutingModule { }
