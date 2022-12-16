import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { NewUserComponent } from './../popup/new-user/new-user.component';
import { EditUserComponent } from './../popup/edit-user/edit-user.component';
import { DeleteUserComponent } from './../popup/delete-user/delete-user.component';
import { MyCustomPaginatorIntl } from '../../MyCustomPaginatorIntl';
import { RepeteadMethods } from '../../RepeteadMethods';
import { DeleteGroupComponent } from '../popup/delete-group/delete-group.component';
import { EditGroupComponent } from '../popup/edit-group/edit-group.component';
import { NewGroupComponent } from '../popup/new-group/new-group.component';
import { UsersListComponent } from '../popup/users-list/users-list.component';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}]
})
export class GruposComponent implements OnInit {
  cargando : boolean = false;
  mayorNumero : number =0;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  metodos=new RepeteadMethods ()
id:string=""
usuario:string=""
grupo:string=""
rol:string=""
estatus:string=""

  ELEMENT_DATA : any =[]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns = ['nombre','agentes','correo','opciones'];
  constructor(     private notificationService: NotificationService
    ,   private dialog : NgDialogAnimationService, private userservice : UsersmoduleService) { }

  ngOnInit(): void {
    this.llenarTabla()
  }


  async irlista(id:number,nombregrupo:string){
    let dialogRef = await this.dialog.open(UsersListComponent,
      {data: {idGrupo: id ,nombregrupo:nombregrupo},
      animation: { to: "bottom" },
        height:"400px", width:"500px",
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
      }catch(Exception){}
      });
  }
  
    numeroMayor(numero : number){
      if (this.mayorNumero <numero){
        this.mayorNumero = numero
      }
  
  }

  async eliminar(id:number){
    let dialogRef = await this.dialog.open(DeleteGroupComponent,
      {data: {idGrupo: id},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await dialogRef.afterClosed().subscribe((result : any) => {
        try{
        if(result.length > 0  ){
          this.ELEMENT_DATA = this.metodos.arrayRemove(this.ELEMENT_DATA, this.metodos.buscandoIndice(id,this.ELEMENT_DATA,"id"),"id")
       
  
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
  

  async editar(id:number){
    let dialogRef = await this.dialog.open(EditGroupComponent,
      {data: {idGrupo: id},
      animation: { to: "bottom" },
        height:"auto", width:"300px",
      });
      
      await dialogRef.afterClosed().subscribe((result : any) => {
        this.llenarTabla();
       });
  }

  newGroup(){
    let dialogRef  = this.dialog.open(NewGroupComponent,
      {data: {opc : false, id: this.mayorNumero },
      animation: { to: "bottom" },
      height:"auto", width:"500px",
     });
    
     this.paginator2.firstPage();
     dialogRef.afterClosed().subscribe((result:any)=>{
       this.llenarTabla();
})

  }
  
  async llenarTabla(){
    this.cargando = false;
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  
    await this.userservice.llamarGroupList("GrupoList").toPromise().then( (result : any) =>{
      
  
      for (let i=0; i<result.container.length; i++){
        console.log(result.container);
        
      this.ELEMENT_DATA.push(
        {id: result.container[i]["idGrupo"],nombre: result.container[i]["nombre"],agentes: result.container[i]["agentes"],correo: result.container[i]["correo"]
      });
    this.numeroMayor(result.container[i]["idGrupo"]);
    }
    
      this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
      
      this.dataSource.paginator =  this.paginator2;
      this.cargando = true;
      
      
    });
      
  }
  
  hayGroups(){
    if(this.ELEMENT_DATA != 0 || this.cargando ==false){
      return true;
    }else{
      return false;
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  
  Estatus(numero:number) {
    switch(numero){
      case 1:
        return "Activo"
      case 2:
        return "Inactivo"
        case 3:
        return "Suspendido"
      
        
    }
  }
  
  }