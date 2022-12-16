import {  Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { lastValueFrom, Observable, startWith, map, Subscription, concat, forkJoin, concatMap } from 'rxjs';
import { AsuntoService } from 'src/app/core/services/asunto.service';
import { ContactService } from 'src/app/core/services/contact.service';
import { SearchService } from 'src/app/core/services/search.service';
import { ServiceService } from 'src/app/core/services/services.service';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { SearchIdComponent } from '../popup/search-id/search-id.component';
import { DeviceService } from 'src/app/core/services/device.service'; 
import { UsuarioService } from 'src/app/core/services/user.service';
import { MatSelect } from '@angular/material/select';
import { NewContactComponent } from "../popup/new-contact/new-contact.component"
import { MatIcon } from '@angular/material/icon';
import { IpService } from 'src/app/core/services/ip.service';
import { RolService } from 'src/app/core/services/rol.service';
import { contactsEmailTicket } from "../../../models/contactsEmailTicket.model"
import { TicketService } from 'src/app/core/services/tickets.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { formTicketInterface } from "../../../interfaces/formTicketInterface.interface"
import { pingDatos }from "../../../interfaces/pingDatos.interface"
import { ActivatedRoute, Router } from '@angular/router';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
interface Grupo{
value:number
viewValue:string
correo:string
}
interface datosServicio {
  idCliente?:number,
  cliente : string,
  servicio : string,
  plan : string,
  estatus: string,
  idServicio : number
}



export interface datosContacto {
  apellidoMaterno: string
  apellidoPaterno: string
  celular: number
  correo: string
  cveRol: number
  estatus: number
  idContacto: number
  idServicio: number
  nombre: string
  puesto: string
  rol: string
  servicio: string
  telefono: number
}


@Component({
  selector: 'app-ticket-entry',
  templateUrl: './ticket-entry.component.html',
  styleUrls: ['./ticket-entry.component.css']
})


export class TicketEntryComponent implements OnInit {

  //inicializando vairables de los mat-autocomplete
  myControl = new FormControl('');
  myControlContacts =new FormControl("")
  filteredOptions: Observable<string[]> | undefined;
  filteredContacts: Observable<datosContacto[]> | undefined;
  options: string[] = [];

  //INTERFACES O MODELOS
  pingOtro : pingDatos[] = []
  pingRouter : pingDatos[] = []
  pingRadio : pingDatos[] = []
  datosServicio : datosServicio | undefined;
  contactsEmailTicket : contactsEmailTicket = new contactsEmailTicket() 

  
  //Variables para guardar servicios
  contactoLista: any[] = [];
  asuntosArray: any [] = []
  usuarios : any [] = []
  arrayRol : any [] = []
  Grupos : Grupo [] = []
  contactocc : any [] = []
 
  //variables globales importantes
  contador : number | undefined;
  cveCliente : number | undefined;
  id : string | undefined;
  identificador : string = ""
  tipo : string = ""
  agregarMasContacto : boolean = true //<- Abre Cc oculta
  idNuevo : number = 0
  indicesAcomu : Array<Number>  =new Array() // <- Guarda indices de los contactos seleccionados
  acomuladorContactos: Array<string>  =new Array() // <- Guarda correos de los contactos seleccionados
  $sub = new Subscription()
  contactoPrincipal : number | undefined
  metodos = new RepeteadMethods() 

  //Para guardar los repetidores de los diferentes dispositivos
  /*repetidorRouter : Array<string> = new Array()
  repetidorOtro : Array<string> = new Array()
  repetidorRadio : Array<string> = new Array()*/
  repetidoras : Array<string> = new Array()

 
  //maticon para crear variable de angular y idGrupo, para acceder a aun valor de select
  @ViewChild("idGrupo") idGrupo! : MatSelect    
  @ViewChild('matIcon', {read: ViewContainerRef, static: true}) placeholder!: ViewContainerRef;


  //variables para la barra izquierda (prev= previos), optionsDate para mostrar una fecha estructurada
  arrayPrevTicket : any [] = []
  optionsDate :any = { year: 'numeric', month: 'long', day: 'numeric' };


  formTicket : FormGroup = this.fb.group({
    contactoCorreo : ["", Validators.required],
    origen : ["", Validators.required],
    cveGrupo : ["", Validators.required],
    cveUsuario : ["", Validators.required],
    asunto : ["", Validators.required],
    prioridad : ["", Validators.required],
    tipo : ["", Validators.required],
    descripcion : ["", Validators.required],
    cveIncidencia : ["", Validators.required]
  })

  desacBtnCrear : boolean = false

  constructor(private userservice:UsersmoduleService,
    private fb : FormBuilder,private dialog:NgDialogAnimationService,  private Search:SearchService,  private contactoService : ContactService, 
    private asuntoService : AsuntoService, private serviceService : ServiceService, private usarioservice : UsuarioService, private deviceService : DeviceService
  ,  private renderer : Renderer2, private ipService : IpService,private rol: RolService,private ticketService:TicketService, private guarduser: AuthService,
    private ruta : Router,private route: ActivatedRoute ) {  }

  ngOnInit(): void {
    this.llamarCve();
    this.llamarAsuntos();
    this.todoRol();
    this.vistaPreviaTickets()
    
  }


//MetodoParallamar Grupos
  async llamarCve(){
    console.log("llamarcve")
    this.userservice.llamarGroup("Group").subscribe( async(result : any) =>{
      for await(const i of result.container){
        console.log("entrando a llamarcve")
        this.Grupos.push({value:i.idGrupo, viewValue:i.nombre, correo:i.correo })
        console.log(this.Grupos)
      }
    })
  }

  date(date:string){
    let dateArray = date.split("-")            
    return new Date (Number(dateArray[0]),Number(dateArray[2].split(",")[0]),Number(dateArray[1])).toLocaleDateString("es-ES",this.optionsDate)
  }

  contactoArray(ev : any){    
    this.indicesAcomu.push(Number(ev.option.id.split("_")[0]))
    this.acomuladorContactos.push(ev.option.value.correo)

    console.log("contacto array")
    console.log(this.acomuladorContactos)
    const newBut = document.createElement("Button");
    const titleIcon = this.renderer.createText("close")
    const titleBut = this.renderer.createText(ev.option._element.nativeElement.innerText+" ("+ev.option.value.correo+")")
    const icon = this.placeholder?.createComponent(MatIcon)
    
    this.renderer.setStyle(newBut,"border","none")
    this.renderer.setStyle(newBut,"display","inline-flex")
    this.renderer.setStyle(newBut,"align-items","center")
    this.renderer.setStyle(newBut,"margin-top","5px")
    this.renderer.setStyle(newBut,"background","transparent")
    this.renderer.setStyle(newBut,"font-weight","400")          
    this.renderer.setStyle(newBut,"margin-left","2px")          

    this.renderer.appendChild(icon.instance._elementRef.nativeElement,titleIcon)
    this.renderer.appendChild(newBut,icon.instance._elementRef.nativeElement)
    this.renderer.appendChild(newBut, titleBut);
    
    newBut.id = "a"+(this.idNuevo++)    
    var div = document.querySelector("#mat-group-suffix")
    div?.appendChild(newBut)    
    this.renderer.listen(newBut, 'click', (f:any) => { this.destruirButton(newBut,Number(ev.option.id.split("_")[0]))});
    this.myControlContacts.setValue("")
    
  }

  destruirButton(button:any,id:number){
    this.acomuladorContactos.splice(this.indicesAcomu.indexOf(id),1)   
    this.indicesAcomu.splice(this.indicesAcomu.indexOf(id),1)
    this.renderer.removeChild(document.querySelector("#mat-group-suffix"),document.getElementById(button.id))
  }

  async buscarIdentificador(palabra:string,button :any){
    console.log("Buscando:"+palabra)
    if(button.key !== "tab" && button.key !=="ArrowUp" && button.key !=="ArrowDown"
    && button.key !=="ArrowLeft" && button.key !=="ArrowRight" && button.key !=="Enter" 
    && (palabra.replace(/[0-9]*\gi/,"")).length < 12  || palabra == "" || Number(palabra) > 0 ){
       this.llamarDatosDelServicio(palabra,1,false)
    }
  }

  //te imprime los identificadores
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  //imprime todos los correos
  private _filterConcat(name: string): datosContacto[] {
    const filterValue = name.toLowerCase();
    return this.contactoLista.filter(option => option.correo.toLowerCase().includes(filterValue));
  }
 
  displayFn(user: string) : string {
    return user 
  }

   async opcionSeleccionada(identificador:string, cveCliente:string){
    const cvecliente2= cveCliente;
    console.log("id a buscar")
    console.log(cvecliente2);
    console.log("------")
    identificador = identificador.split(" ")[0]
    this.cveCliente = Number(cvecliente2)
    this.identificador = identificador
    this.formTicket.controls['contactoCorreo'].reset()
    //se desfragmenta el identificador
    let sepId : Array<string> = identificador.split("-")
     this.id = sepId[0]+"-"+sepId[1]+"-"+sepId[3];
     this.contador = Number(sepId[2]);
    
     this.rellenandoContactos()
    /**Llenando datos laterales del servicio */
     this.serviceService.selectVistaServicio(this.id,this.contador,2).subscribe((resp : responseService)=>{      
      console.log(resp.container);
          
      console.log(resp.container);
      
      this.datosServicio = {
      idCliente : resp.container[0].idCliente,
      cliente : resp.container[0].cliente,
      servicio : resp.container[0].servicio,
      plan : resp.container[0].plan,
      estatus: this.metodos.estatus(resp.container[0].estatus),
      idServicio : resp.container[0].idServicio
     } 

     console.log(resp.container[0].idCliente);
    })

    this.pingOtro = []
    this.pingRadio = []
    this.pingRouter = []
    this.contactoPrincipal = undefined
   // this.repetidorOtro = []
   // this.repetidorRadio = []
   // this.repetidorRadio = []
    /**Pidiendo pings para los otros equipos*/
    this.ipService.selectIpOneEquipament(0,this.id,3,this.contador).subscribe(async(resp:responseService) =>{      
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
    this.ipService.selectIpOneRouter(0,this.id,3,this.contador).subscribe(async(resp:responseService) =>{
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
    this.deviceService.todosRadios(this.id,this.contador).subscribe(async (resp:responseService)=>{
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
  }

  rellenandoContactos(){
    this.contactoService.llamar_Contactos_OnlyServicio(this.cveCliente!,this.contador!,2,this.id!).subscribe(async(resp:responseService)=>{
      this.contactoLista =  resp.container        
     /**Se llena el mat-autocomplete de los contactos */ 
      this.filteredContacts =  this.myControlContacts.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.correo;
         return nombre ? this._filterConcat(nombre as string) : this.contactoLista.slice();
        }),
      )
    })
  }

  async monitoreoPing( ip : string, i : number,array:pingDatos[]){ 
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
      
      }catch(Exception){}
    })) 
  }

  async llamarAsuntos(){
    await lastValueFrom(this.asuntoService.llamarAsunto()).then((resp :any)=>{
      this.asuntosArray = resp.container;
    });
  }
  
  //form para buscar identificador que no sabes como buscar
  abrirBuscadosIdentificador(){
    let dialogRef  = this.dialog.open(SearchIdComponent,
      {data: {  },
      animation: { to: "bottom" },
      height:"auto", width:"40%"
     });
     this.$sub.add(dialogRef.afterClosed().subscribe(async (result:string)=>{       
      if(result !== ""){
        console.log(result);
        
        await this.llamarDatosDelServicio(result,2,true)
      }
     }
     ));
  }

  buscarUsuarios(){
    let cve : number = this.idGrupo.value    
    this.formTicket.controls["cveUsuario"].reset();
    console.log(this.Grupos[cve-1].correo)
    this.acomuladorContactos.push(this.Grupos[cve-1].correo)
    this.usarioservice.usuariosGrupo(cve).subscribe((resp:responseService)=>{
      console.log("entrando a buscador grupo")
      console.log(cve);
      
      if(resp.status === "not found"){
        this.usuarios = []
      }else{
       this.usuarios = resp.container;
      }
    })
  }  

  agregarContacto(datos : number){        
    this.contactoPrincipal = datos
    console.log(this.contactoLista[this.contactoPrincipal!]);
    
  }


  vistaPreviaTickets(){
    this.ticketService.tickets(0,0).subscribe((resp:responseService)=>{
      this.arrayPrevTicket =  resp.container;
    })
  }

  agregarOtroContacto(){
    if(this.contador != undefined && this.id!){
    let dialogRef  = this.dialog.open(NewContactComponent,
      {data: {arrayRol:this.arrayRol, datosServicio: this.datosServicio},
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
  
    dialogRef.afterClosed().subscribe( (resp:string)=>{
     this.rellenandoContactos() } )

    }else{
      alert('Por favor primero seleccione un identificador')
    }
  }

  agregarCopia(bool: boolean){
    this.agregarMasContacto = bool;
    console.log("entrando al boolean");
    console.log(this.agregarMasContacto);

    
  }


  //Se activa cuando buscamos un identificador en el matAutocomplete
  async llamarDatosDelServicio(result :string,opc : number, buscarVentana:boolean){
    //console.log('entrando a llamarDatosDelServicio')
    await lastValueFrom(this.Search.searchTicketEntry(result,opc)).then( (result : responseService) =>{    
     // console.log('trayendo resultado de serrch')
      console.log("RESULTADO>>>>>>>>>>>>>>",result);

      if(result.status !== "not there Services"){
      
      this.options= result.container;      
      if(buscarVentana == true){
        //console.log("resul")
        //console.log(result.container[0])
        this.myControl.setValue(result.container[0])

      }

      this.datosServicio = {
        idCliente : undefined,
        cliente : "",
        servicio : "",
        plan : "",
        estatus: "",
        idServicio : 0
      } 

      this.pingOtro = []
      this.pingRadio = []
      this.pingRouter = []
      }else{
        this.options=[]
        //console.log('aqui ando')
        //console.log(this.options)
      }
    });

    //console.log("entrando a filteredoptionss")

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) =>  this._filter(value || '')) );

   // console.log(this.filteredOptions)
  }


  //Imprimir roles para agregar otro contacto
  async todoRol(){
    this.$sub.add(this.rol.llamarTodo().subscribe((resp:responseService) => {
      this.arrayRol = resp.container;      
    }))
  }

  async enviarTicket(){    
    this.renderer.addClass(document.getElementById("enviarTicket"),"button--loading")
    this.desacBtnCrear = true;
    
    
    if(this.formTicket.valid && this.myControl.valid){
      this.desacBtnCrear = true;
      if(this.agregarMasContacto == false){
        console.log("entrando en if boolean")

       // let correogrupo=this.Grupos.find(element=>element.value==Number(this.formTicket.controls["cveGrupo"]))
        
        console.log("variable correogrupo")
    
      //  this.acomuladorContactos.push(correogrupo!.correo)
        console.log("variable acumulador")

        this.contactsEmailTicket.correoCc  = this.acomuladorContactos
        console.log("variable contactsemailticket")
      }else{
        //this.acomuladorContactos.push('vanseduardo2@gmail.com')
        //this.acomuladorContactos.push('soporte@red-7.net')
        let cve : number = this.idGrupo.value    
        console.log(this.Grupos[cve-1].correo)
        this.acomuladorContactos.push(this.Grupos[cve-1].correo)
        this.contactsEmailTicket.correoCc  = this.acomuladorContactos

      }
      
      this.contactsEmailTicket.correo = this.contactoLista[this.contactoPrincipal!].correo
      this.contactsEmailTicket.texto =  this.formTicket.controls["descripcion"].value
      this.contactsEmailTicket.prioridad = this.metodos.prioridadEnLetraTicket(this.formTicket.controls["prioridad"].value)
      this.contactsEmailTicket.identificador = this.identificador
      this.contactsEmailTicket.tipo = this.metodos.tipoEnLetraTicket(this.formTicket.controls["tipo"].value)
      this.contactsEmailTicket.servicio = this.datosServicio?.servicio!
      this.contactsEmailTicket.nombreContacto = this.contactoLista[this.contactoPrincipal!].nombre
      this.contactsEmailTicket.nombreCliente = this.datosServicio?.cliente!

    
      let form : formTicketInterface
      form = this.formTicket.value
      form.abiertoUsuario = this.guarduser.getCveId()
      form.cveCliente = this.cveCliente!
      form.cveServicio = this.datosServicio?.idServicio!
      form.cveContacto = this.contactoLista[this.contactoPrincipal!].idContacto
      
      await lastValueFrom(this.ticketService.insertTickets(form))
      await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket))
      this.ruta.navigate(['../all-tickets'], {relativeTo: this.route});
      
    }else{
      alert("Por favor llene el formulario")
    }
  }

  


}
