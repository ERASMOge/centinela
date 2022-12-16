import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {ThemePalette} from '@angular/material/core';
import { CustomerService } from 'src/app/core/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { responseService } from 'src/app/models/responseService.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DataService } from 'src/app/core/services/data.service';


@Component({
  selector: 'app-customer-company',
  templateUrl: './customer-company.component.html',
  styleUrls: ['./customer-company.component.css']
})
export class CustomerCompanyComponent implements OnInit {
  correolink:string=""
    clickDownload: number = 0
  clickAdd : number = 0
  padre : string = ""
  nombreEmpresa : string  = ""
  cargando : boolean = false;
  datos : any;
  metodo  = new RepeteadMethods()
  $sub = new Subscription()
  load : boolean = false
  buttonAgregar : Boolean = false
  link : boolean  = true


  ELEMENT_DATA_TICKETS : any = [
    {
    id:"1",
    nombre:"1",
    }
  ];

  navLinks = [
    {
      label: 'Servicios',
      link: './',
      index: 0
    }, {
      label: 'Tickets',
      link: './ticket',
      index: 1
    }, {
      label: 'Contactos',
      link: './contact',
      index: 2
    }, {
      label: 'R.S.',
      link: './rs',
      index: 3
    }, {
      label: 'Log',
      link: './log',
      index: 4
    }
  ];
  
  activeLink = this.navLinks[0].link;

  background: ThemePalette = undefined;
  id :number = this.rutaActiva.snapshot.params["id"];
  correo :string = this.rutaActiva.snapshot.params["correo"];


  toggleBackground() {
    this.background = this.background ? undefined : 'primary';
  }

  dataSourceTickets = new MatTableDataSource(this.ELEMENT_DATA_TICKETS);
  displayedColumnsTickets: string[] = ['id', 'nombre'];

  constructor(private serviceCustomer : CustomerService, private rutaActiva : ActivatedRoute
    ,private DataService : DataService, private router : Router,private renderer : Renderer2) { 
    let diagonal : string | undefined = this.router.url.split("/",6)[4];
    if(diagonal != undefined){
      this.activeLink = "./"+diagonal
    }    

    if(diagonal === "log" || diagonal === "ticket"){
      this.buttonAgregar = true
    }else{
      this.buttonAgregar = false
    }

  }
  


  ngOnInit(): void {
    this.datosCliente()
    this.Link()
    
    
  } 
        

  

Link(){
 this.correolink=window.location.href.split("/")[7] 
 document.getElementById("boton")?.addEventListener("click",function(){
  
 })
}

filtrarLink(){
  this.DataService.open.emit({palabraBuscar:this.correolink})
}

  filtrarTabla(event:any){

    const filterValue = (event.target as HTMLInputElement).value;
    this.DataService.open.emit({palabraBuscar:filterValue})
  }


  async datosCliente() {
    try{
    lastValueFrom(this.serviceCustomer.buscarCliente(this.id)).then((resp : responseService) =>{
      this.datos = resp.container[0];
      this.load = true;
    })
  }catch(Exception){}
  }

  agregar(form : Boolean,nombreEmpresa:string){
    this.DataService.open.emit({abrir:form, nombreEmpresa : nombreEmpresa});
  }

  descargar(form : Boolean,nombreEmpresa : string){
    this.DataService.open.emit({abrir:form, nombreEmpresa : nombreEmpresa});
  }

  desactivarBotones(index:number){   
    if(index == 4 || index === 1){
      this.buttonAgregar = true
    }else{
      this.buttonAgregar = false
    }
  }

}
