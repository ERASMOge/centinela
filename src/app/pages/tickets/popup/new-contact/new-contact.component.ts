import { Component, ComponentRef, Inject, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { LogService } from 'src/app/core/services/log.service';
import { ContactServiceModel } from 'src/app/models/contactService.model';
import { log_clienteEmpresa } from 'src/app/models/log_clienteEmpresa.model';
import { responseService } from 'src/app/models/responseService.model';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css'],
  
})
export class NewContactComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<NewContactComponent>,
   private fb :FormBuilder , private fb2 :FormBuilder, private ruta : Router,private serviceAuth :AuthService,
   private contacto: ContactService, private logService : LogService ) { 
    console.log(this.data);

    }
  hide = true;
  seleccionar : number=0;
  contactoModel = new ContactServiceModel();
  modelLog = new log_clienteEmpresa();

  labelAsignar : string = ""
  labelAgregar : string = ""
  agregar : boolean = false;
  selectService : boolean = false
  selectContacto : boolean = false
  Servicios : any [] = [];
  Contactos : any []= [];
  cveContactos :Array<number> = []
  cveServicios : Array<number> = []
  load : boolean = false;
  url = this.ruta.url.split("/")[4]
  id :string = this.ruta.url.split("/")[3];
  identificador :string = this.ruta.url.split("/")[4];

  selectServcioValue : number = 0
  serviciosGuardados : any [] =[]
  eliminarServicio : number = -1
  agregarForm : FormGroup = this.fb.group({
    nombre: [this.data.nombre ? this.data.nombre: '', Validators.required],
    paterno: [this.data.apPaterno ?this.data.apPaterno: '', Validators.required],
    materno: [this.data.apMaterno ? this.data.apMaterno: '', Validators.required],
    estatus: [this.data.estatus  != 0? this.data.estatus : '', Validators.required],
    cveRol: [this.data.idRol  != 0? this.data.idRol : '', Validators.required],
    telefono: [this.data.telefono ? this.data.telefono : '', Validators.required],
    celular: [this.data.celular ? this.data.celular : '', Validators.required],
    puesto: [this.data.puesto ? this.data.puesto: '', Validators.required],
    correo: [this.data.correo ? this.data.correo: '', Validators.required],
    contrasena: [this.data.contrasena? this.data.contrasena: '', Validators.required],
    valueServicio: ""
  })

  asignarForm : FormGroup = this.fb2.group({
    cveServicio: [this.data.idServicioDefault , Validators.required],
  })
  
  idAuto : number = 0
  @ViewChild('placeholder2', {read: ViewContainerRef, static: false}) placeholder2!: ViewContainerRef;
  @ViewChild('placeholder3', {read: ViewContainerRef, static: false}) placeholder3!: ViewContainerRef;
  @ViewChild('servicio') servicio!: MatSelect;

  async enviar(){

      this.cveServicios.push(Number(this.data.datosServicio.idServicio))
      this.contactoModel = this.agregarForm.value
      this.contactoModel.servicio = document.getElementById("selectServicio")?.innerText+"";
      this.contactoModel.rol = document.getElementById("selectRol")?.innerText+"";
      this.contactoModel.cveServicioArray = this.cveServicios;
      this.contactoModel.cveContactoArray = this.cveContactos  
      this.contactoModel.idCliente = this.data.datosServicio.idCliente; 
      this.modelLog.cveUsuario = this.serviceAuth.getCveId();
      this.modelLog.serviciosAltas = this.cveServicios.toString();
      this.modelLog.cveCliente = Number(this.id);
    
        if(this.agregarForm.valid !=false){
            //this.contactoModel.cveContacto = this.idAuto;
          this.modelLog.tipo[0]=1;
          await lastValueFrom(this.contacto.insertServicios_tServicos(this.contactoModel));
          await lastValueFrom(this.logService.insertLog(this.modelLog,1));
          this.dialogRef.close("SI REGRESO EL CONTACTO")
        }else{
          alert("Por favor llene los campos");
        }
     
  }

}
