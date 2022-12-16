import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DataService } from 'src/app/core/services/data.service';
import { NewEquipamentComponent } from '../popup/new-equipament/new-equipament.component';
import { DeviceModel } from 'src/app/models/device.model';
import { DeviceService } from 'src/app/core/services/device.service';
import { responseService } from 'src/app/models/responseService.model';
import { DeleteComponent } from '../popup/delete/delete.component';
import { IpService } from 'src/app/core/services/ip.service';

@Component({
  selector: 'app-table-equipment',
  templateUrl: './table-equipment.component.html',
  styleUrls: ['./table-equipment.component.css']
})
export class TableEquipamentComponent implements OnInit {

  ELEMENT_DATA : any = [ ]
  cargando : boolean = false;
  $sub = new Subscription()
  @ViewChild ("paginator") paginator2:any;
  @Input () tamanoTabla : number = 0
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort; 
  sepId : Array<string> = this.ruta.url.split("/")[4].split("-")
  identificador :string = this.sepId[0]+"-"+this.sepId[1]+"-"+this.sepId[3];
  contadorIdenti :string = this.sepId[2];
  modelOtro = new DeviceModel();

  IpSeleccionadas : Array<any[]>= []
  guardandoPrimerIndice : Array<any> = [] 
  primerIndice : number = 0

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['IdDevice', 'Nombre', "Modelo","Ip","Estatus",'opciones'];
  metodo = new RepeteadMethods();
  constructor(private dialog:NgDialogAnimationService,private ruta : Router,
    private notificationService: NotificationService,private DataService : DataService, private deviceService : DeviceService,
    private ipSelect: IpService
    ) {    }

  ngOnInit(): void {
   this.llenarTabla()
   this.$sub.add(this.DataService.open.subscribe(res => {
    if(res =="equipoAgregar"){
      this.insertar()
  
    }else{
      
    }
    }));  
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  async descargar(){
   
  }
  async llenarTabla(){
    this.cargando = false;       
    this.$sub.add(this.deviceService.todosOtros(this.identificador, Number(this.contadorIdenti),1).subscribe((resp:responseService)=>{           
      if(resp.container.length !=0){           
      for (let i = 0; i < resp.container.length; i++) {
        this.ELEMENT_DATA.push({ 
          idDevice : resp.container[i].idOtro,
          device : resp.container[i].otro,
          idEstatus : resp.container[i].estatus,
          estatus : this.metodo.estatus(resp.container[i].estatus),
          tipo : this.metodo.tipo(resp.container[i].tipo),
          idTipo : resp.container[i].tipo,
          idRepetidora : resp.container[i].idRepetidora,
          repetidora : resp.container[i].repetidora,
          modelo :resp.container[i].modelo,
          idSegmento : resp.container[i].idSegmento,
          segmento : resp.container[i].segmento,
        //  idIp : resp.container[i].ip1.split("-")[0],
       //   ip : resp.container[i].ip1.split("-")[1],
        //  idIp2 : resp.container[i].ip2.split("-")[0],
       //   ip2 : resp.container[i].ip2.split("-")[1],
          idUsuario : resp.container[i].idUsuario,
          usuario : resp.container[i].usuario,
          contrasena : resp.container[i].contrasena, 
          snmp : resp.container[i].snmp,
          comentario : resp.container[i].comentario
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
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCliente : id, opc: 8, salir : true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      this.$sub.add(dialogRef.afterClosed().subscribe((result : any) => {
        if(result !=undefined){
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
      }
      }));
  }
  editar(model : DeviceModel){
    this.modelOtro = model;
    let dialogRef  = this.dialog.open(NewEquipamentComponent,
      {data: {opc : true, model : this.modelOtro, salir: true,abrirForm:true },
      animation: { to: "bottom" },
      height:"auto", width:"70%"
     });

     this.paginator2.firstPage();   
     this.$sub.add(dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
      if(result !=undefined){
      try{      
      this.guardandoPrimerIndice.splice(this.guardandoPrimerIndice.indexOf(result.idDevice), 1);
      this.IpSeleccionadas.splice(this.guardandoPrimerIndice.indexOf(result.idDevice),1)
      this.ELEMENT_DATA.splice(this.metodo.buscandoIndice(result.idDevice,this.ELEMENT_DATA, "idDevice"),1,result);        
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
      this.dataSource.paginator = this.paginator2;    
      this.dataSource.sort = this.sort;
      setTimeout(()=>{
        this.notificationService.openSnackBar("Se edito con exito");
     })
    
    }catch(Exception){ }finally{
      this.ELEMENT_DATA =  []  
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.llenarTabla()
    }
    }
     }))
  }

  insertar(){
    let dialogRef  = this.dialog.open(NewEquipamentComponent,
      {data: {opc : false , model : this.modelOtro, salir : true,abrirForm:true},
      animation: { to: "bottom" },
      height:"auto", width:"70%"
    });

     this.paginator2.firstPage();
     
     this.$sub.add(dialogRef.afterClosed().subscribe((result:DeviceModel)=>{
      if(result !=undefined){

       try{
         result.contador = Number(this.contadorIdenti)
         result.identificador = this.identificador
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

  /**Este metodo se usa cuando le picas al boton select de  la tabla, te guarda el resultado de un select, en un espacio designado */
  async abrirIps(id:number){    
    
    if(this.guardandoPrimerIndice.indexOf(id) == -1){
    this.guardandoPrimerIndice.push(id)
    this.ipSelect.selectIpOneEquipament(id,this.identificador, 2, Number(this.contadorIdenti)).subscribe(async (resp:responseService)=>{
      this.IpSeleccionadas[this.guardandoPrimerIndice.indexOf(id)] = resp.container
      
    })
   }

  }
  /**Este te trae todas las ips de un dispositivo, se usara cuando le piques a editar */
  ipsEditar(id:number){
    this.ipSelect.selectIpOneEquipament(id,this.identificador, 2, Number(this.contadorIdenti)).subscribe((resp:responseService)=>{
      this.IpSeleccionadas[this.guardandoPrimerIndice.indexOf(id)] = resp.container
    })
  }
}
