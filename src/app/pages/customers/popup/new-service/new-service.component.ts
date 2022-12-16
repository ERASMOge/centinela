import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { ServiceService } from 'src/app/core/services/services.service';
import { serviceModel } from '../../../../models/service.model';
import { Subscription } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { LogService } from 'src/app/core/services/log.service';
import { log_clienteEmpresa } from 'src/app/models/log_clienteEmpresa.model';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.css']
})
export class NewServiceComponent implements OnInit {

  serviceM =  new serviceModel();
  $sub = new Subscription()
  logModel =new log_clienteEmpresa();
  servicioModelAux  = new serviceModel() 
  ultimoIdFalso :number = 0
  id :string = this.ruta.url.split("/")[3];
  modeloGuardado  : any;
   @ViewChild("selectCiudad") selectCiudad : MatSelect | undefined
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service : ServiceService,
  public dialogRef: MatDialogRef<NewServiceComponent>,private authService: AuthService, private ruta : Router,
  private logService:LogService) { }

  ngOnInit(): void {
     
     this.servicioModelAux.nombre = this.data.servicio;
     this.servicioModelAux.idRazonSocial = this.data.idRazonSocial;
     this.servicioModelAux.cveCiudad = this.data.cveCiudad;
     this.servicioModelAux.estado = this.data.estado;
     this.servicioModelAux.latitud = this.data.latitud;
     this.servicioModelAux.longitud = this.data.longitud;
     this.servicioModelAux.codigoPostal = this.data.codigoPostal;
     this.servicioModelAux.avenida = this.data.avenida;
     this.servicioModelAux.numero = this.data.numero;
     this.servicioModelAux.colonia = this.data.colonia;
     this.servicioModelAux.cvePlan = this.data.cvePlan;
     this.servicioModelAux.dominio = this.data.dominio;
     this.servicioModelAux.cveEstatus = this.data.cveEstatus;     
    
  }

  async ultimoIDFalso(abv:string) { 
    try{
      
    await lastValueFrom(this.service.llamarService_maxIdFalso(this.data.Empresa+"-"+ abv+"-")).then((resp:responseService)=>{
      try{
      this.serviceM.contador = Number(resp.container.length==0?0:resp.container[0].contador)+1;
      }catch(Exception){}
    })
  }catch(Exception){}
  }

 async crearServicio(nombre : string,selectRS : number,selectCiudad : string,latitud : string, longitud : string
  ,estado :string,avenida:string , codigoPostal:string,numero:string, colonia:string, dominio : string, selectEstatus : number, selectPlan : number){  
    this.serviceM.nombre = nombre;
    this.serviceM.cveCiudad = Number(selectCiudad);
    this.serviceM.ciudadNombre = document.getElementById("selectCiudad")?.innerText+"";
    this.serviceM.latitud = latitud;
    this.serviceM.longitud = longitud;
    this.serviceM.estado = estado;
    this.serviceM.avenida = avenida;
    this.serviceM.codigoPostal = codigoPostal;
    this.serviceM.numero= numero;
    this.serviceM.colonia= colonia;
    this.serviceM.dominio = dominio;
    this.serviceM.cveEstatus = selectEstatus;
    this.serviceM.cvePlan = selectPlan;
    this.serviceM.idRazonSocial = selectRS;
    this.serviceM.rs = document.getElementById("selectRs")?.innerText+"";
    this.serviceM.plan = document.getElementById("selectPlan")?.innerText+"";
    this.logModel.cveUsuario =this.authService.getCveId()
    this.logModel.cveCliente =  Number(this.ruta.url.split("/")[3]);
    this.logModel.cve=this.serviceM.identificador;
    this.logModel.categoria = 1;
    if(this.data.opc == false){   
      if(nombre.length > 0 && selectCiudad !=undefined && latitud.length > 0 
        && longitud.length > 0 && estado.length > 0 && avenida.length > 0 
        && codigoPostal.length > 0 && numero.length > 0 &&colonia.length > 0 && dominio.length > 0 
        && selectEstatus !=undefined &&  selectPlan !=undefined && selectRS != undefined){ 
        this.serviceM.identificador2 = this.data.Empresa+"-"+selectCiudad+"-"+ this.serviceM.plan;
        /**Insertamos todo el modal ya listo */
        /**dentro de esta insercion, acompletamos el identificador con la ciudad especificada y su contador especifico */
        
        await lastValueFrom(this.service.insertService(this.serviceM));
        /**Insertamos el registro de esta actividad, con sus respectivas variables*/
        this.logModel.tipo[0]=1;
        this.logModel.cve = this.data.Empresa+"-"+selectCiudad+"-"+this.serviceM.contador.toString().padStart(4,"0")+"-"+ this.serviceM.plan
        await lastValueFrom(this.logService.insertLog(this.logModel,2))
        this.dialogRef.close(this.serviceM)
        }else{
          alert("Llene todos los campos, por favor")
        }

    }else{

      this.logModel.tipo[0]=0;
      this.logModel.cve = this.data.identificador
      this.serviceM.identificador = this.data.identificador;
      this.serviceM.id = this.data.idServicio
      await lastValueFrom(this.service.updateService(this.serviceM));
      await lastValueFrom(this.logService.insertLog(this.logModel,2))
      this.dialogRef.close(this.serviceM)
    }
  }

 
}
