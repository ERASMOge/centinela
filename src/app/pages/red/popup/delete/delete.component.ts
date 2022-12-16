import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SegmentsService } from '../../../../core/services/segments.service';
import { RepeaterService } from '../../../../core/services/repeater.service';
import { ContactService } from '../../../../core/services/contact.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private segmentsService : SegmentsService, private repeaterCliente : RepeaterService
  ,public dialogRef: MatDialogRef<DeleteComponent>,private contactService:ContactService) { }
   mensaje :string= "¿Estas seguro que desea eliminarlo?";
  ngOnInit(): void {
    switch(Number(this.data.opc)){
      case 0:
        break;
      case 1:
        this.mensaje = "¿Esta seguro que desea eliminar el segmento?"       
        break;
    }
  }
  
  async confirmar(){

    switch(this.data.opc){
      case 1:       
        await lastValueFrom(this.segmentsService.updateElimSegment(this.data.idSegmento)); 
        this.dialogRef.close('Se ha eliminado con exito');
        break;
      case 2:
        await lastValueFrom(this.repeaterCliente.deleteRepetidor(this.data.idCliente));
        this.dialogRef.close('Se ha eliminado con exito');
        break;
      case 3:
        await lastValueFrom(this.contactService.deleteContacto(this.data.idContacto));
        this.dialogRef.close('Se ha eliminado con exito');
        break;
      case 4:
        await lastValueFrom(this.repeaterCliente.eliminarInformacionRelevante(this.data.cveInfoRepetidora));
        this.dialogRef.close('Se ha eliminado con éxito');
        break;
    }
  }
}
