import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { RepeaterService } from './../../../../core/services/repeater.service';

@Component({
  selector: 'app-new-repeater',
  templateUrl: './new-repeater.component.html',
  styleUrls: ['./new-repeater.component.css']
})
export class NewRepeaterComponent implements OnInit {

  @ViewChild("selectCiudad") selectCiudad! : MatSelect

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private repidorService : RepeaterService,public dialogRef: MatDialogRef<NewRepeaterComponent>) { }

  ngOnInit(): void {
    
  }
  async crearCliente(nombre : string,latitud : string ,longitud : string, selectEstatus : number, selectCiudad: number){
  
    if(this.data.opc == false){
      if(nombre.length >0 && latitud.length > 0 && longitud.length > 0  && selectEstatus != undefined && selectCiudad !=undefined){
        await lastValueFrom(this.repidorService.insertarRepetidor({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitud,estatus:selectEstatus}));
        this.dialogRef.close({cveCiudad:this.selectCiudad._selectionModel.selected[0].viewValue,nombre:nombre, latitud: latitud,longitud:longitud,estatus:selectEstatus, mensaje:"Se pudo"})
      }else{
        alert("Llene todos los datos")
      }
    }else{
      
      if(nombre.length >0 && latitud.length > 0 && longitud.length > 0  && selectEstatus != undefined && selectCiudad !=undefined){
        await lastValueFrom(this.repidorService.updateRepetidor({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitud,estatus:selectEstatus, idRepetidora:this.data.id}));
        this.dialogRef.close({cveCiudad:selectCiudad,nombre:nombre, latitud: latitud,longitud:longitud,estatus:selectEstatus, mensaje:"Se pudo"})
  }else{
      alert("Llene todos los datos")
    }
    }
  }

}
