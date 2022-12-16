import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { AsuntoService } from 'src/app/core/services/asunto.service';
import { ManualService } from 'src/app/core/services/manual.service';
import { ManualModel } from 'src/app/models/manual.model';
interface asunto {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-new-manual',
  templateUrl: './new-manual.component.html',
  styleUrls: ['./new-manual.component.css']
})
export class NewManualComponent implements OnInit {
  count:string=""
  manualmodel=new ManualModel()
  asuntos: asunto[] = [];
  selectedasunto:number =0;
   archivo:string=""
  public files: any [] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private asuntoservice:AsuntoService,private manualservice :ManualService
  ,private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<NewManualComponent>) {
  }

  public lector: any [] = [];  
  public arr: File [] = []; 
  ids : number [] =[]

  ngOnInit(): void {
  this.llamarasunto();
  }

  async llamarasunto(){
  await this.asuntoservice.llamarAsunto().toPromise().then( (result : any) =>{
  for(let i=0;i<result.container.length;i++){
  this.selectedasunto=result.container[0]["idAsunto"]
  this.asuntos.push({value:result.container[i]["idAsunto"], viewValue:result.container[i]["nombre"] })
  }
  })
}

subir(cveAsunto:number){
  let date=  (new Date()).toLocaleDateString('en-US');
  var fecha=date.split("/",3)
  for(let i=0;i<this.files.length;i++){
  this.manualmodel.archivo=this.lector[i]
  this.manualmodel.nombre=this.files[i]["name"]
  let type=this.files[i]["name"]
  if(type.indexOf(".png")>=0 || type.indexOf(".PNG")>=0 || type.indexOf(".gif")>=0 || type.indexOf(".jpg")>=0){
    this.manualmodel.tipo=1
  }else if(type.indexOf(".pdf")>=0) {
    this.manualmodel.tipo=2
  }else{
    this.manualmodel.tipo=3
  }

  this.manualmodel.fecha=fecha[2]+"-"+fecha[0]+"-"+fecha[1]
  if(this.files[i]["size"]>9999999){
    let tamaño=this.files[i]["size"]/1000000
    this.manualmodel.tamano=tamaño.toFixed()+" MB"
  }else{
    let tamaño=this.files[i]["size"]/1000
    this.manualmodel.tamano=tamaño.toFixed()+" KB"
  }
  this.manualmodel.cveAsunto=cveAsunto
  lastValueFrom(this.manualservice.insertarManual(this.manualmodel)); 
  this.manualservice.llamarManualbycount(this.count).toPromise().then( (result : any) =>{
    this.manualmodel.id=result.container[0]["max"]
    this.dialogRef.close(this.manualmodel)
  });

  }
  
}

input(evt:any){

  
  const target : DataTransfer = <DataTransfer>(evt.target);
  let i
for( i=0;target.files.length>i;i++){
  this.arr.push(target.files[i])
 
  }
  this.onFileChange(this.arr)
  /*
     let formato= ""+target.files[0].name.split(".")[target.files[0].name.split(".").length-1];
    if(formato == "xlsm" formato == "xlsx"  formato == "xlsb" formato == "xlts" formato == "xltm" formato == "xls" formato == "xlam" formato == "xla"formato == "xlw" ){
      if(target.files.length !==1) throw new  alert('No puedes subir multiples archivos') ;
      const reader: FileReader= new FileReader();*/
}

  onFileChange(pFileList: File[]){
    for(let i=0;i<pFileList.length;i++){
    let file=pFileList[i]
    this.files.push(file)
    const reader= new FileReader()
    reader.readAsDataURL(file);
    reader.onload = () => {
    this.lector.push(reader.result)
    }
   

  }
  }

  deleteFile(f:any){
    this.files = this.files.filter(function(w){ return w.name != f.name });
    this._snackBar.open("Successfully delete!", 'Close', {
      duration: 2000,
    });
  }

}
