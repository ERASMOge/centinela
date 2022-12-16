import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { stringify } from 'querystring';
import { lastValueFrom, Subscription } from 'rxjs';
import { DeviceService } from 'src/app/core/services/device.service';
import { IpService } from 'src/app/core/services/ip.service';
import { RepeaterService } from 'src/app/core/services/repeater.service';
import { UsuarioService } from 'src/app/core/services/user.service';
import { DeviceModel } from 'src/app/models/device.model';
import { RadioModel } from 'src/app/models/radio.model';
import { responseService } from 'src/app/models/responseService.model';

@Component({
  selector: 'app-new-radio',
  templateUrl: './new-radio.component.html',
  styleUrls: ['./new-radio.component.css']
})
export class NewRadioComponent implements OnInit {
  hide=true;
  cveRepetidor : number =0
  segmentos : any []= [] ;
  usuarios : any [] = [];
  repetidoras : any [] =[];
  idAuto : number =0;
  ips : any [] = [];
  tipo : number =0
  newModel = new DeviceModel()
    sepId : Array<string> = this.ruta.url.split("/")[4].split("-")
  identificador :string = this.sepId[0]+"-"+this.sepId[1]+"-"+this.sepId[3];
  contadorIdenti :string = this.sepId[2];
  $sub = new Subscription()
  radioForm : FormGroup  = this.fb.group({
    device: [this.data.model.device ? this.data.model.device : '', Validators.required],
    idEstatus: [this.data.model.idEstatus !=0 ? this.data.model.idEstatus : '' , Validators.required],
    idTipo: [this.data.model.idTipo !=0 ? this.data.model.idTipo : '', Validators.required],
    comentario: [this.data.model.comentario ? this.data.model.comentario : '', Validators.required],
    idRepetidora: [this.data.model.idRepetidora !=0 ? this.data.model.idRepetidora : '', Validators.required],
    modelo: [this.data.model.modelo  ? this.data.model.modelo : '', Validators.required],
    idSegmento: [this.data.model.idSegmento != 0 ? this.data.model.idSegmento : '', Validators.required],
    idIp: [this.data.model.idIp != 0? this.data.model.idIp : '', Validators.required],
    idUsuario: [this.data.model.idUsuario !=0 ? this.data.model.idUsuario : '', Validators.required],
    contrasena: [this.data.model.contrasena ? this.data.model.contrasena : '', Validators.required],
    snmp: [this.data.model.snmp ? this.data.model.snmp : '', Validators.required]
  });

  repetidoraValue:number = 0;
  segmentoValue : number = 0;
  ipValue: number =0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private servicioRepetidora : RepeaterService,private ipService : IpService,
  private segmentoService : RepeaterService, private userService : UsuarioService,private fb:FormBuilder, public dialogRef: MatDialogRef<NewRadioComponent>
  ,private deviceService : DeviceService, private ruta : Router,private renderer : Renderer2) { }

  ngOnInit(): void {   
    this.inicio();
    this.idMax();
   this.ips = []
     
     

  }

  async idMax(){
    this.deviceService.idMaxRadio().subscribe((resp:responseService)=>{
      this.idAuto=  resp.container[0].max;
    })
  }
  
  //cargando insertar o editar async
  async inicio() {
    
   await this.todosUsuarios();

    if(this.data.opc == true){ 
    await this.todasRepetidoras(this.data.model.idTipo)
      this.$sub.add(this.segmentoService.buscarSegmentoRepetidorTipo(this.data.model.idRepetidora,this.data.model.idTipo).subscribe((resp:responseService)=>{
        this.segmentos = resp.container;                
    }));
      let arraySegmento :string[] = this.data.model.segmento.split("-")
      this.$sub.add(this.ipService.selectIp(arraySegmento[0], arraySegmento[1],1).subscribe((resp:responseService)=>{
        this.ips = resp.container
      }))

    }else{
      this.radioForm = this.fb.group({
        device: ['', Validators.required],
        idEstatus: ['' , Validators.required],
        idTipo: ['', Validators.required],
        idRepetidora: ['', Validators.required],
        modelo: ['', Validators.required],
        idSegmento: ['', Validators.required],
        idIp:  ['', Validators.required],
        idUsuario: ['', Validators.required],
        contrasena: ['', Validators.required],
        snmp:  ['', Validators.required],
        comentario : ['', Validators.required]
      });

    }
  }

