import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from './../../MyCustomPaginatorIntl';
import { NewClientComponent } from '../popup/new-client/new-client.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { CustomerService } from './../../../core/services/customer.service';
import { DeleteComponent } from '../popup/delete/delete.component';
import { NotificationService } from './../../../core/services/notification.service';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Workbook } from 'exceljs'; 
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
})

export class CustomerListComponent implements OnInit {
  title = 'centinela';
  subnetting = require("subnet-cidr-calculator")
  userList = []
  displayedColumns: string[] = ['Empresa', 'Nombre Corto', 'Estatus', 'Opciones'];
  ELEMENT_DATA: any = [];
  excel : string [][] = [];
  totalItems: number = 0;
  page: number = 0; 
  showPagination: boolean = true;
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  todosClientes : any;
  autoSelect :number =0;
  mayorNumero : number =0;
  sub$ :Subscription | undefined;
  cargando : boolean = false;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  constructor(
    private titleService: Title,
    private config: NgbPaginationConfig,
    private dialog : NgDialogAnimationService,
    private clienteServicio : CustomerService,
    private notificationService: NotificationService,
    ) {
      this.config.boundaryLinks = true;
    }
  
  ngOnInit() : void {
    this.titleService.setTitle('centinela - Customers');
    this.llenarTabla(); 
    
  }

  /**Funcion principal */
  async llenarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.todosClientes =  await this.clienteServicio.clientesTodos().toPromise();
      for (let i=0; i<this.todosClientes.container.length; i++){
      this.ELEMENT_DATA.push(
        {id: this.todosClientes.container[i]["idCliente"],empresa: this.todosClientes.container[i]["nombre"],nombre:this.todosClientes.container[i]["nombreCorto"]
          ,estatus:this.estatus(this.todosClientes.container[i]["estatus"])}
      );
      this.numeroMayor(this.todosClientes.container[i]["idCliente"]);
    }
      this.dataSource = await new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator = await this.paginator2;    
      this.dataSource.sort = await this.sort;
      this.cargando = true;
  }

  numeroMayor(numero : number){
    if (this.mayorNumero <numero){
      this.mayorNumero = numero
    }
  }
  /**Las siguientes dos funciones, exportExcel y onfilechange, son para importar y exportar */
  async exportexcel() 
  {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Employee Data");
    let header : string[]=["Id","Empresa","Nombre corto","Estatus"]
    worksheet.addRow(header);
  
    for  (let x1 in this.ELEMENT_DATA)
    {
      let x2=Object.keys(x1);
      let temp : any=[]

        temp.push(this.ELEMENT_DATA[x1]["id" ])
        temp.push(this.ELEMENT_DATA[x1]["empresa"])
        temp.push(this.ELEMENT_DATA[x1]["nombre"])
        temp.push(this.ELEMENT_DATA[x1]["estatus"])
      
      worksheet.addRow(temp)
    }

    let fname="ExcelClientes"

    workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');  

    });
  }

  async onFileChange(evt: any){
    this.cargando = false;
  
    const target : DataTransfer = <DataTransfer>(evt.target);
     let formato= ""+target.files[0].name.split(".")[target.files[0].name.split(".").length-1];
    if(formato == "xlsm" ||formato == "xlsx" || formato == "xlsb" ||formato == "xlts" ||formato == "xltm" ||formato == "xls" ||formato == "xlam" ||formato == "xla"||formato == "xlw" ){
      if(target.files.length !==1) 
      throw  alert('No puedes subir multiples archivos') ;
      const reader: FileReader= new FileReader();
      reader.onload = async (e: any) =>{
      const bstr : string = e.target.result;
      const wb : XLSX.WorkBook = XLSX.read(bstr, {type:'binary'});
      const wsname : string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.excel = (XLSX.utils.sheet_to_json(ws,{header: 1}));

      try{
        for (let p=0; p<this.excel.length; p++) {
         let repetidocliente:any = await this.clienteServicio.clienteRepetido(this.excel[p][0]).toPromise();
         repetidocliente = repetidocliente.container;
           try{
             if(this.excel[p][0] !== undefined  && repetidocliente[0].repetido == 0 || this.excel[p][0] == "" && repetidocliente[0].repetido == 0){    
               await this.clienteServicio.insertaCliente({ empresa:this.excel[p][0], nombre: this.excel[p][1],estatus:+this.excel[p][2]}).subscribe();
             }
            }catch(Exception){}
         }
         await this.llenarTabla(); 
      }catch(Exception){
        alert("Error: Verifique su tabla")
      }

      };
      await reader.readAsBinaryString(target.files[0]);
    }else{
      alert("Solo se permiten tipos de archivos Excel")
    }
  }

  /**Filtro GENERAL */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

