import { Component, OnInit } from '@angular/core';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { NuevaimagenComponent } from '../nuevaimagen/nuevaimagen.component';
import {CroppedEvent} from 'ngx-photo-editor';
import { ConfigService } from 'src/app/core/services/config.service';
import { lastValueFrom } from 'rxjs';
import { ImageModel } from 'src/app/models/image.model';
import { LogoModel } from 'src/app/models/logo.model';
import { ResourceLoader } from '@angular/compiler';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-edit-logo',
  templateUrl: './edit-logo.component.html',
  styleUrls: ['./edit-logo.component.css']
})
export class EditLogoComponent implements OnInit {

  private readonly notifier: NotifierService;

  [x: string]: any;
  imageChangedEvent: any;
  base64: any;
  logomodel=new LogoModel()
  constructor(private dialog:NgDialogAnimationService,private configservice:ConfigService,notifierService: NotifierService) {
    this.notifier = notifierService;

   }

  ngOnInit(): void {
    this.configservice.llamarEmpresa().toPromise().then( (result : any) =>{
      this.base64=result.container[0]["logo"]    
       });  
  }
  
  fileChangeEvent(event: any) {
    
    this.imageChangedEvent = event;  
  }

  imageCropped(event: CroppedEvent) {
    
    this.base64 = event.base64;
    this.logomodel.logo=this.base64
    lastValueFrom(this.configservice.updateLogo(this.logomodel));    
  }

  rechargepage(){
    location.reload()
  }

  notifyLogo(){
    this.notifier.notify('success', 'Logo actualizado');

  }
  

  

  
}
