import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginContactoComponent } from './auth/login-contacto/login-contacto.component';
import { LoginUsuarioComponent } from './auth/login-usuario/login-usuario.component';
import { InicioGuard } from './core/guards/inicio.guard';
import { DashUsuarioGuard } from './core/guards/dashUsuario.guard';
import { DashAdminGuard } from './core/guards/dashAdmin.guard';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';


const appRoutes: Routes = [ 
  { path: 'admin/client', canActivate:[DashAdminGuard],loadChildren: () => import('../app/pages/customers/customers.module').then(m => m.CustomersModule) },
  { path: 'usuario',canActivate:[InicioGuard], component: LoginUsuarioComponent },
  { path: 'admin',canActivate:[InicioGuard], component: LoginContactoComponent },
  { path: 'admin/dashboard',canActivate:[DashAdminGuard], loadChildren: () => import('../app/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'usuario/dashboard',canActivate:[DashUsuarioGuard], loadChildren: () => import('../app/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'admin/red',canActivate:[DashAdminGuard], loadChildren: () => import('./pages/red/red.module').then(m => m.RedModule) },
  { path: 'admin/configuracion',canActivate:[DashAdminGuard], loadChildren: () => import('./pages/configuracion/configuracion.module').then(m => m.ConfiguracionModule) },
  { path: '',canActivate:[InicioGuard],component: LoginContactoComponent},
  { path: 'admin/report', loadChildren: () => import('./pages/report/report.module').then(m => m.ReportsModule) },
  { path: 'admin/manual', loadChildren: () => import('./pages/manual/manual.module').then(m => m.ManualModule) },
  { path: 'admin/tickets', loadChildren: () => import('./pages/tickets/tickets.module').then(m => m.TicketsModule) },
  { path: 'admin/catalogos', loadChildren: () => import('./pages/catalogos/catalogo.module').then(m => m.CatalogoModule) },
  { path: 'admin/users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule) },
  { path: '**',canActivate:[InicioGuard], component: LoginUsuarioComponent},  
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,{useHash:true})
  ],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class AppRoutingModule { }
