
import {Component, ViewChild, OnInit} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { planService } from 'src/app/core/services/plan.service';
import { RepeteadMethods } from '../../RepeteadMethods';
import { PlanModel } from 'src/app/models/plan.model';
import { FormControl } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { DeleteComponent } from '../forms/delete/delete.component';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class PlanComponent  implements OnInit{

  planModel : PlanModel = new PlanModel();
  inputNombre = new FormControl()  
  inputDesq = new FormControl()  
  private readonly notifier: NotifierService;

  cargando :boolean= false;
  todosPlan : any;
  mayorNumero : number = 0
  ELEMENT_DATA: any = [ ];
  @ViewChild ("paginator") paginator:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['idPlan','nombre', 'descripcion', 'eliminado'];
  metodo = new RepeteadMethods()
  
  constructor(private planService : planService, notifierService: NotifierService, private dialog:NgDialogAnimationService){this.notifier = notifierService}
  
  ngOnInit(): void {
    this.llenarTablaPlan();
  }
  
  async llenarTablaPlan(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    await this.planService.llamarTodo().subscribe((resp:any) =>{
      if(resp.container.length !=0){
      this.mayorNumero = resp.container[resp.container.length-1].idPlan;
      
      this.todosPlan =  resp.container;
      for (const iterator of this.todosPlan) {
        this.ELEMENT_DATA.push(
          {id:iterator.idPlan,
          nombre:iterator.nombre,
          descripcion:iterator.descripcion}
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

  guardarPlanes(){
    if (this.inputNombre.value != null){
      this.planModel.nombre = this.inputNombre.value;
      this.planModel.descripcion = this.inputDesq.value;
      this.planService.insertarPlan(this.planModel).subscribe(dato => {
        console.log(dato);        
        this.inputNombre.reset()
        this.inputDesq.reset()
        this.llenarTablaPlan();      
        this.notifier.notify('success', 'Plan registrado con éxito!');
      },error => console.log(error));
    }else{
      this.notifier.notify('error','Escribe un nombre de plan');
    }
  }

  /*eliminaPlanes(id:number, nombre:string){
    this.planService.eliminarPlan(id).subscribe(dato => {
      console.log(dato);
      this.llenarTablaPlan();      
      this.notifier.notify('warning', nombre+' se ha eliminado con éxito!');
    },error => console.log(error));
  }*/

  async eliminarEstePlan(id:number, nombre:string){    
    let dialogRef = await this.dialog.open(DeleteComponent,
      {data: {idPlan : id, opc: 1, nombre : nombre},
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
          this.notifier.notify('warning', nombre+' se ha eliminado con éxito!');
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
