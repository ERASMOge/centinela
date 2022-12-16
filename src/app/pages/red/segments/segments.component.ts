import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NewSegmentComponent } from '../popup/new-segment/new-segment.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { InfoComponent } from '../popup/info/info.component';
import { DeleteComponent } from '../popup/delete/delete.component';
import { MatSort } from '@angular/material/sort';
import { SegmentsService } from './../../../core/services/segments.service';
import { NotificationService } from './../../../core/services/notification.service';
import { RepeaterService } from './../../../core/services/repeater.service';
import { MyCustomPaginatorIntl } from './../../MyCustomPaginatorIntl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { rango_ip } from '../popup/new-segment/rango_ip';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],

})
export class SegmentsComponent implements OnInit {

  ELEMENT_DATA: any = [ ];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  subnet = require("subnet-cidr-calculator")
  repetearArray : any 
  segmentosArray :any
  id :number = this.rutaActiva.snapshot.params["id"];
  link : boolean  = true
  rango = new rango_ip()

  displayedColumns: string[] = ['id','nombre', 'segmento', 'diagonal', 'tipo', 'estatus','repetear','opciones'];
  cargando = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  mayorNumero : number = 0

  constructor(
    private dialog : NgDialogAnimationService,
    private segmentServicio : SegmentsService,
    private notificationService: NotificationService, 
    private repeaterService : RepeaterService,
    private rutaActiva: ActivatedRoute,
  ) { }

   ngOnInit(): void {
    this.procesoInicio()
  }


  regresar(){
    window.history.back();
  }

   async procesoInicio(){
    await this.repetears()
    await this.llenarTabla()
    if(this.id != undefined){  
      this.link = false    
      this.dataSource.filter = (this.id.toString()).trim().toLowerCase();
    }
   }

   async nuevoSegmento (){     
    let dialogRef = await this.dialog.open(NewSegmentComponent,
      {data: {id : this.mayorNumero, opc: false, repetears:this.repetearArray},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      this.paginator2.firstPage();
      await dialogRef.afterClosed().subscribe((result:any)=>{        
         try{
       if(result.mensaje.length > 0 ){      
         this.mayorNumero = result.id 
         this.ELEMENT_DATA.unshift({id:result.id,nombre:result.nombre,segmento:result.segmento
         ,diagonal:result.diagonal,tipo:this.tipo(result.tipo), estatus:this.estatus(result.estatus), repetear: this.metodoParaVerRepetidoras(result.cveRepetdora)});
         this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
         this.dataSource.paginator = this.paginator2; 
         this.dataSource.sort = this.sort;
         setTimeout(()=>{
         this.notificationService.openSnackBar("Se agrego con exito");
         })
        }
       }catch(Exception){  } finally{
        this.ELEMENT_DATA =  []  
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.llenarTabla()
      }
      })
  }

  metodoParaVerRepetidoras(idRepetidora : string){
    for (let i = 0; i < this.repetearArray.length; i++) {
      if(this.repetearArray[i].idRepetidora == idRepetidora){
        return this.repetearArray[i].nombreRepetidora;
      }          
    } 
  }

  async editarSegmento (id:number, nombre:string,segmento:string,diagonal:string,repetear:string,tipo: string,estatus:string){    
    let dialogRef  = await this.dialog.open(NewSegmentComponent,
      {data: {id : id, nombre : nombre ,segmento : segmento, diagonal : diagonal, cveRepetdora: repetear,tipo: this.tipoNumero(tipo), estatus:this.estatusNumero(estatus),opc:true, repetears:this.repetearArray},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      await dialogRef.afterClosed().subscribe((result:any) => {
        try{
        if(result.mensaje.length > 0  ){
          this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
          this.dataSource.paginator = this.paginator2;  
          this.dataSource.sort = this.sort;
          setTimeout(()=>{          
          this.notificationService.openSnackBar("Se actualizo con exito");  
          })
        }
        }catch(Exception){}finally{
          this.llenarTabla()
          this.ELEMENT_DATA = []
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        }
      }); 
  }
  async eliminarSegmento (id:number){    
    let cantidadIpActivas : number= 
    Number(await (await lastValueFrom(this.segmentServicio.countActiveSegmento(id))).container[0].cantidad)
    console.log(cantidadIpActivas);
    
    if(cantidadIpActivas == 0){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idSegmento : id, opc: 1},
      animation: { to: "bottom" },
      height:"auto", width:"300px",
      });
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){ 
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort;

        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }
      }catch(Exception){}finally{
        this.llenarTabla()
        this.ELEMENT_DATA = []
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      }
      });
    }else{
      alert("No es posible, este segmento tiene dispositivos asignados");
    }
  }
  
  

  info (){
    this.dialog.open(InfoComponent,
    {data: {idCliente : ""},
    animation: { to: "bottom" },
    height:"auto", width:"300px",
  });
  }

  async llenarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

    await this.segmentServicio.llamarSegments().toPromise().then( (result : any) =>{
      if(result.container.length !=0){
      this.segmentosArray = result;      
      this.mayorNumero = Number(result.container[0]["idSegmento"])+1;
      for (let i=0; i<result.container.length; i++){       
      this.ELEMENT_DATA.push(
        {id: result.container[i]["idSegmento"],nombre: result.container[i]["nombre"],segmento:result.container[i]["segmento"]
        ,diagonal:result.container[i]["diagonal"],tipo:this.tipo(result.container[i]["tipo"]), estatus:this.estatus(result.container[i]["estatus"]), repetear:result.container[i]["repetidora"]}
        );
    }
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
      }else{

      }
      this.cargando = true;
    });
  
    


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  /**Imprimiendo repetears */
  async repetears(){
    await this.repeaterService.llamarRepitdores().subscribe((resp:any) =>{
    this.repetearArray = resp.container;   
       
    })    
  }
  
  /**para el loading */
hayClientes(){
  if(this.ELEMENT_DATA != 0 || this.cargando ==false){
    return true;
  }else{
    return false;
  }
}
/**Ayudante de loading p */
hayClientes2(){
  if(this.cargando !=false){
    return "table-row";
  }else{
    return "none";
  }
}

buscarRuta(event : any){
  event.value = this.id==0? "" : this.id;
}
  
  estatus(numero : string) {
   if(numero == '1'){
    return "activo"
   }else{
    return "inactivo"
   }
  }

  tipo(tipo:string){
    if(tipo == '1'){
      return "publico"
     }else{
      return "privado"
     }
  }

  tipoNumero(tipo:string){
    if(tipo == 'publico'){
      return "1"
     }else{
      return "2"
     }
  }
  estatusNumero(numero : string) {

    if(numero =="activo"){
      return '1'
    } else{
      return '2'

    }
  }

 
}
