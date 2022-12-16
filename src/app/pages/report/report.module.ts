import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ReportsRoutingModule } from './report-routing.module';
import { TicketAdviserComponent } from './ticket-adviser/ticket-adviser.component';
import { ServiceComponent } from './service/service.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TicketSopportComponent } from './ticket-sopport/ticket-sopport.component';

@NgModule({
  declarations: [
    TicketAdviserComponent,
    ServiceComponent,
    TicketSopportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    NgbPaginationModule
  ]
})
export class ReportsModule { }
