import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardTicketsComponent } from './dashboard-tickets/dashboard-tickets.component';
import { DashboardRedComponent } from './dashboard-red/dashboard-red.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatGridListModule } from '@angular/material/grid-list';
import { ViewTicketsEnterpriseComponent } from './forms/view-tickets-enterprise/view-tickets-enterprise.component';
import { ViewEstatusEnterpriseComponent } from './forms/view-estatus-enterprise/view-estatus-enterprise.component';
import { TableTicketsComponent } from './table/table-tickets/table-tickets.component';
import { ViewSinRespuestaComponent } from './forms/view-sin-respuesta/view-sin-respuesta.component';
import { TableSinRespuestaComponent } from './table/table-sin-respuesta/table-sin-respuesta.component';
import { ViewSinSeguimientoComponent } from './forms/view-sin-seguimiento/view-sin-seguimiento.component';
import { TableSinSeguimientoComponent } from './table/table-sin-seguimiento/table-sin-seguimiento.component';
import { ViewDentroEstandarComponent } from './forms/view-dentro-estandar/view-dentro-estandar.component';
import { ViewFueraEstandarComponent } from './forms/view-fuera-estandar/view-fuera-estandar.component';
import { TableEstandarComponent } from './table/table-estandar/table-estandar.component';
import { ViewTicketMaloComponent } from './forms/view-ticket-malo/view-ticket-malo.component';
import { TableTicketMaloComponent } from './table/table-ticket-malo/table-ticket-malo.component';
@NgModule({
  declarations: [
    DashboardHomeComponent, 
    DashboardTicketsComponent, 
    DashboardRedComponent, 
    ViewTicketsEnterpriseComponent, 
    ViewEstatusEnterpriseComponent, 
    TableTicketsComponent,
    ViewSinRespuestaComponent,
    TableSinRespuestaComponent,
    ViewSinSeguimientoComponent,
    TableSinSeguimientoComponent,
    ViewDentroEstandarComponent,
    ViewFueraEstandarComponent,
    TableEstandarComponent,
    ViewTicketMaloComponent,
    TableTicketMaloComponent
  ],
  imports: [
    NgApexchartsModule,
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MatGridListModule,
  ],
  entryComponents: []
})
export class DashboardModule { }
