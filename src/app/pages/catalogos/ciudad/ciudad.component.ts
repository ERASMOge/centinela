import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'angular-notifier';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { CityService } from 'src/app/core/services/city.service';
import { CiudadModel } from 'src/app/models/ciudad.model';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteComponent } from '../forms/delete/delete.component';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class CiudadComponent implements OnInit {

  ciudadModel : CiudadModel = new CiudadModel();
  inputNombre = new FormControl()  
  inputAbreviado = new FormControl()  
  private readonly notifier: NotifierService;

  cargando :boolean= false;
  todasCiudades : any;
  mayorNumero : number = 0
  ELEMENT_DATA: any = [ ];
  @ViewChild ("paginator") paginator:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['idCiudad','nombre', 'abreviado', 'eliminado'];
  metodo = new RepeteadMethods()

  constructor(private ciudadService : CityService, notifierService: NotifierService, private dialog:NgDialogAnimationService) { this.notifier = notifierService }

  ngOnInit(): void {
    this.llenarTablaCiudad()
  }

  async llenarTablaCiudad(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    await this.ciudadService.llamarCiudades().subscribe((resp:any) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[resp.container.length-1].idCiudad;
      
      this.todasCiudades =  resp.container;
      for (const iterator of this.todasCiudades) {
        this.ELEMENT_DATA.push(
          {id:iterator.idCiudad,
          nombre:iterator.nombre,
          abreviado:iterator.abreviado}
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

  guardarCiudad(){
    if (this.inputNombre.value != null){
      if (this.inputAbreviado.value != null){
        this.ciudadModel.nombre = this.inputNombre.value;
        this.ciudadModel.abreviado = this.inputAbreviado.value;
        this.ciudadService.insertarCiudad(this.ciudadModel).subscribe(dato => {
        console.log(dato);        
        this.inputNombre.reset()
        this.inputAbreviado.reset()
        this.llenarTablaCiudad();      
        this.notifier.notify('success', 'Ciudad registrado con éxito!');
      },error => console.log(error));
      }else{
        this.notifier.notify('error','Escribe el abreviado');
      }      
    }else{
      this.notifier.notify('error','Escribe el nombre de una ciudad');
    }
  }

  async eliminarCiudad(id:number, nombre:string){
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idCiudad : id, opc: 2, nombre : nombre},
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
          this.notifier.notify('warning', 'Ciudad '+nombre+' se ha eliminado con éxito!');
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
