import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { lastValueFrom, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { MyCustomPaginatorIntl } from './../../MyCustomPaginatorIntl';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { TicketService } from 'src/app/core/services/tickets.service';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { UsuarioService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { formNavSearchTicket } from 'src/app/interfaces/formNavSearchTicket.interface';
import { SearchService } from 'src/app/core/services/search.service';
import { MatButton } from '@angular/material/button';
import { dosParamsNum } from 'src/app/interfaces/dosParamsNum.interface';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MediaMatcher } from '@angular/cdk/layout';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { contactsEmailTicket } from 'src/app/models/contactsEmailTicket.model';
interface Grupo{
  value:number
viewValue:string
correo:string
}
export interface ticket {
  idTicket: Number,
  servicio : string,
  fechaAbierta: String,
  fechaCerrada: String,
  grupo: Number,
  grupoModificado?:Number,
  tipo: Number,
  agente: String,
  estado: Number,
  prioridad:Number,
  idUsuario:Number,
  identificador :string,
  nombre : string,
  correoAbiertoUsuario : string,
  nombreContacto : string ,
  correoAgente : string,
  correoGrupo : string
}

export interface usuario {
  apellidoPaterno: string,
  appelidoMaterno: string,
  correo: string,
  idUsuario: number,
  nombres: string,
  usuario: string
}
@Component({
  selector: 'app-all-tickets',
  templateUrl: './all-tickets.component.html',
  styleUrls: ['./all-tickets.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class AllTicketsComponent implements OnInit{
  cargando : boolean = false;
  Grupos :Grupo []=[]
  //var para borrar tickets
  borrar:boolean = true
  correos : string [] = []
  //variables de la tabla
  ELEMENT_DATA:  ticket[] = [ ];
  tickets:  ticket[] = [ ];
  displayedColumns: string[] = ['checkbox', 'ticket', 'servicio', 'fechaAbierta', 'fechaCerrada','grupo','tipo','agente','estado',"prioridad"];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);  
  inicio : number=0;
  fin : number=15;
  tablaTicket : any []=[]

  //variables para los inputs con opciones y con autocomplete
  separatorKeysCodes: number[] = [ENTER, COMMA];
  estadoControl = new FormControl('');
  filteredEstado!: Observable<string[]>;
  estados: string[] = [];
  estadosCve : number [] = [];
  todoEstado: string[] = ['Abierto', 'En progreso', 'Pausado', 'Cerrado'];
  todoEstadoAux: string[] = ['Abierto', 'En progreso', 'Pausado', 'Cerrado'];

  //Variables para los grupos que se estan abriendo en la tabla
  usuariosGrupo : any [] = []
  usuariosCveGrupo : number [] = []
  gruposCve:Number [] = []

  @ViewChild('estadoInput') estadoInput!: ElementRef<HTMLInputElement>;
  @ViewChild ("paginator") paginator!:MatPaginator;

  //botones del mat-menu-trigger
  @ViewChild ("misTickets") misTickets!:MatButton;
  @ViewChild ("todosTickets") todosTickets!:MatButton;
  @ViewChild ("ticketsSinResolver") ticketsSinResolver!:MatButton;
  @ViewChild ("ticketsAbiertosNuevos") ticketsAbiertosNuevos!:MatButton;
  @ViewChild ("grupoTable") grupoTable!:MatSelect;

  //autocomplete
  agenteControl = new FormControl('');
  creadoControl = new FormControl('');
  filtroSecControl = new FormControl('');

  optionsAgente: any[] = [];
  optionsCreado: any[] = [];
  creador? : usuario 
  agente? : usuario 
  grupoAgente : usuario[] = []

  filteredOptionsAgente?: Observable<any[]> ;
  filteredOptionsCreado?: Observable<any[]> ;


  formNav :FormGroup =  this.fb.group({
    buscar:[""],
    grupo:[""],
    tipo: [""],
    prioridad:[""],
    fuente:[""]
  })

  valueAgenteTab :FormGroup =  this.fb.group({
    agenteTabla:[""]
  })
  metodos = new RepeteadMethods();
  tituloAllTickets : string= "";
  condicion2: Number = 0;

  //variables para controlar los checkbox de angular
  cBox : FormControl = new FormControl() 
  guardarIdcBox : number = 0;
  banderaCheckbox : boolean = true;
  elTicket : ticket | undefined  


  //iniciador de filtro primer grado
  filtroPGrado : boolean = true


  varDetalle : number | undefined  //Guarda una variable de la tabla detalle log_ticket_det
  mobileQuery: MediaQueryList;


  link : boolean = false
  contactsEmailTicket =  new contactsEmailTicket();
  constructor(
    private userservice: UsersmoduleService,
    private fb : FormBuilder,
    private userServ: UsuarioService,
    private auth : AuthService,
    private search: SearchService, 
    private usarioservice : UsuarioService,
    private ticketService: TicketService,
    private ruta: Router,
    private media: MediaMatcher,
    ) { 

      this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
      
      if(ruta.url.split("/")[3] == "general"){
        this.condicion2 = 1;
        this.tituloAllTickets = "Mis Tickets";
        this.filtroPGrado = false;
      }else{
        this.condicion2 = 2
        this.tituloAllTickets= "Todos los tickets";
        this.filtroPGrado = true;

      }
    ///variables para los inputs con opciones
    this.filteredEstado = this.estadoControl.valueChanges.pipe(
      startWith(null),
      map((estado: string | null) => (estado ? this._filter(estado) : this.todoEstado.slice())),
    );
  }
 
  ngOnInit(): void {
    this.llamarCve();
    this.procedimiento(false);
    this.llenarUsuarios();
  
  }
  //Grupos 
  async llamarCve(){
    this.userservice.llamarGroup("Group").subscribe(async(result : any) =>{
    for await (const ob of result.container){
    this.Grupos.push({value:ob.idGrupo, viewValue:ob.nombre,correo:ob.correo })
    }
    })
  }

  hayUsers(){
    if(this.ELEMENT_DATA.length != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
    }
  }


//Metodo utilizado para hacer todos los filtros
  async procedimiento(limpieza: Boolean){
    this.cBox.reset()
    this.borrar = true;
   await this.llenadoInicial(limpieza)
  }

  //Actualizando elementos de cada ticket y un poco mas
  async guardarGrupo(ticket:ticket,cve:string,cveTicket:string){ 
  this.ELEMENT_DATA[this.ELEMENT_DATA.indexOf(ticket!)].grupo = Number(cve)    
  let dosParamsNumGrupo:dosParamsNum = {
    cve : Number(cve),
    cve2 : Number(cveTicket),
    cveUsuario : this.auth.getCveId()
  } 

  let dosParamsNumAgente:dosParamsNum = {
    cve : 0,
    cve2 : Number(cveTicket)
  } 
  
  await lastValueFrom(this.ticketService.actualizarGrupo(dosParamsNumGrupo))
  await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNumAgente))
      let grupo1= this.Grupos.find(element=>element.value==Number(cve))
      this.correos.push(grupo1!.correo).toString()
      let agente1=(this.usuariosGrupo.find(element=>element.idUsuario=ticket.agente))
      this.correos.push(agente1!.correo).toString()
     this.contactsEmailTicket.TextoAsunto="El Ticket ha sido escalado al grupo:"+grupo1?.viewValue
     this.contactsEmailTicket.correo=ticket.correoAbiertoUsuario
     this.contactsEmailTicket.prioridad=this.metodos.prioridadEnLetraTicket(ticket.prioridad.toString())
     this.contactsEmailTicket.servicio=ticket.servicio.toString()
     this.contactsEmailTicket.identificador=ticket.identificador
     this.contactsEmailTicket.nombreCliente=ticket.nombre
     this.contactsEmailTicket.nombreContacto=ticket.nombreContacto
     this.contactsEmailTicket.correoCc=this.correos
this.contactsEmailTicket.estatus=this.metodos.estadoEnLetraTicket(ticket.estado.toString()) 
     await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket))  
}  

  async buscarUsuarionav(cve:string){
    this.optionsAgente = []
    this.usarioservice.usuariosGrupo(Number(cve)).subscribe(async (resp:responseService)=>{      
      for await (const usuario of resp.container) {
          this.optionsAgente.push(usuario)
      }
      this.filteredOptionsAgente = this.agenteControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.usuario;
         return nombre ? this._filterAgente(nombre as string) : this.optionsAgente.slice()}),
      );
    })
  }

  async buscarUsuariosTabla(cve:string,ticket? :ticket){
    this.usarioservice.usuariosGrupo(Number(cve)).subscribe((resp:responseService)=>{
      if(resp.status === "not found"){
        this.usuariosGrupo[this.gruposCve.indexOf(Number(cve))] = []
      }else{
        this.usuariosGrupo[this.gruposCve.indexOf(Number(cve))] = resp.container;  
      }

      if(ticket !=undefined) {        
        this.ELEMENT_DATA[this.ELEMENT_DATA.indexOf(ticket!)].grupoModificado = this.gruposCve.indexOf(Number(cve))        
      }

    })
  }

  async agenteGuardar(ticket:ticket,cve:string,cveTicket:string){

        

  let dosParamsNumGrupo:dosParamsNum = {
    cve :  Number(this.ELEMENT_DATA[this.ELEMENT_DATA.indexOf(ticket!)].grupo),
    cve2 : Number(cveTicket),
    cveUsuario : this.auth.getCveId()
  } 

  this.varDetalle = await( await lastValueFrom(this.ticketService.actualizarGrupo(dosParamsNumGrupo))).container[0].max
  let dosParamsNum:dosParamsNum = {
    cve : Number(cve),
    cve2 : Number(cveTicket),
    cveUsuario: this.auth.getCveId(),
    cveLogDet: this.varDetalle 
  }
  console.log(this.varDetalle);
  
  await lastValueFrom(this.ticketService.actualizarAgente(dosParamsNum))
    
  }

  async guardarEstado(cve:string,cveTicket:string,ticket:ticket){
    
    console.log(cve,cveTicket,ticket);
    

    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : Number(cveTicket),
        cveUsuario: this.auth.getCveId()
      } 

      if(Number(cve) == 4){
        this.contactsEmailTicket.TextoAsunto="El Ticket "+cveTicket+" se ha cerrado"  
        this.contactsEmailTicket.correo = ticket.correoAbiertoUsuario
        this.contactsEmailTicket.nombreContacto = ticket.nombreContacto
        this.contactsEmailTicket.correoCc= [ticket.correoAgente,ticket.correoGrupo]
        this.contactsEmailTicket.prioridad= this.metodos.prioridadEnLetraTicket(ticket.prioridad.toString())
        this.contactsEmailTicket.servicio=ticket.servicio
        this.contactsEmailTicket.identificador=ticket.identificador
        this.contactsEmailTicket.nombreCliente=ticket.nombre
        this.contactsEmailTicket.estatus="Cerrado"

        await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket)) 
      }

        await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
      }
  }

  async guardarPrioridad(cve:string,cveTicket:string){
    if(Number(cve) > 0){
      let dosParamsNum:dosParamsNum = {
        cve : Number(cve),
        cve2 : Number(cveTicket),
        cveUsuario: this.auth.getCveId()
      } 
        await lastValueFrom(this.ticketService.actualizarPropiedad(dosParamsNum))
      }
  }

  async eliminarTicket(){
    let eliminarTicket : dosParamsNum ={
      cve:Number(this.elTicket),
      cve2:0
    }
    await lastValueFrom(this.ticketService.deleteTickets(eliminarTicket))

    this.procedimiento(false)
  }

    async cerrarTicket(){      
      this.contactsEmailTicket.TextoAsunto="El Ticket "+this.elTicket!.idTicket+" se ha cerrado"  
      this.contactsEmailTicket.correo = this.elTicket!.correoAbiertoUsuario
      this.contactsEmailTicket.nombreContacto = this.elTicket!.nombreContacto
      this.contactsEmailTicket.correoCc= [this.elTicket?.correoAgente!,this.elTicket!.correoGrupo]
      this.contactsEmailTicket.prioridad= this.metodos.prioridadEnLetraTicket(this.elTicket!.prioridad.toString())
      this.contactsEmailTicket.servicio=this.elTicket!.servicio
      this.contactsEmailTicket.identificador=this.elTicket!.identificador
      this.contactsEmailTicket.nombreCliente=this.elTicket!.nombre
      this.contactsEmailTicket.estatus="Cerrado"

    await lastValueFrom(this.ticketService.enviarCorreo(this.contactsEmailTicket)) 

      let dosParamsNum : dosParamsNum = {
        cve:4,
        cve2:Number(this.elTicket!.idTicket),
        cveUsuario: this.auth.getCveId()
      }
      await lastValueFrom(this.ticketService.actualizarEstado(dosParamsNum))
      this.procedimiento(false)


    }

  //metodo utilizado cuando entras a la pagina
  llenarUsuarios(){
    this.userServ.todosUsuarios().subscribe( async (resp:responseService) =>{            
      for await (const usuario of resp.container) {
        this.optionsCreado.push(usuario)        
      }
      this.filteredOptionsCreado = this.creadoControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const nombre = typeof value === 'string' ? value : value?.usuario;
         return nombre ? this._filterCreado(nombre as string) : this.optionsCreado.slice()}
          ));
      })
      
   
  }

  //Metodos para los autocomplete con chips
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.estados.push(value);      
    }
    event.chipInput!.clear();
    this.estadoControl.setValue(null);
  }

  remove(estado: string): void {
    const index = this.estados.indexOf(estado)

    if (index >= 0) {
      this.todoEstado.push(this.estados[index])
      this.estadosCve.splice(this.estadosCve.indexOf(  this.todoEstadoAux.indexOf(this.estados[index])+1),1)
      this.estados.splice(index, 1);

      this.filteredEstado = this.estadoControl.valueChanges.pipe(
        startWith(null),
        map((estado: string | null) => (estado ? this._filter(estado) : this.todoEstado.slice())),
      );
    }
  }

  selectedEstado(event: MatAutocompleteSelectedEvent): void {
    this.estados.push(event.option.viewValue);
    this.estadosCve.push(this.todoEstadoAux.indexOf(event.option.viewValue)+1)
    
    this.todoEstado.splice(this.todoEstado.indexOf(event.option.viewValue),1)
    this.estadoInput.nativeElement.value = '';
    this.estadoControl.setValue(null);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.todoEstado.filter(estado => estado.toLowerCase().includes(filterValue));
  }

  borrarClick(bool : boolean, idTicket : ticket,matCheck : MatCheckbox ){
    this.borrar = bool
    this.elTicket = idTicket
    this.cBox.reset()
  }

  borrarChange(idTicket : number,matCheck : MatCheckbox){

    if (this.guardarIdcBox == idTicket && this.banderaCheckbox == false) {
      matCheck.checked = false
      this.banderaCheckbox = true;
    } else {
      this.banderaCheckbox = false
    }
    this.guardarIdcBox = idTicket;

  }

  ///metodos del auto complete (para su funcionamiento)
  private _filterAgente(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsAgente.filter((option :any)=> option.usuario.toLowerCase().includes(filterValue));
  }

  private _filterCreado(value: string): string[] {    
    const filterValue = value.toLowerCase();
    return this.optionsCreado.filter((option :any) => option.usuario.toLowerCase().includes(filterValue));
  }
 
  //metodos extras del auto complete
 eligiendoCreadorMatAutoCom(u : usuario){
    this.creador = u
    this.creadoControl.setValue(u.usuario)      
  }

  eligiendoAgenteMatAutoCom(u : usuario){
    this.agente = u
    this.agenteControl.setValue(u.usuario)
  }

  async llenadoInicial( limpieza:Boolean){
    let form :formNavSearchTicket = this.formNav.value 
    if(limpieza == false){
      form.agente = this.agenteControl.value==="" || this.agenteControl.value===undefined?0:this.agente?.idUsuario!
      form.creador = this.creadoControl.value==="" || this.creadoControl.value===undefined ?0:this.creador?.idUsuario!
      form.estados = this.estadosCve.toString();
      form.condicion2 = this.condicion2;
      form.condicion = Number(this.filtroSecControl.value==0?1:this.filtroSecControl.value);
    }else{
      this.agenteControl.reset()
      this.creadoControl.reset()
      this.formNav.reset()
      this.filtroSecControl.reset()  
      form = this.formNav.value
      form.agente = 0
      form.creador = 0   
      form.estados = ""
      form.condicion = 1
      form.condicion2 = this.condicion2;

    }
    form.cveGrupo = this.auth.getCveGrupo()  
    form.cve = this.auth.getCveId()
    
    this.ELEMENT_DATA = new Array<ticket>();
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 
    try {
      this.paginator.firstPage()
    } catch (error) { }
    
    this.search.buscarPorNavbar(form).subscribe(async (resp:responseService)=>{    
      this.tablaTicket = resp.container  
      this.inicio = 0
      this.fin = 15      
      if(this.tablaTicket.length > 0){
        while (this.inicio < this.fin + 2 && this.inicio < this.tablaTicket.length) {          
          if(this.inicio < this.fin){    
          this.ELEMENT_DATA[this.inicio] = ({
            agente: this.tablaTicket[this.inicio].agente,
            correoAbiertoUsuario: this.tablaTicket[this.inicio].correoAbiertoUsuario,
            correoAgente:  this.tablaTicket[this.inicio].correoAgente,
            correoGrupo: this.tablaTicket[this.inicio].correoGrupo,
            estado: this.tablaTicket[this.inicio].estado,
            fechaAbierta: this.tablaTicket[this.inicio].fechaAbierta,
            fechaCerrada:this.tablaTicket[this.inicio].fechaCerrada,
            grupo:this.tablaTicket[this.inicio].grupo,
            idTicket: this.tablaTicket[this.inicio].idTicket,
            idUsuario: this.tablaTicket[this.inicio].idUsuario,
            identificador:  this.tablaTicket[this.inicio].identificador,
            nombre: this.tablaTicket[this.inicio].nombre,
            nombreContacto: this.tablaTicket[this.inicio].nombreContacto,
            prioridad:this.tablaTicket[this.inicio].prioridad,
            servicio : this.tablaTicket[this.inicio].servicio,
            tipo : this.tablaTicket[this.inicio].tipo
            })   
            if(this.gruposCve.indexOf(this.tablaTicket[this.inicio].grupo) == -1){
              this.gruposCve.push(Number(await this.tablaTicket[this.inicio].grupo));
              await this.buscarUsuariosTabla( await this.tablaTicket[this.inicio].grupo.toString()) 
            }   
          }
          this.inicio++     
        }
      }
      
        this.dataSource = new MatTableDataSource( this.ELEMENT_DATA);
        this.dataSource.paginator =  this.paginator;   
        this.paginator.length =  await this.tablaTicket.length;  
        this.cargando = true
    })    
    
  }

  //filtros de tercer grado
  filtroNavbar(){
    const form :formNavSearchTicket = this.formNav.value 
    form.cve = this.auth.getCveId(),
    form.estados = this.estadosCve.toString()
   // this.search.buscarPorNavbar(formNavSearchTicket)
  }

  async pageEvents(event: any) {  
    if(event.previousPageIndex > event.pageIndex) {
    this.inicio = (this.inicio-(this.inicio%15)) -   30;
    if(this.inicio < 0){
      this.inicio = 0;
    }
    this.fin =  (this.fin - (this.fin%15)) - 15;
    await this.cargarInicio();
  } else {
    this.inicio = this.fin;
    this.fin = this.fin + 15;
    await this.cargarInicio();
  }
}   

