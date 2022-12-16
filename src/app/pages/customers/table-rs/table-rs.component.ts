import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RsService } from 'src/app/core/services/rs.service';
import { responseService } from 'src/app/models/responseService.model';
import { RsModel } from 'src/app/models/rs.model';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NewRsComponent } from '../popup/new-rs/new-rs.component';
import { Workbook } from 'exceljs'; 
import * as fs from 'file-saver';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-table-rs',
  templateUrl: './table-rs.component.html',
  styleUrls: ['./table-rs.component.css']
})
export class TableRsComponent implements OnInit {
  ELEMENT_DATA : any = [ ]
  cargando : boolean = false;
  $sub = new Subscription()
  @Input ()hijoRS :string = ""
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  id :number = Number(this.rutaActiva.url.split("/")[3]);
  mayorNumero : number = 0
  mayorNumeroAux : number = 0
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ["id",'rs', 'fechaAlta', 'estatus','opciones'];
  metodo = new RepeteadMethods();

  constructor(private dialog:NgDialogAnimationService,private serviceRs : RsService, private rutaActiva:Router,
    private notificationService: NotificationService,private DataService : DataService
    ) { 

    }
    
    filtrar(palabra: string) {
      this.dataSource.filter = palabra.trim().toLowerCase();
    } 
   

  ngOnInit(): void {      
   this.llenarTabla()
   this.$sub.add(this.DataService.open.subscribe(res => {
    if(res.palabraBuscar !=undefined){
      this.filtrar(res.palabraBuscar)
    }else{
      if(res.abrir ==true){
        this.insertar()
      }else{
        this.descargar()
      }
    }
    }))
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe()
  }
  async descargar(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    let header : string[]=["Id","Razon Social","Fecha alta","Estatus"]
    worksheet.addRow(header);
  
    for  (let x1 in this.ELEMENT_DATA)
    {
      let x2=Object.keys(x1);
      let temp : any=[]

        temp.push(this.ELEMENT_DATA[x1]["id" ])
        temp.push(this.ELEMENT_DATA[x1]["rs"])
        temp.push(this.ELEMENT_DATA[x1]["fechaAlta"])
        temp.push(this.ELEMENT_DATA[x1]["estatus"])
      
      worksheet.addRow(temp)
    }

    let fname="ExcelClientes"

    workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');  

    });
  }
  async llenarTabla(){
    this.cargando = false;             
    this.$sub.add(await this.serviceRs.llamarTodo(this.id).subscribe((resp:responseService) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[0].idRazonSocial;
      this.mayorNumeroAux = this.mayorNumero;      

      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({
          id: resp.container[i].idRazonSocial,
          rs:resp.container[i].razonSocial,
          fechaAlta:this.metodo.formatoFechaEspanolMysql(resp.container[i].fechaAlta),
          cveEstatus:resp.container[i].estatus,  
          estatus:this.metodo.estatus(resp.container[i].estatus),  
        })   
      }      
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }
    }))
    this.cargando = true;

  }

  eliminar(id : number){
    let dialogRef  = this.dialog.open(DeleteComponent,
      {data: {idCliente: id, opc : 3, salir : true },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.$sub.add(dialogRef.afterClosed().subscribe((result : any) => {
      if(result !=undefined){
      try{
      if(result.length > 0  ){
        this.ELEMENT_DATA =  this.metodo.arrayRemove(this.ELEMENT_DATA, this.metodo.buscandoIndice(id,this.ELEMENT_DATA,"id"),"id")
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator2;
        this.dataSource.sort = this.sort;
      setTimeout(()=>{
        this.notificationService.openSnackBar("Se elimino con exito");
      })
    }
    }catch(Exception){
      this.ELEMENT_DATA =  []  
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.llenarTabla()
    }
  }
    }));
  }

  editar(id:number,rs:string,fechaAlta:string,estatus:number){  
    let dialogRef  = this.dialog.open(NewRsComponent,
      {data: {opc : true,id : id ,rs:rs,fechaAlta:this.metodo.formatoFechaMysql(fechaAlta),cveEstatus:estatus , salir : true },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     this.$sub.add(dialogRef.afterClosed().subscribe((result:RsModel)=>{
      if(result !=undefined){
       try{
        this.ELEMENT_DATA.splice(this.metodo.buscandoIndice(result.cveCliente,this.ELEMENT_DATA,"id")
        ,1,{id:result.cveCliente,
          rs:result.rs,
          fechaAlta:this.metodo.formatoFechaEspanolMysql(result.fecha),
          cveEstatus :result.estatus,
          estatus:this.metodo.estatus(result.estatus)
        });
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;
        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
       
      }catch(Exception){}
    }
     }))
  }
  
  insertar(){
    
    let dialogRef  = this.dialog.open(NewRsComponent,
      {data: {opc : false, idCliente : this.id , salir : true},
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     
     this.$sub.add(dialogRef.afterClosed().subscribe((result:RsModel)=>{
      this.llenarTabla();
      setTimeout(()=>{
        this.notificationService.openSnackBar("Se inserto con exito");
      })
     }))

  }
}