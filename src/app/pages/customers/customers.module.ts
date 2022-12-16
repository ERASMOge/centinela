import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './customers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NewClientComponent } from './popup/new-client/new-client.component';
import { DeleteComponent } from './popup/delete/delete.component';
import { CustomerCompanyComponent } from './customer-company/customer-company.component';
import { TableTicketsComponent } from './table-tickets/table-tickets.component';
import { TableServiceComponent } from './table-service/table-service.component';
import { TableLogComponent } from './table-log/table-log.component';
import { TableRsComponent } from './table-rs/table-rs.component';
import { TableContactComponent } from './table-contact/table-contact.component';
import { NewTicketComponent } from './popup/new-ticket/new-ticket.component';
import { NewLogComponent } from './popup/new-log/new-log.component';
import { NewContactComponent } from '../../shared/components/popup/new-contact/new-contact.component';
import { NewRsComponent } from './popup/new-rs/new-rs.component';
import { NewServiceComponent } from './popup/new-service/new-service.component';
import { ViewServiceComponent } from './view-service/view-service.component';
import { TableEquipamentComponent } from './table-equipment/table-equipment.component';
import { NewEquipamentComponent } from './popup/new-equipament/new-equipament.component';
import { NewRadioComponent } from './popup/new-radio/new-radio.component';
import { TableRadioComponent } from './table-radio/table-radio.component';
import { TableRouterComponent } from './table-router/table-router.component';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';
import { InfoContactComponent } from './popup/info-contact/info-contact.component';
import { EditAddressComponent } from './popup/edit-address/edit-address.component';

@NgModule({
  imports: [
    NgbPaginationModule,
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    MatPaginatorModule
  ],
  declarations: [
    CustomerListComponent,
    NewClientComponent,
    DeleteComponent,
    CustomerCompanyComponent,
    TableTicketsComponent,
    TableServiceComponent,
    TableLogComponent,
    TableRsComponent,
    TableContactComponent,
    NewTicketComponent,
    NewLogComponent,
    NewContactComponent,
    NewRsComponent,
    NewServiceComponent,
    ViewServiceComponent,
    TableEquipamentComponent,
    NewEquipamentComponent,
    NewRadioComponent,
    TableRadioComponent,
    TableRouterComponent,
    InfoContactComponent,
    EditAddressComponent
  ],
  exports: [
    CustomerListComponent,
    NewClientComponent
  ],
  providers: [
    { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } }
  ]
})
export class CustomersModule { }