/**Filtro para el estatus */
  async verEstatus(opcion: number) {
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

    if(opcion < 4){
    await this.clienteServicio.clienteEstatus(opcion).subscribe((resp : any) =>{
      for(let i of resp.container)
      this.ELEMENT_DATA.push({id:i.idCliente,empresa: i.nombre,nombre:i.nombreCorto,estatus:this.estatus(i.estatus)});
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator2;    
      this.paginator2.firstPage()
    })
  }else{
     await this.clienteServicio.clientesTodos().subscribe((resp : any)=>{
      for(let i of resp.container)
      this.ELEMENT_DATA.push(
        {id:i.idCliente,empresa: i.nombre,nombre:i.nombreCorto,estatus:this.estatus(i.estatus)}
      );
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator2;    
      this.paginator2.firstPage()

    });
  }
  this.cargando = true;
  }
  
  /**Crear cliente, editar y eliminar */
   nuevoCliente(){
    let dialogRef  = this.dialog.open(NewClientComponent,
      {data: {opc : false },
      animation: { to: "bottom" },
      height:"auto", width:"350px",
     });

     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       try{
      if(result.mensaje.length > 0  ){
        this.ELEMENT_DATA.unshift({id: ++this.mayorNumero,empresa: result.empresa,nombre:result.nombre,estatus:this.estatus(result.estatus)});
        this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
        this.dataSource.paginator = this.paginator2;    
        this.dataSource.sort = this.sort;

        setTimeout(()=>{
        this.notificationService.openSnackBar("Se agrego con exito");
        })
       }
      }catch(Exception){}
     })
  }
  
  async editar(empresa : string, nombre : string,estatus:string,id:number){

    let dialogRef  = await this.dialog.open(NewClientComponent,
      {data: {empresa : empresa, nombre : nombre ,estatus:this.estatusNumero(estatus) ,id:id , opc:true},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await dialogRef.afterClosed().subscribe((result:any) => {
        try{
        if(result.mensaje.length > 0  ){
          this.ELEMENT_DATA.splice(this.buscandoIndice(id)
            ,1,{empresa : result.empresa, nombre : result.nombre ,estatus:this.estatus(result.estatus) ,id:id })
          this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA)
          this.dataSource.paginator = this.paginator2;  
          this.dataSource.sort = this.sort;

          setTimeout(()=>{          
          this.notificationService.openSnackBar("Se actualizo con exito");  
          })
        }
        }catch(Exception){}
      }); 
  }

  /**para el loading */
  hayClientes() : boolean{
    if(this.ELEMENT_DATA != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
    }
  }
  /**Ayudante de loading p */
  hayClientes2() : string{
    if(this.cargando !=false){
      return "table-row";
    }else{
      return "none";
    }
  }
  async eliminar(id:number) {
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCliente : id, opc: 0},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA =  this.arrayRemove(this.ELEMENT_DATA, this.buscandoIndice(id))

          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator2;
          this.dataSource.sort = this.sort;

        setTimeout(()=>{
          this.notificationService.openSnackBar("Se elimino con exito");
        })
      }
      }catch(Exception){}
      });
  }

  
  /**Funciones extras, para buscar indice del array y para los estatus */
  buscandoIndice(id:number) : number{
    let i = 0
    while (true) {
      const element = this.ELEMENT_DATA[i]["id"];
      if(element===id){
       return i
      }
      i++;
    }
  }

  estatus(numero : number) :string {
    if(numero == 1){
      return "activo"
    }else if(numero==2){
      return "inactivo"
    }else{
      return "ausente"

    }

  }
  estatusNumero(numero : string) : string {
    switch(numero){
      case 'activo':
        return '1'
      case 'inactivo':
        return '2'
      case 'ausente': 
        return '3'
      default:
        return ""
    }
  }

   arrayRemove(arr : any, index : number) : [] { 
    for( var i = 0; i < arr.length; i++){ 
    
      if ( arr[i]["id"] === arr[index]["id"]) { 
  
          arr.splice(i, 1); 
      }
  
    }
    return arr;
  }

}
