import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { lastValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { UsersModel } from 'src/app/models/users.model';
import { RepeteadMethods } from 'src/app/pages/RepeteadMethods';
interface Grupo {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  usermodel=new UsersModel();
  cargando : boolean = false;
  mayorNumero : number =0;
  @ViewChild ("paginator") paginator2:any;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort;
  metodos=new RepeteadMethods ()
nombres:string=""
apellidoPaterno:string=""
apellidoMaterno:string=""
correo:string=""
contraseña:string=""
usuario:string=""
contrasena:string=""
estatus:number=0;
  ELEMENT_DATA : any =[]
  Grupos:Grupo[]=[]
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
 grupo:number=0;
  constructor(  @Inject(MAT_DIALOG_DATA) public data: any,   private notificationService: NotificationService
    ,   private dialog : NgDialogAnimationService, private userservice : UsersmoduleService,public dialogRef: MatDialogRef<EditUserComponent>) { }

  ngOnInit(): void {
    this.llamarCve();
this.llenarlista();
  }

  async llamarCve(){
    await this.userservice.llamarGroup("Group").toPromise().then( (result : any) =>{
      
    for(let i=0;i<result.container.length;i++){
      
    
    this.Grupos.push({value:result.container[i]["idGrupo"], viewValue:result.container[i]["nombre"] })
    }
    })
  }

  async llenarlista(){
    await this.userservice.llamarUserInfo(this.data.idUsuario).toPromise().then( (result : any) =>{
      
    this.nombres=result.container[0]["nombres"]

    this.usuario=result.container[0]["usuario"]
  
    this.correo=result.container[0]["correo"]
    this.apellidoMaterno=result.container[0]["apellidoMaterno"]
    this.apellidoPaterno=result.container[0]["apellidoPaterno"]
    this.estatus=result.container[0]["estatus"]
    this.grupo=result.container[0]["cveGroup"]
    
   


  });
  
  }

 async enviar(usuario:string,nombres:string,correo:string,apellidom:string,apellidop:string,estatus:number,cveGroup:number){
  this.usermodel.usuario=usuario
  this.usermodel.nombres=nombres
  this.usermodel.correo=correo
  this.usermodel.apellidoMaterno=apellidom
  this.usermodel.apellidoPaterno=apellidop
  this.usermodel.estatus=estatus
  this.usermodel.cveGroup=cveGroup
  this.usermodel.id=this.data.idUsuario
await lastValueFrom(this.userservice.updateUser(this.usermodel));

this.dialogRef.close('Se ha Actualizado con exito');
}



}
  