async cargarInicio(){
  this.ELEMENT_DATA=[];
  this.dataSource = new MatTableDataSource(); 
  while (this.inicio < this.fin + 2 && this.inicio < this.tablaTicket.length) {
    if(this.inicio < this.fin){    
    this.ELEMENT_DATA[this.inicio] = ({
      agente: this.tablaTicket[this.inicio].agente,
      correoAbiertoUsuario: this.tablaTicket[this.inicio].correoAbiertoUsuario,
      correoAgente:  this.tablaTicket[this.inicio].correoAgente,
      correoGrupo: this.tablaTicket[this.inicio].correoGrupo,
      estado: this.tablaTicket[this.inicio].estado,
      fechaAbierta: this.tablaTicket[this.inicio].fechaAbierta,
      fechaCerrada:this.tablaTicket[this.inicio].fechaCerrada,
      grupo:this.tablaTicket[this.inicio].grupo,
      idTicket: this.tablaTicket[this.inicio].idTicket,
      idUsuario: this.tablaTicket[this.inicio].idUsuario,
      identificador:  this.tablaTicket[this.inicio].identificador,
      nombre: this.tablaTicket[this.inicio].nombre,
      nombreContacto: this.tablaTicket[this.inicio].nombreContacto,
      prioridad:this.tablaTicket[this.inicio].prioridad,
      servicio : this.tablaTicket[this.inicio].servicio,
      tipo : this.tablaTicket[this.inicio].tipo
      })   
      if(this.gruposCve.indexOf(this.tablaTicket[this.inicio].grupo) == -1){
        this.gruposCve.push(Number(this.tablaTicket[this.inicio].grupo));
        this.buscarUsuariosTabla(this.tablaTicket[this.inicio].grupo.toString()) 
      }
    }
    this.inicio++         
  }
  
  this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  this.dataSource.paginator = this.paginator;    
  this.paginator.length =  await this.tablaTicket.length;  
  this.cargando = true

}
  //Filtro de primer grado

  async cambiarTitulo(opc:Number){
    this.misTickets.disabled = false;
    this.ticketsAbiertosNuevos.disabled = false;
    this.ticketsSinResolver.disabled = false;
    this.todosTickets.disabled = false;
    this.condicion2 = opc;
    switch (opc) {
      case 1:
        this.tituloAllTickets = "Mis Tickets";
        this.misTickets.disabled = true;
        break;
      case 2:
        this.tituloAllTickets = "Todos los tickets";
        this.todosTickets.disabled = true;
        break;
      case 3:
        this.tituloAllTickets = "Todos los tickets sin resolver";
        this.ticketsSinResolver.disabled = true;
        break;
      case 4: 
        this.tituloAllTickets = "Tickets nuevos y abiertos";
        this.ticketsAbiertosNuevos.disabled = true;
        break;    
      default:
        break;
    }
    await this.procedimiento(true);
  }


}



