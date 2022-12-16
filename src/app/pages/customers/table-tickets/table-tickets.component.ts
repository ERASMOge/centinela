import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { TicketService } from 'src/app/core/services/tickets.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewTicketComponent } from '../popup/new-ticket/new-ticket.component';
import { Workbook } from 'exceljs'; 
import * as fs from 'file-saver';
import { DataService } from 'src/app/core/services/data.service';


interface tickets {
  idTicket: number;
  servicio:string;
  fechaAbierta:string;
  fechaCerrada:string | undefined;
  grupo:string;
}

@Component({
  selector: 'app-table-tickets',
  templateUrl: './table-tickets.component.html',
  styleUrls: ['./table-tickets.component.css']
})
export class TableTicketsComponent implements OnInit {
  @Input() hijoTickets :string ="";
  tickets: tickets [] = [];

  identificador : string = this.ruta.url.split("/")[4];
  ELEMENT_DATA : any = []
  metodos = new RepeteadMethods()
  displayedColumns: string[] = ['departamento', 'asunto', 'servicio', 'fechaCerrada','fechaAbierta','estado','agente'];
  cargando : boolean = false;
  $sub = new Subscription()
  @Input ()viewService :boolean = false
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  id :number = Number(this.ruta.url.split("/")[3]);
  tablaTicket :any [] = []
  mayorNumero : number = 0
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  inicio : number=0;
  fin : number=5;
  comentario : boolean = true
  constructor( private dialog:NgDialogAnimationService, private rutaActiva:ActivatedRoute,
    private notificationService: NotificationService, private servicioTickets : TicketService
    ,private DataService : DataService, private ruta : Router ) {
      
      }
     


  ngOnInit(): void {
    if(this.viewService === false){
    this.llenarTabla();
    this.$sub.add(this.DataService.open.subscribe(res => {
      if(res.palabraBuscar !=undefined){
        this.filtrar(res.palabraBuscar)
      }else{
        if(res.palabraBuscar !=undefined){
          this.filtrar(res.palabraBuscar)
        }else{
          if(res.abrir ==true || res == "ticketAgregar"){
            this.insertar()
          }else if (res.abrir == false){
            this.descargar()
          }
        }
      }
      }))  
    }else{
      this.llenarTabla_vistaServicio();
    }
  }
  filtrar(palabra: string) {
    this.dataSource.filter = palabra.trim().toLowerCase();
  } 


