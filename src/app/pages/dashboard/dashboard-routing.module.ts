import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';

import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardRedComponent } from './dashboard-red/dashboard-red.component';
import { DashboardTicketsComponent } from './dashboard-tickets/dashboard-tickets.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard-red', component: DashboardRedComponent },
      {path: 'dashboard-tickets', component: DashboardTicketsComponent},
      {path: 'dashboard-home', component: DashboardHomeComponent}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
