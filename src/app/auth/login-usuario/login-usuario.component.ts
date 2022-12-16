import { Component, OnInit } from '@angular/core';
import {  Renderer2,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfigService } from 'src/app/core/services/config.service';

/**LOGIN PARA USUARIOS */
@Component({
  selector: 'app-login-usuario',
  templateUrl: './login-usuario.component.html',
  styleUrls: ['./login-usuario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginUsuarioComponent implements OnInit {

 // email = new FormControl('', [Validators.required, Validators.required])
  logo:any;
  hide = true;
  hideError = true;
  formSesion : FormGroup =  this.fb.group({
    correo: ['', Validators.required],
    contrasena:  ['', Validators.required],
  });


  constructor(private configservice:ConfigService,private usuarioServicio : UsuarioService
   , private router:Router, private auth :AuthService, private fb :FormBuilder) { }

  ngOnInit(): void {
    this.configservice.llamarEmpresa().toPromise().then( (result : any) =>{
            
      this.logo=result.container[0]["logo"]
       })
       ;  
  }
  
  //Validacion de correo en input
  /*getErrorMessage() {
    if (this.email.hasError('required')) {
      //return 'Debe de ingresar correo ';
    }
    return this.email.hasError('email') ? 'Correo no valido' : '';
  }*/

  form(){
    if(this.formSesion.valid){
    this.usuarioServicio.login(btoa(this.formSesion.controls['correo'].value),btoa(this.formSesion.controls['contrasena'].value),0).subscribe((response:any) =>{
      if(response.status === "ok"){
        this.auth.crearSesion( response.container);
        this.hideError = false;
       location.reload(); 
      }else{
        alert(response.info)
        this.hideError = true;
      }
    });
  }else{
    alert("Por favor acomplete los campos")
  }
}
  
}
