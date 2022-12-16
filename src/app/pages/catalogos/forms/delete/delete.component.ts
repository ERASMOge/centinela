import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AsuntoService } from 'src/app/core/services/asunto.service';
import { CityService } from 'src/app/core/services/city.service';
import { planService } from 'src/app/core/services/plan.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
              private planService: planService,
              private ciudadService : CityService,
              private asuntoService : AsuntoService,
              public dialogRef: MatDialogRef<DeleteComponent>) { }

  mensaje :string= '';

  ngOnInit(): void {
    switch(Number(this.data.opc)){
      case 0:
        break;
      case 1:
        this.mensaje = "¿Estas seguro que desea eliminar "+this.data.nombre+"?"       
      break;
      case 2:
        this.mensaje = "¿Estas seguro que desea eliminar la ciudad de "+this.data.nombre+"?"       
      break;
      case 3:
        this.mensaje = "¿Estas seguro que desea eliminar el asunto "+this.data.nombre+"?"       
      break;
    }
  }

  async confirmar(){

    switch(this.data.opc){
      case 1:       
        await lastValueFrom(this.planService.eliminarPlan(this.data.idPlan)); 
        this.dialogRef.close('Se ha eliminado con éxito');
      break;
      case 2:       
        await lastValueFrom(this.ciudadService.eliminarCiudad(this.data.idCiudad)); 
        this.dialogRef.close('Se ha eliminado con éxito');
      break;
      case 3:       
        await lastValueFrom(this.asuntoService.eliminarAsunto(this.data.idAsunto)); 
        this.dialogRef.close('Se ha eliminado con éxito');
      break;
    }
  }

}
