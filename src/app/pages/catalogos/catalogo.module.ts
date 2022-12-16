import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatPaginatorModule } from "@angular/material/paginator";
import { SharedModule } from "src/app/shared/shared.module";
import { AsuntoComponent } from "./asunto/asunto.component";
import { CatalogoRoutingModule } from './catalogo-routing.module';
import { CiudadComponent } from "./ciudad/ciudad.component";
import { DeleteComponent } from "./forms/delete/delete.component";
import { PlanComponent } from "./plan/plan.component";

@NgModule({
    declarations : [
        PlanComponent,
        DeleteComponent,
        CiudadComponent,
        AsuntoComponent
    ],
    imports : [
        CommonModule,
        MatPaginatorModule,
        SharedModule,
        CatalogoRoutingModule,
        HttpClientModule,
        FormsModule
    ]
})
export class CatalogoModule{}