import { Component, OnInit, ChangeDetectorRef, AfterViewInit, Renderer2, Input, Output } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {  lastValueFrom, Observable, Observer, Subscription } from 'rxjs';
import { startWith,map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControl } from '@angular/forms';
import { SearchService } from 'src/app/core/services/search.service';
import { NotifierService } from 'angular-notifier';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';
import { DataService } from 'src/app/core/services/data.service';
import { DataLayoutService } from 'src/app/core/services/dataLayout.service';
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})

export class LayoutComponent implements OnInit, AfterViewInit {
  dentro:boolean=false
  fuera:boolean=false
  nombre: string =""
  booleantodos:boolean=true
  booleanservicio:boolean=true
  booleancontactos:boolean=true
  booleantickets:boolean=true
  ocultar:boolean=true
  mostrar:string="on"
  metodos = new RepeteadMethods();
  private readonly notifier: NotifierService;
  serviciosbooleanlabel:boolean=false
  contactosbooleanlabel:boolean=false
  ticketsbooleanlabel:boolean=false
  botontodos:boolean=true
  botonservicio:boolean=false
  botoncontacto:boolean=false
  botontickets:boolean=false
  cargando : boolean=false

    time = new Observable<string>((observer: Observer<string>) => {
        setInterval(() => observer.next(
            new Date().toTimeString().split(" ")[0]), 1000);
    });    
    
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    showSpinner: boolean = false;
    userName: string = "";
    isAdmin: boolean = false;
    private autoLogoutSubscription: Subscription = new Subscription;
    logo:any
    myControl = new FormControl('');
    options: string[] = [];
    contacts:string[]=[]
    tickets:string[]=[]
    array: string[] = [];
    filteredOptions: Observable<string[]> | undefined;
    filteredContacts: Observable<string[]> | undefined;
    filteredTickets: Observable<string[]> | undefined;

    constructor( 
        notifierService: NotifierService,
       private auth : AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private router : Router,
        private configservice:ConfigService,
        private Search:SearchService,
        private _renderer : Renderer2,
        private dataService : DataLayoutService
      ) {
        this.notifier = notifierService;
        this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        // tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
      this.dataService.open.subscribe(resp=>{
        this.mobileQuery = this.media.matchMedia('(max-width: 1200px)');        
      })
        // tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
        this.autoLogoutSubscription.unsubscribe();
        lastValueFrom(this.configservice.llamarEmpresa()).then( (result : any) =>{
        this.logo=result.container[0]["logo"]
        });    
    }

    accesoAdminSoporte(){
    if(this.auth.getCveRol() == 1){
      return "block"
    }else{
      return "none"  
      }  
    }

    accesoAdminFacturacion(){
      if(this.auth.getCveRol() != 3){
        return "block"
      }else{
        return "none"  
        }  
      }

    

    ngAfterViewInit(): void {
      this.changeDetectorRef.detectChanges();
    }

    private _filter(value: string): string[] {
        const filterValue :string= value.toLowerCase();
        return this.options.filter((option :string) => option.toLowerCase().includes(filterValue));
      }
      private _filterContacts(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.contacts.filter((option :string) => option.toLowerCase().includes(filterValue));
      }
       private _filterTickets(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.tickets.filter((option :string) => option.toLowerCase().includes(filterValue));
      }

    salir(){
      if(this.auth.getTipo()==1){
          this.auth.cerrarSesion();
          this.router.navigateByUrl("/admin");
      }else{
          this.auth.cerrarSesion();
          this.router.navigateByUrl("/usuario");
      }
    }

  close(){
    try{
      this.fuera=true
      if(this.fuera==true&&this.dentro==true){
        this._renderer.setStyle(document.getElementById("ocultar"),"visibility","visible")
        this._renderer.setStyle(document.getElementById("mat-autocomplete-0"),"visibility","visible")
      }else{
        this._renderer.setStyle(document.getElementById("ocultar"),"visibility","hidden")
        this._renderer.setStyle(document.getElementById("mat-autocomplete-0"),"visibility","hidden")
      }
      this.fuera=false
      this.dentro=false
    }catch(Exception){
  
    }
  }

  close2(){
    this.dentro=true
  }

  todosbutton(id:string,event : any){
    this.botontodos=true
    this.botonservicio=false
    this.botoncontacto=false
    this.botontickets=false
    this.servicio(id,event);
    this.contacto(id,event);
    this.ticket(id,event);
  }

