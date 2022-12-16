
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { lastValueFrom, map, Observable, startWith, Subscription, timeout } from 'rxjs';
import { TicketService } from 'src/app/core/services/tickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { UsuarioService } from 'src/app/core/services/user.service';
import { IpService } from 'src/app/core/services/ip.service';
import { DeviceService } from 'src/app/core/services/device.service';
import { pingDatos } from 'src/app/interfaces/pingDatos.interface';
import { RepeteadMethods } from '../../RepeteadMethods';
import { dosParamsNum } from 'src/app/interfaces/dosParamsNum.interface';
import { usuario } from '../all-tickets/all-tickets.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { enviarComentarioInterface } from 'src/app/interfaces/enviarComentario.interface';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { contactsEmailTicket } from 'src/app/models/contactsEmailTicket.model';
import { ComentarioModel } from 'src/app/models/comentario.model';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotifierService } from 'angular-notifier';

interface Grupo{
correo: string;
value:number
viewValue:string
}
export interface Comment {
  mensaje?: string;
  usuarioRespondido : string;
  creado? : string;
  asunto? : string;
  informado? : string;
  dispositivo? : string;
  fecha : string;
  grupo? : string;
  agente? : string;
  color : string;
  cerrar? : boolean;
  actualizar? : boolean;
  normal?:boolean;
  nombreArchivo?:string;
  tamanoKB?:string;
  ruta?:string;
}
export interface datosUsuario {
  apellidoMaterno: string
  apellidoPaterno: string
  celular: number
  correo: string
  cveRol: number
  estatus: number
  idContacto: number
  idServicio: number
  usuario: string
  puesto: string
  rol: string
  servicio: string
  telefono: number
}


@Component({
  selector: 'app-vista-ticket',
  templateUrl: './vista-ticket.component.html',
  styleUrls: ['./vista-ticket.component.css']
})

export class VistaTicketComponent implements OnInit {
  
