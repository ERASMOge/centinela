import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { lastValueFrom } from 'rxjs';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { GroupModel } from 'src/app/models/group.model';
interface Rol{
viewValue: string
value:number
}

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {
  groupmodel=new GroupModel();
  cargando : boolean = false;
  mayorNumero : number =0;
nombre:string=""
correo:string=""
cveRol:number=0;
estatus:number=0;
  ELEMENT_DATA : any =[]
  Roles:Rol[]=[]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
 grupo:number=0;
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any, private dialog : NgDialogAnimationService, private userservice : UsersmoduleService,public dialogRef: MatDialogRef<EditGroupComponent>) { }

  ngOnInit(): void {
    this.llamarCve();
this.llenarlista();
  }

  async llamarCve(){
    await this.userservice.llamarRol("Rol").toPromise().then( (result : any) =>{
      
    for(let i=0;i<result.container.length;i++){
      
    
    this.Roles.push({value:result.container[i]["idRol"], viewValue:result.container[i]["nombre"] })
    }
    })
  }

  async llenarlista(){
    await this.userservice.llamarGroupInfo(this.data.idGrupo).toPromise().then( (result : any) =>{
      
    this.nombre=result.container[0]["nombre"]
    this.estatus=result.container[0]["estatus"]
    this.cveRol=result.container[0]["cveRol"]
    this.correo=result.container[0]["correo"]

  });
  
  }

 async enviar(nombre:string,cveRol:number,estatus:number,correo:string){
  this.groupmodel.cveRol=cveRol
  this.groupmodel.nombre=nombre
  this.groupmodel.estatus=estatus
  this.groupmodel.id=this.data.idGrupo
  this.groupmodel.correo=correo

await lastValueFrom(this.userservice.updateGroup(this.groupmodel));

this.dialogRef.close('Se ha Actualizado con exito');
}



}