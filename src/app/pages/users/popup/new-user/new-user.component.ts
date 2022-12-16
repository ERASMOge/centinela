import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { count } from 'console';
import { read } from 'fs';
import { max } from 'moment';
import { lastValueFrom } from 'rxjs';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';
import { UsersModel } from 'src/app/models/users.model';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

interface Grupo {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  count:string=""
  usermodel=new UsersModel()
  Grupos: Grupo[] = [];

  selectedasunto:number =0;
   archivo:string=""
  public files: any [] = [];
  constructor(private userservice : UsersmoduleService, public dialogRef: MatDialogRef<NewUserComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.llamarCve();
    }
  


 
      
    
  
    

    async llamarCve(){
    await this.userservice.llamarGroup("Group").toPromise().then( (result : any) =>{
      
      
    for(let i=0;i<result.container.length;i++){
      
    
    this.Grupos.push({value:result.container[i]["idGrupo"], viewValue:result.container[i]["nombre"] })
    }
    })
  }
  
  subir(usuario:string,nombre:string,apellidop:string,apellidom:string,correo:string,contraseña:string,estatus:number,grupo:number,Rcontrasena:string){
    if(nombre==undefined||usuario==undefined||estatus==undefined||apellidop==""||apellidom==""||correo==""||contraseña==""||grupo==undefined){
      alert("Por favor llene todos los campos");
    }else if(Rcontrasena!=contraseña){
      alert("Contraseñas no coinciden");

    }else  {
    this.usermodel.usuario=usuario
    this.usermodel.nombres=nombre
    this.usermodel.apellidoPaterno=apellidop
    this.usermodel.apellidoMaterno=apellidom
    this.usermodel.correo=correo
    this.usermodel.contrasena=contraseña
    this.usermodel.estatus=estatus
    this.usermodel.cveGroup=grupo

    lastValueFrom(this.userservice.insertarUser(this.usermodel)); 
    this.dialogRef.close('Se ha Ingresado con exito');
    }
   

  }
  }
