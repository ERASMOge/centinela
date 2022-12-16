import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { IpService } from '../../../../core/services/ip.service';
import { SegmentsService } from '../../../../core/services/segments.service';
import { rango_ip } from './rango_ip';


@Component({
  selector: 'app-new-segment',
  templateUrl: './new-segment.component.html',
  styleUrls: ['./new-segment.component.css']
})

export class NewSegmentComponent {
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");
  arrayLoading = ["Por favor no cierre el navegador",
  "Subiendo todas las ips que general el segmento...",
  "Esto puede demorar dependiendo de la cantidad IPs generados",
  "Si interrumpe la pagina, se subira incompletamente"];

  subnetting = require('ip-utils')
  repetearArray: any []= [];
  arrayPromises : any []=[]
  rango  = new rango_ip()

  segmentoFormControl = new FormControl('', [Validators.required, Validators.pattern("(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])[\.]){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))")]);
  segmentoInput : boolean= false

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private segmentService : SegmentsService,
  public dialogRef: MatDialogRef<NewSegmentComponent>, private ipService : IpService  ) { }
  
  pingURL() {
  
  }
  
  async crearSegment( Selectrepetear:number,nombre : string,segmento : string ,diagonal : number, selectEstatus : number, selectTipo: number){
    let existe :any = await lastValueFrom(this.segmentService.existe(segmento))
    existe=existe.container[0].ip;
    
    //true = actualizar false = insertar
    if(this.data.opc == false){
      //antes de insertar se averigua si existe tal segmento
      if(existe == 0)
      {
        if(nombre.length >0 && diagonal> 0 && this.segmentoFormControl.valid == true  && selectTipo != undefined && selectEstatus !=undefined && Selectrepetear !=undefined){
          //se activa el loading general
          this.contenedor_carga.style.display = "block";
          // se guarda el rango del segmentos y todos sus subnets          
          let segmentoFinal = await this.subnetting.subnet(segmento+"/"+diagonal).info();
          let r : string []= this.rango.rango(segmentoFinal["networkAddress"], segmentoFinal["broadcastAddress"]);          
          await lastValueFrom(this.segmentService.insertarSegments({cveRepetdora:Selectrepetear,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal["broadcastAddress"],segmento3:segmentoFinal["networkAddress"]}));  
          let ultimoSegmento :number =0
          
          await lastValueFrom(this.segmentService.lastSegmento()).then( (result : any) =>{
            if(result.status !== "not found"){
            ultimoSegmento= result.container[0].max;
          }
          });
          
          this.data.id = (Number(this.data.id)+1)
          for (let x=0; x<r.length; x++) {
          await lastValueFrom(this.ipService.insertarIp({ip:r[x],cveSegmento:ultimoSegmento}))
         }  
        this.contenedor_carga.style.display = "none";
        this.dialogRef.close({id: this.data.id,cveRepetdora:Selectrepetear,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus,tipo:selectTipo,segmento2:segmentoFinal["broadcastAddress"], mensaje:"Se pudo"})  
        }else{
          alert ("Llene todos los datos")
        }
      }else{ 
        alert("No se pueden insertar segmentos repetidos y/o activos")
      }
    }else{
      if(nombre.length >0  && selectTipo != undefined && selectEstatus !=undefined ){
      await lastValueFrom(this.segmentService.actualizarSegment(this.data.id,nombre,selectEstatus,selectTipo));
        this.dialogRef.close({cveRepetdora:Selectrepetear,nombre:nombre, segmento: segmento,diagonal:diagonal,estatus:selectEstatus, tipo: selectTipo, mensaje:"Se pudo"})
      }else{
      alert("Llene todos los datos")
      }
    }
  }

  patternSegmento(){
    
    if (this.segmentoFormControl.hasError('required')) {
      return 'Debes de escribir un segmento';
    }
    return this.segmentoFormControl.hasError('pattern') ? 'Segmento no valido' : '';

  }


}
