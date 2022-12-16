import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { CroppedEvent } from 'ngx-photo-editor';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config.service';
import { ConfigModel } from 'src/app/models/config.model';
import { ImageModel } from 'src/app/models/image.model';
import { NuevaimagenComponent } from '../nuevaimagen/nuevaimagen.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  private readonly notifier: NotifierService;

  nombre :string =""
  direccion=""
  telefono=""
  rs=""
  rfc=""
  ciudad="";
  correo="";
  image : any;

  configmodel = new ConfigModel()
  imagemodel=new ImageModel()
  constructor(private configservice :ConfigService,notifierService: NotifierService) {
    this.notifier = notifierService;

   }

  ngOnInit(): void {

    this.configservice.llamarEmpresa().toPromise().then( (result : any) =>{
      this.image=result.container[0]["imagen"]
      this.nombre=result.container[0]["nombre"]
      this.ciudad=result.container[0]["ciudad"]
      this.correo=result.container[0]["correo"]
      this.rfc=result.container[0]["rfc"]
      this.rs=result.container[0]["rs"]
      this.telefono=result.container[0]["telefono"]
      this.direccion=result.container[0]["direccion"]
      
       });
    
  }


  
   async showPreview(event:any) {
    let file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result as string;
  
     this.imagemodel.imagen=this.image

      lastValueFrom(this.configservice.updateImage(this.imagemodel));  
    
      
    }
    reader.readAsDataURL(file)
    this.notifyimg();
   }
   

   updateEmpresa(nombre:string,direccion:string,telefono:string,rfc:string,rs:string,ciudad:string,correo:string){
    this.configmodel.nombre = nombre
    this.configmodel.direccion=direccion
    this.configmodel.telefono=telefono
    this.configmodel.rfc=rfc
    this.configmodel.rs=rs
    this.configmodel.ciudad=ciudad
    this.configmodel.correo=correo
    this.configmodel.correo=correo
   
    

  lastValueFrom(this.configservice.updateEmpresa(this.configmodel));  
   }
   notify(){
    this.notifier.notify('success','Informacion actualizada');
   
  }
  notifyimg(){
    this.notifier.notify('success', 'Imagen actualizada');

  }
  
  

   

  
  
}