  descargar(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    let header : string[]=["Id","Departamento","Asunto","Servicio","Fecha cerrada", "Fecha abierta", "Estado", "Agente"]
    worksheet.addRow(header);
  
    for  (let x1 in this.ELEMENT_DATA)
    {
      let x2=Object.keys(x1);
      let temp : any=[]

        temp.push(this.ELEMENT_DATA[x1]["num" ])
        temp.push(this.ELEMENT_DATA[x1]["departamento"])
        temp.push(this.ELEMENT_DATA[x1]["asunto"])
        temp.push(this.ELEMENT_DATA[x1]["servicio"])
        temp.push(this.ELEMENT_DATA[x1]["fechaCerrada"] !== undefined? "No asignada": this.ELEMENT_DATA[x1]["fechaCerrada"])
        temp.push(this.ELEMENT_DATA[x1]["fechaAbierta"])
        temp.push(this.metodos.estadoEnLetraTicket(this.ELEMENT_DATA[x1]["estado"]))
        temp.push(this.ELEMENT_DATA[x1]["agente"])
      worksheet.addRow(temp)
    }

    let fname="ExcelClientes"

    workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');  

    });
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }

  llenarTabla_vistaServicio(){
    this.cargando = false;             
    let sepId : Array<string> = this.identificador.split("-")
     let identi = sepId[0]+"-"+sepId[1]+"-"+sepId[3];
     let contador = Number(sepId[2]);
     
    this.$sub.add( this.servicioTickets.llamarTodo(this.id,identi+" "+contador).subscribe(async (resp:any) =>{      
      this.tablaTicket = resp.container
      console.log(resp.container);
      
      if(resp.container.length !=0){
        while (this.inicio < this.fin + 2 && this.inicio < this.tablaTicket.length) {
          if(this.inicio < this.fin){    
          this.ELEMENT_DATA.push({
          num:resp.container[this.inicio].idTicket,
          departamento: resp.container[this.inicio].departamento,
          asunto:resp.container[this.inicio].asunto,
          servicio:resp.container[this.inicio].servicio,
          fechaCerrada:resp.container[this.inicio].fechaCerrada,
          fechaAbierta:resp.container[this.inicio].fechaAbierta,
          estado:resp.container[this.inicio].estado,
          agente: resp.container[this.inicio].agente,
        })   
      }
      this.inicio++;      
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  await this.paginator2;    
      this.dataSource.sort =  this.sort;
      this.paginator2.length = await resp.container.length;
    }
    }))
    this.cargando = true;
  }
  
   llenarTabla(){
    this.cargando = false;             
    this.$sub.add( this.servicioTickets.llamarTodo(this.id,"").subscribe(async(resp:any) =>{      
      this.tablaTicket = resp.container      
      console.log(resp.container);
      
      if(resp.container.length !=0){
        while (this.inicio < this.fin + 2 && this.inicio < this.tablaTicket.length) {
          if(this.inicio < this.fin){    
          this.ELEMENT_DATA.push({
          num:resp.container[this.inicio].idTicket,
          departamento: resp.container[this.inicio].departamento,
          asunto:resp.container[this.inicio].asunto,
          servicio:resp.container[this.inicio].servicio,
          fechaCerrada:resp.container[this.inicio].fechaCerrada,
          fechaAbierta:resp.container[this.inicio].fechaAbierta,
          estado:resp.container[this.inicio].estado,
          agente: resp.container[this.inicio].agente,
          })   
        } 
        this.inicio++     
      }
      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  await this.paginator2;    
      this.dataSource.sort =  this.sort;
      this.paginator2.length = await resp.container.length;
    }
 
    
    }))
    this.cargando = true;

  }
  
  async cargarInicio(){
    this.comentario = true
    this.cargando = false;
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource();
   while (this.inicio < this.fin + 2 && this.inicio < this.tablaTicket.length) {
    if(this.inicio < this.fin){        
      this.ELEMENT_DATA[this.inicio] =  (    
        {
          num:this.tablaTicket[this.inicio].idTicket,
          departamento: this.tablaTicket[this.inicio].departamento,
          asunto:this.tablaTicket[this.inicio].asunto,
          servicio:this.tablaTicket[this.inicio].servicio,
          fechaCerrada:this.tablaTicket[this.inicio].fechaCerrada,
          fechaAbierta:this.tablaTicket[this.inicio].fechaAbierta,
          estado:this.tablaTicket[this.inicio].estado,
          agente: this.tablaTicket[this.inicio].agente,
        });        
      }
    this.inicio++      
    }
    if(this.ELEMENT_DATA.length == 0 ){
      this.comentario = false;
    }else {
      this.comentario = true;
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator2;    
    this.paginator2.length = await this.tablaTicket.length;  
    this.cargando = true; 
    }
  
  
  async pageEvents(event: any) {  
      if(event.previousPageIndex > event.pageIndex) {
      this.inicio = (this.inicio-(this.inicio%5)) -   10;
      if(this.inicio < 0){
        this.inicio = 0;
      }
      this.fin =  (this.fin - (this.fin%5)) - 5;
      await this.cargarInicio();
    } else {
      this.inicio = this.fin;
      this.fin = this.fin + 5;
      await this.cargarInicio();
    }
  }
 
  async eliminar(){
    let dialogRef =  this.dialog.open(DeleteComponent,
      {data: {idCliente : this.id, opc: 5, salir : true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      this.$sub.add(dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA =  this.metodos.arrayRemove(this.ELEMENT_DATA, this.metodos.buscandoIndice(this.id,this.ELEMENT_DATA,"id"),"id")
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort;
        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }
      }catch(Exception){}
      }));
  }
  
  editar(){
    let dialogRef  = this.dialog.open(NewTicketComponent,
      {data: {opc : true , salir : true},
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({num: ++this.mayorNumero, departamento:result.departamento, asunto:result.asunto,
        servicio:result.servicio,  fechaCerrada:result.fechaCerrada, fechaAbierta:result.fechaAbierta,  
        estado:this.metodos.estatus(result.estado), agente:result.agente});

        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
       }
      }catch(Exception){}
     }))

  }

  insertar(){
    let dialogRef  = this.dialog.open(NewTicketComponent,
      {data: {opc : false , salir : true},
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({num: ++this.mayorNumero, departamento:result.departamento, asunto:result.asunto,
        servicio:result.servicio,  fechaCerrada:result.fechaCerrada, fechaAbierta:result.fechaAbierta,  
        estado:this.metodos.estatus(result.estado), agente:result.agente});
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
       }
      }catch(Exception){}
     }))
  }

  

  async mensaje(mensaje : string){
     console.log(mensaje);
    
  }

}
