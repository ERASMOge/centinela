import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeviceModel } from 'src/app/models/device.model';
import { DataService } from 'src/app/core/services/data.service';
import { NewRadioComponent } from '../popup/new-radio/new-radio.component';
import { DeviceService } from 'src/app/core/services/device.service';
import { responseService } from 'src/app/models/responseService.model';
import { DeleteComponent } from '../popup/delete/delete.component';

@Component({
  selector: 'app-table-radio',
  templateUrl: './table-radio.component.html',
  styleUrls: ['./table-radio.component.css']
})
export class TableRadioComponent implements OnInit {

  ELEMENT_DATA : any = [ ] 
  cargando : boolean = false;
  radios :any;
  $sub = new Subscription()
  @ViewChild ("paginator") paginator2:any;
  @Input () tamanoTabla : number = 0
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort;
  sepId : Array<string> = this.ruta.url.split("/")[4].split("-")
  identificador :string = this.sepId[0]+"-"+this.sepId[1]+"-"+this.sepId[3];
  contadorIdenti :string = this.sepId[2];
  metodo  = new RepeteadMethods();
  modelRadio = new DeviceModel();
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['IdDevice', 'Nombre', 'Tipo', "Modelo","Ip","Estatus",'opciones'];
  constructor(private dialog:NgDialogAnimationService,
    private notificationService: NotificationService, private DataService : DataService,
    private deviceService : DeviceService, private ruta : Router
    ) { }

  ngOnInit(): void {
   this.llenarTabla()    
   this.$sub.add(this.DataService.open.subscribe(res => {
    if(res =="equipoAgregar"){
      this.insertar()
    }else{
    }
    })) 
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  async descargar(){  }

  async llenarTabla(){
    this.cargando = false;             
    this.$sub.add (this.deviceService.todosRadios(this.identificador, Number(this.contadorIdenti)).subscribe((resp:responseService)=>{
      if(resp.container.length !=0){
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({ 
          idDevice : resp.container[i].idRadio,
          device : resp.container[i].radio,
          idEstatus : resp.container[i].estatus,
          estatus : this.metodo.estatus(resp.container[i].estatus),
          tipo : this.metodo.tipo(resp.container[i].tipo),
          idTipo : resp.container[i].tipo,
          idRepetidora : resp.container[i].idRepetidora,
          repetidora : resp.container[i].repetidora,
          modelo :resp.container[i].modelo,
          idSegmento : resp.container[i].idSegmento,
          segmento : resp.container[i].segmento,
          idIp : resp.container[i].idIp,
          ip : resp.container[i].ip,
          idUsuario : resp.container[i].idUsuario,
          usuario : resp.container[i].usuario,
          contrasena : resp.container[i].contrasena, 
          comentario : resp.container[i].comentario, 
          snmp : resp.container[i].snmp
        })
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator2;    
      this.dataSource.sort =  this.sort;
    }

    }));
    this.cargando = true;

  }

  async eliminar(id : number){
    let dialogRef = this.dialog.open(DeleteComponent,
      {data: {idCliente : id, opc: 7, salir : true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      this.$sub.add(dialogRef.afterClosed().subscribe((result : any) => {

        if(result != undefined){          
        try{
          this.ELEMENT_DATA =  this.metodo.arrayRemove(this.ELEMENT_DATA, this.metodo.buscandoIndice(id,this.ELEMENT_DATA,"idDevice"),"idDevice")
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort;

        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }catch(Exception){}finally{
        this.ELEMENT_DATA =  []  
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.llenarTabla()
      }
      }else{

      }
      }));
    
  }

  editar(modal : DeviceModel){
    this.modelRadio = modal;
    let dialogRef  = this.dialog.open(NewRadioComponent,
      {data: {opc : true, model : this.modelRadio, salir : true },
      animation: { to: "bottom" },
      height:"auto", width:"70%"
     });
     this.paginator2.firstPage();
     this.$sub.add (dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
      try{
      if(result !=undefined){
        
        this.ELEMENT_DATA.splice(this.metodo.buscandoIndice(result.idDevice,this.ELEMENT_DATA, "idDevice")
      ,1,result);
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator2;    
      this.dataSource.sort = this.sort;
      setTimeout(()=>{
        this.notificationService.openSnackBar("Se edito con exito");
     })
      }
    }catch(Exception){ }finally{
      this.ELEMENT_DATA =  []  
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.llenarTabla()
    }
     }))
  }
  
  insertar(){
    let dialogRef  = this.dialog.open(NewRadioComponent,
      {data: {opc : false , model : this.modelRadio, salir : true},
      animation: { to: "bottom" },
      height:"auto", width:"70%"
    });

     this.paginator2.firstPage();
     
     this.$sub.add(dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
      if(result !=undefined){
       try{
        this.ELEMENT_DATA.unshift(result);
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
        
      }catch(Exception){}finally{
        this.ELEMENT_DATA =  []  
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.llenarTabla()
      }
    }
     }))
  }
}
