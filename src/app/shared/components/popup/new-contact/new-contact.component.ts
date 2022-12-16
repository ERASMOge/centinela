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
export class NewContactComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<NewContactComponent>
  ,private contacto : ContactService, private fb :FormBuilder , private fb2 :FormBuilder, private ruta : Router
  , private contactService : ContactService,private _renderer: Renderer2,
  private logService :LogService,private serviceAuth :AuthService ) { 
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
    estatus: [this.data.estatus  > 0? this.data.estatus.toString() : '', Validators.required],
    cveRol: [this.data.idRol   > 0? this.data.idRol.toString() : '', Validators.required],
    telefono: [this.data.telefono ? this.data.telefono.toString() : '', Validators.required],
    celular: [this.data.celular ? this.data.celular.toString() : '', Validators.required],
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

  ngOnInit(): void {    
    console.log(this.data);
    
    this.maxid()
    this.load = true;
    this.editarTab()        
    if(this.url == "contact" ){
      this.selectContacto = true
      this.selectService = false    
       
      try{
      this.serviciosFaltantes(this.data.idContacto,this.data.arrayServicios[0].identificador)      
      this.servicios(this.data.idContacto,this.data.arrayServicios[0].identificador)
      }catch(Exception){  }
      }else{       
      let split = this.identificador.split("-")    
    
       
      this.serviciosFaltantes(this.data.idContacto,split[0]+"-"+split[1]+"-"+split[3])
      this.servicios(this.data.idContacto,split[0]+"-"+split[1]+"-"+split[3])
      this.selectService = true
    }
  }
  
  maxid(){
    firstValueFrom(this.contactService.llamarContactos_maxId()).then((resp:responseService)=>{
      this.idAuto = resp.container[0].max      
    })
  }


  async enviar(){
    if( this.seleccionar== 0){
      this.contactoModel = this.agregarForm.value
      this.contactoModel.servicio = document.getElementById("selectServicio")?.innerText+"";
      this.contactoModel.rol = document.getElementById("selectRol")?.innerText+"";
      this.contactoModel.cveServicioArray = this.cveServicios
      this.contactoModel.cveContactoArray = this.cveContactos   
      this.contactoModel.idCliente = this.data.idCliente;
      this.modelLog.cveUsuario = this.serviceAuth.getCveId();
      this.modelLog.serviciosAltas = this.cveServicios.toString();
      this.modelLog.cveCliente = Number(this.id);
      this.modelLog.categoria = 3;
      if(this.data.opc == false){
        if(this.agregarForm.valid !=false){
            this.contactoModel.cveContacto = this.idAuto;
            this.modelLog.tipo[0]=1;
           await lastValueFrom(this.contacto.insertServicios_tServicos(this.contactoModel));
           await lastValueFrom(this.logService.insertLog(this.modelLog,1));
          this.dialogRef.close(this.contactoModel)
        }else{
          alert("Por favor llene los campos");
        }
      }else{
        if(this.data.idServicio == this.eliminarServicio){
          this.eliminarServicio = -1
        }
          this.modelLog.tipo[0]=0;
          this.contactoModel.cveContacto = this.data.idContacto;
          await lastValueFrom(this.contacto.updateContacto_tServicio(this.contactoModel))
          await lastValueFrom(this.logService.insertLog(this.modelLog,1))
          this.dialogRef.close(this.contactoModel)
      }
    }else{
      this.modelLog.tipo[0]=1;
      this.contactoModel = this.asignarForm.value
      this.contactoModel.cveContactoArray = this.cveContactos   
      await lastValueFrom(this.contactService.insertarContacto_Servicio(this.contactoModel))
      await lastValueFrom(this.logService.insertLog(this.modelLog,1))
      this.dialogRef.close(this.contactoModel)
    }
  }

  seleccionado(selected : number){
    this.seleccionar = selected;
    
    if(selected == 1 && this.url !== "contact"){
      this.todosContactos(Number(this.data.idServicioDefault))
    }else if(selected == 1 && this.url === "contact") {
      this.asignarForm.controls["cveServicio"].setValue(0)      
    }
  }

  editarTab() {
    if(this.data.opcTab){
      this.labelAgregar = "Editar contacto"
      this.agregar = false;
    }else{
      this.labelAgregar = "Agregar Contacto y servicio"
      this.labelAsignar = "Asignar contacto a servicio"  
      this.agregar = true;
      this.agregarForm  = this.fb.group({
        nombre: [ '', Validators.required],
        paterno: [ '', Validators.required],
        materno:"",
        estatus: [ '', Validators.required],
        cveRol: [ '', Validators.required],
        telefono: "",
        celular: [ '', Validators.required],
        puesto: [ '', Validators.required],
        correo: ['', Validators.required],
        contrasena: [ '', Validators.required],
        valueServicio: ""
      })
      this.asignarForm = this.fb2.group({
        cveContacto: ["", Validators.required],
        cveServicio: this.data.idServicioDefault  
      })
    }
  }


  todosContactos(idServicio : number){
    let split = this.identificador.split("-") 
    this.contactService.llamar_Contactos_OnlyServicio(this.data.idCliente?this.data.idCliente:this.id,Number(split[2]),split[1]?4:5
      ,split[1]?split[0]+"-"+split[1]+"-"+split[3]:idServicio.toString()).subscribe(async (resp:responseService)=>{
      this.data.arrayContactos = resp.container      
      this.cveContactos = []
      try{
      this.placeholder3.clear()   
      for await (const i of resp.container) {
        this.createComponent2({title:i.nombre, id:i.idContacto,state:false},i)        
      }
      }catch(Exception){
      } finally {
        this.selectServcioValue = 0;

      }
      this.agregarForm.controls["valueServicio"].setValue(0)  

    })
  }

  elementOption(event:any){
    event._disabled = true    
    this._renderer.setAttribute(event._element.nativeElement,"hidden","true")
  }

  async guardarServicio(num: number, primeraOp: number, ip? : string,event?:any,boxIdSegmento?:number)  {   
    this.cveServicios.push(num)
    
    if(this.data.idServicio == num){
      this.eliminarServicio = -1
    }
    switch(primeraOp)
    {
      case 1:
        this.createComponent(
          { title: this.servicio?._selectionModel.selected[0].viewValue?this.servicio?._selectionModel.selected[0].viewValue:"", id: num.toString(),
            state: true }, event.source._keyManager._activeItem
          )
        break;
      case 2:
        this.createComponent(
          { title: ip?ip:"", id: num.toString(),
            state: true }, event
          )
        break;
    }
    this.agregarForm.controls["valueServicio"].setValue(0)  
  }

  createComponent(input: { title: string, id: string, state: boolean},_event:any) {    
    let titleElm = this._renderer.createText(input.title);    
    let ref = this.placeholder2?.createComponent(MatCheckbox)
    ref.instance.id = input.id ;
    ref.instance.checked = input.state;
    ref.instance.color = "primary";
    let elm = ref.location.nativeElement as HTMLElement | any;  
    this._renderer.listen(elm, 'click', (event:any) => { this.destruirCheckbox(ref,Number(input.id),_event)});
    this._renderer.listen(elm, 'keydown', (event:any) => { this.destruirCheckbox(ref,Number(input.id),_event)});
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-checkbox')
    ref.changeDetectorRef.detectChanges();
    //ref.instance.change.subscribe(val => this.matCheckboxMap[input.id] = val.checked);
  }

  //Se destruye de la vista y del array donde se tiene guardado las ips  de manera local (no BD)
  destruirCheckbox(event:ComponentRef<MatCheckbox>,id:number,box : any){

    if(this.data.idServicio == id){
      this.eliminarServicio = id
    }

    if(box.id != undefined){
    box._disabled = false;
    box._selected = false;
    this._renderer.removeAttribute(box._element.nativeElement,"hidden")
    }else{
      this.Servicios.push(box)
    }    

    this.cveServicios.splice(this.cveServicios.indexOf(id),1);    
    event.destroy()
  }

  createComponent2(input: { title: string, id: string, state: boolean},_event:any) {    
    let titleElm = this._renderer.createText(input.title);    
    let ref = this.placeholder3?.createComponent(MatCheckbox)
    ref.instance.id = input.id ;
    ref.instance.checked = input.state;
    ref.instance.color = "primary";
    let elm = ref.location.nativeElement as HTMLElement | any;  
    this._renderer.listen(elm, 'click', (event:any) => { this.destruirCheckbox2(ref,Number(input.id),_event)});
    this._renderer.listen(elm, 'keydown', (event:any) => { this.destruirCheckbox2(ref,Number(input.id),_event)});
    elm.firstChild.lastChild.appendChild(titleElm);
    this._renderer.addClass(elm, 'mat-checkbox')
    ref.changeDetectorRef.detectChanges();
    //ref.instance.change.subscribe(val => this.matCheckboxMap[input.id] = val.checked);
  }

  //Se destruye de la vista y del array donde se tiene guardado las ips  de manera local (no BD)
  destruirCheckbox2(event:ComponentRef<MatCheckbox>,id:number,box : any){
    if(event.instance.checked == true){
      this.cveContactos.splice(this.cveContactos.indexOf(id),1);    
    }else{
      this.cveContactos.push(box)
    }   
    
    
  }

  servicios(idContacto : number, identificador : string){  
    this.contactService.selectServicioPorContacto(identificador,idContacto,2).subscribe(async (resp:responseService)=>{
      for await (const y of resp.container) {
        await this.guardarServicio(y.idServicio,2,y.servicio,y);
      }      
    })
  }

  serviciosFaltantes(idContacto : number, identificador : string){
    
    this.contactService.selectServicioPorContacto(identificador,idContacto,1).subscribe(async (resp:responseService)=>{
      this.Servicios = resp.container      

      
    })
  }

}