  comentarioModel = new ComentarioModel()
  comentario! : ComentarioModel[];
  Grupos:Grupo[]=[]
  correos : string [] = []
  mobileQuery: MediaQueryList;
  position : boolean = false
  moveProp : boolean = false
  moveDatos : boolean = false
  tipoComentario : boolean = true
  open : number = 0
  datosTicket : any 
  date : Date = new Date()
  idTicket : number = Number(this.ruta.url.split("/")[4].replace(/#Ancla/g, "")) 
  optionsDate :any = { year: 'numeric', month: 'long', day: 'numeric' };
  filteredOptions: Observable<datosUsuario[]> | undefined;
  usuarios : any [] = []
  options: string[] = [];
  textArea = new FormControl()
  inputFile = new FormControl()
  myControl = new FormControl('');
  varDetalle : number | undefined  //Guarda una variable de la tabla detalle log_ticket_det
  form: FormGroup = this.fb.group({
    cveGrupo : [''],
    cveUsuario : [''],
    tipo : [''],
    estado : [''],
    prioridad : ['']
  })

  //agente seleccionado nuevo y viejo
  agenteNuevo : usuario | undefined
  //archivo para guardar
  public files: any[] = [];
  public lector: any[] = [];
  public arr: File [] = [];
  
  private readonly notifier: NotifierService;

  //Para guardar los repetidores de los diferentes dispositivos
  repetidoras : Array<string> = new Array()

  //INTERFACES O MODELOS
  pingOtro : pingDatos[] = []
  pingRouter : pingDatos[] = []
  pingRadio : pingDatos[] = []

  metodos = new RepeteadMethods()
  $sub = new Subscription()

  comment: Comment[] = [ ];

  contactsEmailTicket : contactsEmailTicket = new contactsEmailTicket()
  constructor(
    private sanitizer: DomSanitizer,
    private userservice:UsersmoduleService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private servTicket:TicketService,
    private ruta: Router,
    private fb:FormBuilder,
    private usarioservice : UsuarioService, 
    private ipService : IpService,
    private deviceService : DeviceService,
    private ticketService: TicketService,
    private auth : AuthService, 
    public regresar : Location,
    private renderer: Renderer2,
    private _snackBar : MatSnackBar,
    notifierService: NotifierService
    ) {       
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this.idTicket = this.idTicket,
    this.notifier = notifierService   
    
  }

  ngOnInit(): void {    
    this.llamarCve();
    this.procedimiento()
    this.changeDetectorRef.detectChanges();    
    this.renderer.listen(document.getElementById("buttonload"),"click", ()=>{
     this.renderer.addClass(document.getElementById("buttonload"),"onclic")    
     this.actualizar4params()
   })
    
  }

 
  
  //Metodo llamar Grupo
  async llamarCve(){
    await this.userservice.llamarGroup("Group").toPromise().then( (result : any) =>{
      
      
    for(let i=0;i<result.container.length;i++){
      
    
    this.Grupos.push({value:result.container[i]["idGrupo"], viewValue:result.container[i]["nombre"], correo: result.container[i]["correo"]})
    }
    })
  }

  async procedimiento(){
    await this.llamarUnTicket()
    await this.llamarVariantesDeTicket()
    await this.imprimirComentarios()
  }

 // codigo reservado para el futuro, lista con scroll infinito
 scrollComentarios(event : any){  
  if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
    
  }
  
}

  async llamarUnTicket(){
   
    
    this.datosTicket = await (await lastValueFrom(this.servTicket.llamarTicket(this.idTicket))).container[0]
    console.log(this.datosTicket);
    this.form.controls["cveGrupo"].setValue(await this.datosTicket.cveGrupo)
    this.form.controls["tipo"].setValue(await this.datosTicket.tipo.toString())
    this.form.controls["prioridad"].setValue(await this.datosTicket.prioridad.toString())
    this.form.controls["estado"].setValue(await this.datosTicket.estado.toString())
    this.form.controls["cveUsuario"].setValue(await this.datosTicket.cveUsuario.toString())

  }

 async llamarVariantesDeTicket(){
  /*Pidiendo pings para los otros equipos*/
  this.ipService.selectIpOneEquipament(0,this.datosTicket.identificador,3,this.datosTicket.contador).subscribe(async(resp:responseService) =>{      
    if(resp.status === "not found"){
    }else{
      for (let i =0; i<resp.container.length; i++) {
        if(Number(this.repetidoras.indexOf(resp.container[i].repetidora)) == -1){
          this.repetidoras.push(resp.container[i].repetidora)
        }

        this.monitoreoPing(resp.container[i].ip, i,this.pingOtro)  
        this.pingOtro.push( {
          idDevice :resp.container[i].idOtro,
          nombre : resp.container[i].nombre,
          ip :  resp.container[i].ip,
          ping:"cargando",
          color : ""
        })
      }
    }
  })

  //pidiendo ping para routers
  this.ipService.selectIpOneRouter(0,this.datosTicket.identificador,3,this.datosTicket.contador).subscribe(async(resp:responseService) =>{
    if(resp.status === "not found"){
    }else{
      for (let i =0; i<resp.container.length; i++) {
        if(Number(this.repetidoras.indexOf(resp.container[i].repetidora)) == -1){
          this.repetidoras.push(resp.container[i].repetidora)
        }

        this.monitoreoPing(resp.container[i].ip, i,this.pingRouter)  
          this.pingRouter.push( {
            idDevice :resp.container[i].idRouter,
            nombre : resp.container[i].nombre,
            ip :  resp.container[i].ip,
            ping: "cargando",
            color : ""
        })
      }
    }
  })

  //pidiendo ping para radios
  this.deviceService.todosRadios(this.datosTicket.identificador,this.datosTicket.contador).subscribe(async (resp:responseService)=>{
    if(resp.status === "not found"){
    }else{  
      for (let i =0; i<resp.container.length; i++) { 
        if(Number(this.repetidoras.indexOf(resp.container[i].repetidora)) == -1){
          this.repetidoras.push(resp.container[i].repetidora)
        }
        this.monitoreoPing(resp.container[i].ip, i,this.pingRadio)  
          this.pingRadio.push( {
            idDevice :resp.container[i].idRadio,
            nombre : resp.container[i].radio,
            ip :  resp.container[i].ip,
            ping:"cargando",
            color:""
        })
      }
    }      
  })

  this.buscarUsuarios(this.datosTicket.cveGrupo,true)  
  }

  buscarUsuarios(cve:number,inicio :boolean){

    this.usarioservice.usuariosGrupo(cve).subscribe(async(resp:responseService)=>{
      this.usuarios = []
      if(resp.status === "not found"){
        this.usuarios = []
      }else{        
        for await (const usuario of resp.container) {
          this.usuarios.push(usuario)        
        }
      }    
      this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const nombre = typeof value === 'string' ? value : value?.usuario;
       return nombre ? this._filter(nombre as string) : this.usuarios.slice();
      }),
    );     
    if(inicio){
      this.myControl.setValue(this.datosTicket.usuario)   
    }else{
      this.myControl.reset()
    } 
    })

    
  }  

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.usuarios.filter((option: any) => option.usuario.toLowerCase().includes(filterValue));
  }
  desplazarNavPropiedades(){    
    if ( Number(window.innerWidth) >= 1000) {
      if(this.moveProp == false){
        this.moveProp = true;
      }else{
        this.moveProp = false;
      }
    }
  }

  desplazarNavDatosContacto(){
    if ( Number(window.innerWidth) >= 1000) {
      if(this.moveDatos == false){
        this.moveDatos = true;
      }else{
        this.moveDatos = false;
      }      
    }
  }

  cambiarResponsive() :Number{
    if ( Number(window.innerWidth) >= 1000 && screen.width >= 1000) {
      this.position = false
    } else {
      this.moveDatos = false;
      this.moveProp = false;
      this.position = true
    }
    this.open = window.innerWidth
  return window.innerWidth    
  }


  
  /** Monitreo de ping */
  async monitoreoPing( ip : string, i : number,array:pingDatos[]) { 
    let ping : string = ""
    this.$sub.add(this.ipService.ping(ip).subscribe((resp:any) => {
      ping = resp.container.time
      
      try{
        array[i].ping = ping; 
        if(resp.container.status == "200"){
        if(Number(ping.replace(/[A-Za-z]+/,"")) <=40){
          array[i].color = "green";
        }else{
          array[i].color = "orange";
        }
      }else{
        array[i].color = "red";
      }
      return array[i]
      }catch(Exception){}
    })) 
  }


  async guardarGrupo(cve:String){ 
    let dosParamsNumGrupo:dosParamsNum = {
      cve : Number(cve),
      cve2 : this.idTicket,
      cveUsuario : this.auth.getCveId()
    } 
  
    let dosParamsNumAgente:dosParamsNum = {
      cve : 0,
      cve2 : this.idTicket 
    } 
     this.varDetalle = await(await lastValueFrom(this.ticketService.actualizarGrupo(dosParamsNumGrupo))).container[0].max    
     await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNumAgente))

      
      
    }  

  async agenteGuardar(cve:number){
    let dosParamsNum:dosParamsNum = {
      cve : cve,
      cve2 : this.idTicket,
      cveUsuario: this.auth.getCveId(),
      cveLogDet: this.varDetalle 
    }
      await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNum))
  }
  

 
  async guardarEstado(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket,
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
      }
  }

  async guardarPrioridad(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket,
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarPropiedad(dosParamsNum))
      }
  }

  async guardarTipo(cve:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : this.idTicket,
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarTipo(dosParamsNum))
      }
  }

  async eliminarTicket(){
    let eliminarTicket : dosParamsNum ={
      cve:this.idTicket,
      cve2:0,
      cveUsuario: this.auth.getCveId()
    }
    await lastValueFrom(this.ticketService.deleteTickets(eliminarTicket))
  }

  async cerrarTicket(){
    let dosParamsNum : dosParamsNum = {
      cve:4,
      cve2:this.idTicket,
      cveUsuario: this.auth.getCveId()
    }
    await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
    await this.imprimirComentarios()
  }


  autoCompleteAgente(e : any){
    if( e.toString() === "Sin asignar"){
      this.agenteNuevo = {
        apellidoPaterno :"",
        appelidoMaterno : "",
        correo : "",
        nombres : "Sin asignar",
        idUsuario : 0,
        usuario : ""
      }
      this.myControl.setValue(e)
    }else{
    this.agenteNuevo = e
    this.myControl.setValue(e.usuario)
    }    
    
  }

  async actualizar4params(){        
    if(this.datosTicket.cveGrupo.toString() !== this.form.controls["cveGrupo"].value.toString()){
      await this.guardarGrupo(this.form.controls["cveGrupo"].value)
    }

    if(this.agenteNuevo !== undefined && this.datosTicket.cveGrupo.toString() !== this.form.controls["cveGrupo"].value.toString()){
      await this.agenteGuardar(this.agenteNuevo.idUsuario)
    }else{
      if(this.datosTicket.cveGrupo.toString() === this.form.controls["cveGrupo"].value.toString()
       && this.agenteNuevo !== undefined){
        await this.guardarGrupo(this.form.controls["cveGrupo"].value)
        await this.agenteGuardar(this.agenteNuevo!.idUsuario )
      }
    }

    if(this.datosTicket.tipo.toString() !== this.form.controls["tipo"].value.toString()){
      await this.guardarTipo(this.form.controls["tipo"].value)
    }

    if(this.datosTicket.prioridad.toString() !== this.form.controls["prioridad"].value.toString()){
      await this.guardarPrioridad(this.form.controls["prioridad"].value)
    }

    if(this.datosTicket.estado.toString() !== this.form.controls["estado"].value.toString()){
      await this.guardarEstado(this.form.controls["estado"].value)
    }

    if(this.datosTicket.cveGrupo.toString() !== this.form.controls["cveGrupo"].value.toString()){ 
     let grupo1= this.Grupos.find(element=>element.value==this.datosTicket.cveGrupo.toString())
     let grupo2=this.Grupos.find(element=>element.value==this.form.controls["cveGrupo"].value.toString())
   this.correos.push(grupo1!.correo).toString()
   this.correos.push(grupo2!.correo).toString()

   let agente1=this.usuarios.find(element=>element.idUsuario==this.datosTicket.cveUsuario.toString())
   let agente2=this.usuarios.find(element=>element.idUsuario==this.form.controls["cveUsuario"].value.toString())
   this.correos.push(agente1?.correo).toString()
   this.correos.push(agente2?.correo).toString()
  
   
      this.contactsEmailTicket.TextoAsunto="El Ticket se ha escalado del grupo:"+grupo1?.viewValue+" al grupo: "+grupo2?.viewValue
      this.contactsEmailTicket.correo=this.datosTicket.correoAbierto
      this.contactsEmailTicket.prioridad=this.metodos.prioridadEnLetraTicket(this.form.controls["prioridad"].value)
      this.contactsEmailTicket.servicio=this.datosTicket.servicio
      this.contactsEmailTicket.tipo=this.metodos.tipoEnLetraTicket(this.form.controls["tipo"].value)

      this.contactsEmailTicket.identificador=this.datosTicket.identificador
      this.contactsEmailTicket.nombreCliente=this.datosTicket.cliente
      this.contactsEmailTicket.nombreContacto=this.datosTicket.contacto
      this.contactsEmailTicket.correoCc=this.correos
      this.contactsEmailTicket.estatus=this.metodos.estadoEnLetraTicket(this.form.controls["estado"].value)



      await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket)) 
    }

    
    if( this.form.controls["estado"].value.toString()==4 && Number(this.datosTicket.estado) !== 4){

      let grupo2=this.Grupos.find(element=>element.value==this.form.controls["cveGrupo"].value.toString())
    this.correos.push(grupo2!.correo).toString()
 
    let creador=this.usuarios.find(element=>element.idUsuario==this.datosTicket.cveUsuario.toString())

    let agente2=this.usuarios.find(element=>element.idUsuario==this.form.controls["cveUsuario"].value.toString())
    this.correos.push(agente2?.correo).toString()

       this.contactsEmailTicket.TextoAsunto="El Ticket ha sido cerrado"
       this.contactsEmailTicket.correo=this.datosTicket.correoAbierto
       this.contactsEmailTicket.prioridad=this.metodos.prioridadEnLetraTicket(this.form.controls["prioridad"].value)
       this.contactsEmailTicket.servicio=this.datosTicket.servicio
       this.contactsEmailTicket.identificador=this.datosTicket.identificador
       this.contactsEmailTicket.nombreCliente=this.datosTicket.cliente
       this.contactsEmailTicket.nombreContacto=this.datosTicket.contacto
       this.contactsEmailTicket.correoCc=this.correos
       this.contactsEmailTicket.estatus="Cerrado"

 
       await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket)) 
    }

    this.varDetalle = undefined
    this.agenteNuevo = undefined
   
    this.renderer.setStyle(document.getElementById("buttonload"),"animation-delay","0s")
    this.renderer.removeClass(document.getElementById("buttonload"),"onclic")
    this.renderer.addClass(document.getElementById("buttonload"),"validate")
    await this.delay(1500)
    this.renderer.setStyle(document.getElementById("buttonload"),"animation-delay","1s")
    await this.llamarUnTicket();
    await this.imprimirComentarios();
    this.renderer.removeClass(document.getElementById("buttonload"),"validate")
    
  }

   async delay(ms: number) {
    return await new Promise( resolve => setTimeout(resolve,ms));
    }
  
  async imprimirComentarios(){  
    this.comment = []
    this.ticketService.llamarHistorial(this.idTicket).subscribe(async (resp:responseService)=>{
      for await (const i of resp.container) {
       if(i.tipo >=2 && i.tipo <=4){
         // Actualizacion de cual quiera de las opciones
          this.comment.push({mensaje:i.comentario,nombreArchivo: i.nombre,tamanoKB: i.tamano,ruta: i.url,usuarioRespondido:i.usuario,fecha:i.fechaUpdate, color:"#F5F8FA",actualizar:true });
        }else if(i.tipo == 5){
          //mensaje de escalado
          this.comment.push({ usuarioRespondido:i.usuario,fecha:i.fechaUpdate,grupo:i.grupo,agente:i.agente, color:"#E6FFDE" });
        }else if(i.tipo == 6){
          //mensaje de que se cerro el ticket
          this.comment.push({ usuarioRespondido: i.usuario, fecha:i.fechaUpdate,cerrar:true,color:"#DBFAFF"});
        }else if(i.tipo ==7){
          // comentario privado
          this.comment.push({ mensaje: i.comentario,nombreArchivo: i.nombre,tamanoKB: i.tamano,ruta: i.url, usuarioRespondido:i.usuario,fecha:i.fechaUpdate, color:"#F5F8FA",normal:false });
        }else if(i.tipo == 8){
          // comentario publico
          this.comment.push({ mensaje: i.comentario,nombreArchivo: i.nombre,tamanoKB: i.tamano,ruta: i.url, usuarioRespondido:i.usuario,fecha:i.fechaUpdate, color:"#F5F8FA"});
        }
      }
    })
  }

  comentarioPrivado(){
    this.tipoComentario = false
  }

  comentarioPublico(){
    this.tipoComentario = true
  }

  descargar(archivo : any): SafeUrl {
      const downloadInstance= document.createElement('a');
      downloadInstance.href = archivo;
      downloadInstance.target = '_blank';
      document.body.appendChild(downloadInstance);
    return this.sanitizer.bypassSecurityTrustUrl(archivo);
}


