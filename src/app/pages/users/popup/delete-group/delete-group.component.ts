import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.css']
})
export class DeleteGroupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private userservice : UsersmoduleService, public dialogRef: MatDialogRef<DeleteGroupComponent>) { }

  ngOnInit(): void {
  }

  confirmar(){
    lastValueFrom(this.userservice.deleteGroup(this.data.idGrupo));

    this.dialogRef.close('Se ha Eliminado con exito');

  }

}