  serviciobutton(id:string,event : any){
  this.botontodos=false
   if(this.botoncontacto==false){
    this.filteredContacts = new FormControl('').valueChanges;
   }
   if(this.botontickets==false){
    this.filteredTickets = new FormControl('').valueChanges;
   }
   if(this.botonservicio==false){
    this.botonservicio=true
    this.servicio(id,event);
   
   }else{
    this.filteredOptions = new FormControl('').valueChanges;
    this.botonservicio=false
   }
}

  contactobutton(id:string,event : any){
  this.botontodos=false
  if(this.botonservicio==false){
    this.filteredOptions = new FormControl('').valueChanges;
   }
   if(this.botontickets==false){
    this.filteredTickets = new FormControl('').valueChanges;
   }
   if(this.botoncontacto==false){
    this.botoncontacto=true
    this.contacto(id,event);
   
   }else{
    this.filteredContacts = new FormControl('').valueChanges;
    this.botoncontacto=false
   }
  }

  ticketbutton(id:string,event : any){
  this.botontodos=false
  if(this.botonservicio==false){
    this.filteredOptions = new FormControl('').valueChanges;
   }
   if(this.botoncontacto==false){
    this.filteredContacts = new FormControl('').valueChanges;
   }
   if(this.botontickets==false){
    this.botontickets=true
    this.ticket(id,event);
 
   }else{
    this.filteredTickets = new FormControl('').valueChanges;
    this.botontickets=false
   }
}
    async servicio(id:string,event : any){
      this.cargando=true
      if(this.botonservicio==true||this.botontodos==true){
        id = id.split(" ")[0]
        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchService(id)).then( (result : responseService) =>{
          if(result.status !== "not found"){
            this.serviciosbooleanlabel=true
            this.options= result.container;
          }else{
            this.serviciosbooleanlabel=false
            this.options=[]
          }
        });
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filter(value || '')) );
        }
    }else{
        this.serviciosbooleanlabel=false
        this.options=[]
      }
    this.cargando=false
    }

    async contacto(id:string,event : any){
        if(this.botoncontacto==true||this.botontodos==true){
        id = id.split(" ")[0]
        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchContact(id)).then( (result : responseService) =>{
          if(result.status !== "not found"){
            this.contactosbooleanlabel=true
          this.contacts= result.container;          
          }else{
            this.contactosbooleanlabel=false
            this.contacts=[]
          }
        });
        this.filteredContacts = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filterContacts(value || '')) );
        }
        }else{
          this.contactosbooleanlabel=false
          this.contacts=[]  
        }
    }


    async ticket(id:string,event : any){
      if(this.botontickets==true||this.botontodos==true){
        id = id.split(" ")[0]
        if(event.key !== "tab" && event.key !=="ArrowUp" && event.key !=="ArrowDown"
        && event.key !=="ArrowLeft" && event.key !=="ArrowRight" && event.key !=="Enter" 
        || id == "" || Number(id) > 0){
          await lastValueFrom(this.Search.searchTicket(id)).then( (result : responseService) =>{            
          if(result.status !== "not found"){
            this.ticketsbooleanlabel=true
          this.tickets= result.container;
          }else{            
            this.ticketsbooleanlabel=false
            this.tickets=[]
          }
        });

        this.filteredTickets = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: any) =>  this._filterTickets(value || '')) );
        }
      } else {
        this.ticketsbooleanlabel=false
        this.tickets=[]
      }
    }

    async irServicio (servicio : string){
    var onlyservice =servicio.split(" ")[0];
    var number=servicio.split(" | ")[2]
    var estatus=servicio.split(" | ")[3]
      
    if(Number(estatus)!=2){
      
      this.router.navigateByUrl("/admin/client/"+Number(number)+"/"+onlyservice).then(() => {
      window.location.reload();            
     });
      } else {
      this.notifier.notify('warning', 'Servicio Inactivo');            
    }    
          
  }


  async irTicket (ticket : string){
    ticket=ticket.split(" ")[0]
      this.router.navigateByUrl("/admin/tickets/edit-ticket/"+ticket).then(() => {
      window.location.reload();
     });
  }    
  irContacto(link:string){
    this.router.navigateByUrl('/admin/client/'+link.split(' | ')[2]+'/contact/'+link.split(' | ')[1]
    ).then(() => {
    window.location.reload();
   });
  }  
  }
     
          
  





  

