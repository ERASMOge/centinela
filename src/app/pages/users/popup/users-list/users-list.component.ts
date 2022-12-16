import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';
import { data } from 'jquery';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  cargando : boolean = false;
  mayorNumero : number =0;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  metodos=new RepeteadMethods ()


  ELEMENT_DATA : any =[]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns = ['usuario','nombre','opciones'];
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,   private notificationService: NotificationService
    ,   private dialog : NgDialogAnimationService, private userservice : UsersmoduleService) { }


  ngOnInit(): void {
    this.llenartabla()
  }
  async llenartabla(){
  this.cargando = false;
  this.ELEMENT_DATA = [];
  this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  await this.userservice.llamarListaAgentes(this.data.idGrupo).toPromise().then( (result : any) =>{
    

    for (let i=0; i<result.container.length; i++){
    this.ELEMENT_DATA.push(
      {usuario: result.container[i]["usuario"],nombre: result.container[i]["nombre"]
    });
  }
  
    this.dataSource =  new MatTableDataSource(this.ELEMENT_DATA);
    
    this.dataSource.paginator =  this.paginator2;
    this.cargando = true;
    
});
}


numeroMayor(numero : number){
  if (this.mayorNumero <numero){
    this.mayorNumero = numero
  }

}


}

