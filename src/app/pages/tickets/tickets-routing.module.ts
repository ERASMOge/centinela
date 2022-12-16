import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashAdminGuard } from 'src/app/core/guards/dashAdmin.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { AllTicketsComponent } from './all-tickets/all-tickets.component';
import { TicketEntryComponent } from './ticket-entry/ticket-entry.component';
import { VistaTicketComponent } from './vista-ticket/vista-ticket.component';

const routes: Routes = [
  {  path: '',
  component: LayoutComponent,
  children:[
    { path: 'ticket-entry', canActivate:[DashAdminGuard], component: TicketEntryComponent },
    { path: 'all-tickets', canActivate:[DashAdminGuard], component: AllTicketsComponent },
    { path: 'general', canActivate:[DashAdminGuard], component: AllTicketsComponent },
    { path: 'edit-ticket', canActivate:[DashAdminGuard], component: VistaTicketComponent,
    children:[ 
      {path: ":id",canActivate:[DashAdminGuard], component:VistaTicketComponent}
    ]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