//Metodos en el DOM
  tabChangeSegmento(){   
    if(this.data.opc == false){ 
      this.radioForm.controls["idIp"].setValue(0)
    }
    let segmento : string= document.getElementById("segmento")?.innerText+""; 
    let arraySegmento :string[] =segmento.split("-")
    this.$sub.add (this.ipService.selectIp(arraySegmento[0], arraySegmento[1],1).subscribe((resp:responseService)=>{
      this.ips = resp.container
    }))
  }

  tabChangeRepetidora(rep : number,tipo : number){          
    if(this.data.opc == false){ 
      this.radioForm.controls["idSegmento"].setValue(0)    
      this.radioForm.controls["idIp"].setValue(0)
    }
    this.$sub.add (this.segmentoService.buscarSegmentoRepetidorTipo(rep,tipo).subscribe((resp:responseService)=>{
        this.segmentos = resp.container;
        this.ips = []        
    }));
  }

  //enviar y editar  form
  async enviar(){
   this.data.salir = false
   this.newModel = this.radioForm.value
   this.newModel.estatus =  document.getElementById("estatus")?.innerText+"";
   this.newModel.ip =  document.getElementById("ip")?.innerText+""
   this.newModel.repetidora = document.getElementById("repetidora")?.innerText+""
   this.newModel.segmento = document.getElementById("segmento")?.innerText+""
   this.newModel.tipo =  document.getElementById("tipo")?.innerText+""
   this.newModel.usuario = document.getElementById("usuario")?.innerText+""
   this.newModel.contador = Number(this.contadorIdenti)
   this.newModel.identificador = this.identificador
    
  //console.log(" radioForm = "+this.radioForm.valid+"\n\n\nidEstatus "+this.radioForm.value.idEstatus+"\nidTipo "+ this.radioForm.value.idTipo+"\nidRepetidora "+ this.radioForm.value.idRepetidora+"\nidsegmento"+ this.radioForm.value.idSegmento+"\nidusuario"+ this.radioForm.value.idUsuario+"\nidIp"+ this.radioForm.value.idIp);
   
    if(this.radioForm.valid === false || Number(this.radioForm.value.idEstatus == 0) || Number(this.radioForm.value.idTipo == 0)
      || Number(this.radioForm.value.idRepetidora == 0) || Number(this.radioForm.value.idSegmento) == 0
      || Number(this.radioForm.value.idUsuario) == 0){
      alert("Por favor llene todos los campos")
    }else{
      if(this.data.opc === false && Number(this.radioForm.value.idIp) != 0 ){
        this.newModel.idDevice =  this.idAuto;
        await lastValueFrom(this.deviceService.insertarRadio(this.newModel))
        this.dialogRef.close(this.newModel)     
      }else{           
        if(Number(this.radioForm.value.idIp) >= 0 && this.data.opc === true){ 
          this.newModel.idIp = this.radioForm.value.idIp
          this.newModel.idDevice = this.data.model.idDevice;        
          
          await lastValueFrom(this.deviceService.actualizarRadio(this.newModel))
          this.dialogRef.close(this.newModel) 
        }else{          
          alert("Por favor llene todos los campos")
        }
      }
    }
  }

  //Peticiones
  async todasRepetidoras(tipo:number) {
    if(this.data.opc == false){
      this.radioForm.controls["idRepetidora"].setValue(0)    
      this.radioForm.controls["idSegmento"].setValue(0)    
      this.radioForm.controls["idIp"].setValue(0)
    }
    this.$sub.add(this.servicioRepetidora.llamarRepitdoresTipo(tipo).subscribe((resp:responseService)=>{
      this.repetidoras = resp.container
      this.tipo = tipo
    }));
  }

  async todosUsuarios(){
    this.$sub.add(this.userService.todosUsuarios().subscribe((resp:responseService)=>{
      this.usuarios = resp.container      
    }))
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }
}
