import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'angular-notifier';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { AsuntoService } from 'src/app/core/services/asunto.service';
import { AsuntoModel } from 'src/app/models/asunto.model';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../forms/delete/delete.component';

@Component({
  selector: 'app-asunto',
  templateUrl: './asunto.component.html',
  styleUrls: ['./asunto.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class AsuntoComponent implements OnInit {

  asuntoModel : AsuntoModel = new AsuntoModel();
  inputNombre = new FormControl()  
  private readonly notifier: NotifierService;

  cargando :boolean= false;
  todoAsunto : any;
  mayorNumero : number = 0
  ELEMENT_DATA: any = [ ];
  @ViewChild ("paginator") paginator:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['idAsunto','nombre', 'eliminado'];
  metodo = new RepeteadMethods()

  constructor(private asuntoService : AsuntoService, notifierService: NotifierService, private dialog:NgDialogAnimationService) { this.notifier = notifierService }

  ngOnInit() : void {
    this.llenarTablaAsunto();
  }

  async llenarTablaAsunto(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    await this.asuntoService.llamarAsunto().subscribe((resp:any) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[resp.container.length-1].idAsunto;
      
      this.todoAsunto =  resp.container;
      for (const iterator of this.todoAsunto) {
        this.ELEMENT_DATA.push(
          {id:iterator.idAsunto,
          nombre:iterator.nombre}
        );   
      }
     
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator =  this.paginator;    
      this.dataSource.sort =  this.sort;
    }else{
      this.ELEMENT_DATA = []
    }
    this.cargando = true;
  
    });
  }

  guardarAsunto(){
    if (this.inputNombre.value != null){
        this.asuntoModel.nombre = this.inputNombre.value;
        this.asuntoService.insertarAsunto(this.asuntoModel).subscribe(dato => {
        console.log(dato);        
        this.inputNombre.reset()
        this.llenarTablaAsunto();      
        this.notifier.notify('success', 'Asunto registrado con éxito!');
      },error => console.log(error));     
    }else{
      this.notifier.notify('error','Escribe el nombre de un asunto');
    }
  }

  async eliminarAsunto(id:number, nombre:string){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idAsunto : id, opc: 3, nombre : nombre},
      animation: { to: "bottom" },
      height:"auto", width:"auto",
      });
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA =  this.arrayRemove(this.ELEMENT_DATA, this.buscandoIndice(id,this.ELEMENT_DATA)) 
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        setTimeout(()=>{
          this.notifier.notify('warning', 'Asunto '+nombre+' se ha eliminado con éxito!');
        })
      }
      }catch(Exception){}
      });
  }

  buscandoIndice(id:number, ELEMENT_DATA:any){
    let i = 0
    while (true) {
      const element = ELEMENT_DATA[i]["id"];
      if(element===id){
       return i
      }
      i++;
    }
  }

  arrayRemove(arr : any, index : any) { 
    for( var i = 0; i < arr.length; i++){ 
      if ( arr[i]["id"] === arr[index]["id"]) { 
          arr.splice(i, 1); 
      }
    }
    return arr;
  }

}
