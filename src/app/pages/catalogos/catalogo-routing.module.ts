import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { billing } from "src/app/core/guards/billing.guard";
import { DashAdminGuard } from "src/app/core/guards/dashAdmin.guard";
import { LayoutComponent } from "src/app/shared/layout/layout.component";
import { AsuntoComponent } from "./asunto/asunto.component";
import { CiudadComponent } from "./ciudad/ciudad.component";
import { PlanComponent } from "./plan/plan.component";

const routes : Routes = [
    {
        path : '', 
        component : LayoutComponent,
        children: [
            { path : 'plan' , canActivate:[DashAdminGuard], component : PlanComponent },
            { path : 'ciudad' , canActivate:[DashAdminGuard], component : CiudadComponent },
            { path : 'asunto' , canActivate:[DashAdminGuard], component : AsuntoComponent },
        ]
    }
];

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
})
export class CatalogoRoutingModule{}