documento(numero:number) {
  switch(numero){
    case 1:
      return "Imagen"
    case 2:
      return "PDF"
      case 3:
      return "Documento"
  }
  
  
}

  async enviarMensaje(){
    
    if (this.textArea.value != null){
      this.comentarioModel.cveTicket= this.idTicket;
      this.comentarioModel.comentario= this.textArea.value;
      this.comentarioModel.cveUsuario= this.auth.getCveId();
      this.comentarioModel.estatus = 1;
      this.comentarioModel.tipo = this.tipoComentario === false?7:8
  
      for(let i=0; i<this.files.length;i++){
        this.comentarioModel.nombre = this.files[i]['name'];
        this.comentarioModel.url = this.lector[i];
  
        let type=this.files[i]["name"];
        if(type.indexOf(".png")>=0 || type.indexOf(".PNG")>=0 || type.indexOf(".gif")>=0 || type.indexOf(".jpg")>=0){
          this.comentarioModel.tipoArchivo=1
        }else if(type.indexOf(".pdf")>=0) {
          this.comentarioModel.tipoArchivo=2
        }else if(type.indexOf(".docx")>=0) {
          this.comentarioModel.tipoArchivo=3
        }else{
          this.comentarioModel.tipoArchivo=4
        }
  
        if(this.files[i]["size"]>15000000){
          let tamaño=this.files[i]["size"]/1000000
          this.comentarioModel.tamano=tamaño.toFixed()+" MB"
        }else{
          let tamaño=this.files[i]["size"]/1000
          this.comentarioModel.tamano=tamaño.toFixed()+" KB"
        }
      }

      this.textArea.reset()
      await lastValueFrom(this.ticketService.insertarComentario(this.comentarioModel))
      await this.imprimirComentarios()
      this.notifier.notify('success', 'Comentario enviado correctamente');
    }else{
      this.notify()
    }
    
  }

  
  notify(){
    this.notifier.notify('error', 'Escribe un comentario');
  }

  input(evt:any){  
    const target : DataTransfer = <DataTransfer>(evt.target);
    let i
    let tamanoKB = 15000000;
    for( i=0;target.files.length>i;i++){
      if(target.files[i].size<=tamanoKB){
        this.arr.push(target.files[i])
      }else{
        //alert('¡Alto! El archivo que no sea mayor de 15 MB');
        this._snackBar.open('¡Espera! El archivo no puede ser mayor a 15 MB','OK');
      }
     
      }
      this.onFileChange(this.arr)
  }

  onFileChange(pFileList: File[]){
    for(let i=0;i<pFileList.length;i++){
      let file=pFileList[i]
      this.files.push(file)
      const reader= new FileReader()
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.lector.push(reader.result)
        
      }
  }
  }

  deleteFile(f:any){
    this.files = this.files.filter(function(w){ return w.name != f.name });
    this._snackBar.open("Se ha eliminado de la lista!", 'OK', {
      duration: 2000,
    });
  }
}