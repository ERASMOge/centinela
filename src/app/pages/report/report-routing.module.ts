import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { billing } from 'src/app/core/guards/billing.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { ServiceComponent } from './service/service.component';
import { TicketAdviserComponent } from './ticket-adviser/ticket-adviser.component';
import { TicketSopportComponent } from './ticket-sopport/ticket-sopport.component';

const routes: Routes = [
  
  {  path: '',
  component: LayoutComponent,
  children:[
    { path: 'ticket-adviser', canActivate:[billing], component: TicketAdviserComponent },
    { path: 'service',canActivate:[billing], component: ServiceComponent },
    { path: 'ticket-support',canActivate:[billing], component: TicketSopportComponent },

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
