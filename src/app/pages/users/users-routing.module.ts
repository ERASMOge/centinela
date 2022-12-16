import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { support_billing } from 'src/app/core/guards/support_billing.guard';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { GruposComponent } from './grupos/grupos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: 'usuarios', canActivate:[support_billing], component: UsuariosComponent },
      { path: 'grupos', canActivate:[support_billing], component: GruposComponent },

    ]}]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
