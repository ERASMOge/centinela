import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigurationComponent } from '../popup/configuration/configuration.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { IpService } from './../../../core/services/ip.service';
import { MyCustomPaginatorIntl } from './../../MyCustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SegmentsService } from './../../../core/services/segments.service';
import { lastValueFrom, Subscription } from 'rxjs';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs'; 
import { RepeteadMethods } from '../../RepeteadMethods';
import { responseService } from 'src/app/models/responseService.model';

@Component({
  selector: 'app-controlips',
  templateUrl: './controlips.component.html',
  styleUrls: ['./controlips.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class ControlipsComponent implements OnInit,OnDestroy {
  contenedor_carga = <HTMLDivElement> document.getElementById("contenedor_carga");
  ELEMENT_DATA: any = [ ];
  segmentos: any = [ ];
  segmentoFiltro1 : string = "";
  segmentoFiltro2 : string = "";
  $sub :  Subscription = new Subscription();
  ips :any =[ ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['ip', 'tipoip', 'utilizado', 'tipoequipo', 'ping'];
  inicio : number=0;
  fin : number=10;
  monitoreo : any
  ping : string =""
  comentario :boolean = true;
  cargando : boolean = false;
  repetheadMethods = new RepeteadMethods()

  @ViewChild ("paginator") paginator2:any;

  constructor(private dialog:NgDialogAnimationService, private ipService : IpService, private segmentoService : SegmentsService) { 

  }
  
  ngOnInit(): void {   
    this.procedmiento();
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  
  async procedmiento(){
  await this.ipServicios(); 
  
  await this.segmentosArray();
   // await this.cargarInicio();
  }

  async segmentosArray(){
    this.segmentos  = await lastValueFrom(this.segmentoService.llamarSegments())
    this.segmentos = this.segmentos.container;  
    
  }

 async ipServicios(){
 this.ipService.select().subscribe( async (res:any) =>{
    this.ips = res.container;
    this.comentario = true
    this.cargando = false;
    this.ELEMENT_DATA=[];
    
    this.dataSource = new MatTableDataSource();
    while (this.inicio < this.fin + 2 && this.inicio < this.ips.length) {
      if(this.inicio < this.fin){        
    
      this.monitoreoPing(this.ips[this.inicio].ip, this.inicio)
      this.ELEMENT_DATA[this.inicio] =  (    
        {
          ip: this.ips[this.inicio].ip,
          tipoip: this.repetheadMethods.tipo(this.ips[this.inicio].tipo),
          utilizado: this.ips[this.inicio].nombre,
          tipoequipo: this.ips[this.inicio].dispositivo,
          ping: this.ips[this.inicio].ping,
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
  this.paginator2.length = await this.ips.length;  
  this.cargando = true; 

  })
 }

  Configuracion(){
    let dialogRef  = this.dialog.open(ConfigurationComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });
  }

async pageEvents(event: any) {  
  this.$sub.unsubscribe();
  this.$sub = new Subscription();

    if(event.previousPageIndex > event.pageIndex) {
    this.inicio = (this.inicio-(this.inicio%10)) - 20;
    if(this.inicio < 0){
      this.inicio = 0;
    }
    this.fin =  (this.fin - (this.fin%10)) - 10;
    await this.cargarInicio();
  } else {
    this.inicio = this.fin;
    this.fin = this.fin + 10;
    await this.cargarInicio();
  }
}

async refrescar(){
  this.inicio = this.inicio-12  ;
  while (this.inicio < this.fin + 2 && this.inicio < this.ips.length) {
    if(this.inicio < this.fin){        
      
      this.monitoreoPing(this.ips[this.inicio].ip, this.inicio)
  
      this.ELEMENT_DATA[this.inicio] =  (    
        {
          ip: this.ips[this.inicio].ip,
          tipoip: this.repetheadMethods.tipo(this.ips[this.inicio].tipo),
          utilizado: this.ips[this.inicio].nombre,
          tipoequipo: this.ips[this.inicio].dispositivo,
          ping: this.ips[this.inicio].ping,
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
    this.paginator2.length = await this.ips.length;  
    this.cargando = true; 
}

async cargarInicio(){
  this.comentario = true
  this.cargando = false;
  this.ELEMENT_DATA=[];
  this.dataSource = new MatTableDataSource();
 while (this.inicio < this.fin + 2 && this.inicio < this.ips.length) {
  if(this.inicio < this.fin){        
    
    this.monitoreoPing(this.ips[this.inicio].ip, this.inicio)
    this.ELEMENT_DATA[this.inicio] =  (    
      {
        ip: this.ips[this.inicio].ip,
        tipoip: this.repetheadMethods.tipo(this.ips[this.inicio].tipo),
        utilizado: this.ips[this.inicio].nombre,
        tipoequipo: this.ips[this.inicio].dispositivo,
        ping: this.ips[this.inicio].ping,
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
  this.paginator2.length = await this.ips.length;  
  this.cargando = true; 
  }

  async filtrar(segmentos : string){
    this.segmentoFiltro1 = segmentos.split("-",2)[0]
    this.segmentoFiltro2 = segmentos.split("-",2)[1]
    this.paginator2.firstPage();  
    this.inicio =0;
    this.fin =10;
    this.$sub.unsubscribe();
    this.$sub = new Subscription();

    this.ips = await lastValueFrom(this.ipService.selectIp(this.segmentoFiltro1, this.segmentoFiltro2,2)) 
    this.ips = await this.ips.container
    await this.cargarInicio();
  }

   async monitoreoPing( ip : string, i : number){ 
    this.$sub.add(this.ipService.ping(ip).subscribe((resp:any) => {
      this.ping = resp.container.status
      try{
      this.ELEMENT_DATA[i].ping = this.ping;
      }catch(Exception){}
    })) 
  }
  async monitoreoPingSinIndex( ip : string) : Promise<string>{ 
    let ping :any = await this.ipService.ping(ip).toPromise()
    return ping = ping.container.status
  }
  async buscar(clave:string){
    this.$sub.unsubscribe();
    this.$sub = new Subscription();
    
    if(this.segmentoFiltro1.length >0 && this.segmentoFiltro2.length > 0){
      if(clave.length > 0){
       let ipsFake :any = await lastValueFrom(this.ipService.selectIpParam(this.segmentoFiltro1, this.segmentoFiltro2, clave)) 
        ipsFake = ipsFake.container;               
        this.mostrarSoloUnaFila(ipsFake);
        if(ipsFake.length > 0){
          this.comentario = true;
        }else{
          this.comentario=false;
        }
        ///
      }else{                
        this.inicio = 0;
        this.fin =10;
        this.paginator2.firstPage();
        await this.cargarInicio();
      }
    }else{
      if(clave.length > 0){
        let ipsFake : any = await lastValueFrom(this.ipService.selectIpTodosSolo( clave))
        ipsFake = ipsFake.container;
        console.log(ipsFake);
        console.log(clave);
        
        
        this.mostrarSoloUnaFila(ipsFake);
        if(ipsFake.length > 0){
          this.comentario = true;
        }else{
          this.comentario=false;
        }
        
      }else{
        this.inicio=0;
        this.fin = 10;
        await this.cargarInicio()
      }
    }
  }

  mostrarSoloUnaFila(ipsFake :any){
    if(ipsFake.length > 0){
    this.comentario = true  
    this.cargando = false;
    this.inicio =0;
    this.fin = 10;
    this.paginator2.firstPage();
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource();        
    this.monitoreoPing(ipsFake[0].ip, 0)

    this.ELEMENT_DATA.push (    
      {
        ip: ipsFake[0].ip,
        tipoip: this.repetheadMethods.tipo(ipsFake[0].tipo),
        utilizado: ipsFake[0].nombre,
        tipoequipo: ipsFake[0].dispositivo,
        ping: ipsFake[0].ping,
      });        
      console.log(this.ELEMENT_DATA);

      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator2;    
      this.paginator2.length = this.ips.length;  
      this.cargando = true;
      
    }else{
      this.ELEMENT_DATA =[]
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator2;
      this.comentario = false  
    
    }
  }

  async exportar(event : any){
    this.contenedor_carga.style.display = "block";
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    let header : string[]= ['ip', 'tipoip', 'utilizado', 'tipoequipo', 'ping'];
    worksheet.addRow(header);
    
    for  (let x1=0; x1<this.ips.length; x1++ )
    {
      
      let temp : any=[]
        temp.push(this.ips[x1].ip)
        temp.push(this.repetheadMethods.tipo(this.ips[x1].tipo))
        temp.push(this.ips[x1].nombre?this.ips[x1].nombre:"Ninguno")
        temp.push(this.ips[x1].dispositivo?this.ips[x1].dispositivo:"Ninguno")
        temp.push(await this.monitoreoPingSinIndex(this.ips[x1].ip)) 
        worksheet.addRow(temp)

    }

    let fname="ExcelClientes"

    workbook.xlsx.writeBuffer().then((data : any) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');  
    });
    this.contenedor_carga.style.display = "none";

  }
}
