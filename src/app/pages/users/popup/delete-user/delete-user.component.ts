import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { UsersmoduleService } from 'src/app/core/services/usersmodule.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private userservice : UsersmoduleService, public dialogRef: MatDialogRef<DeleteUserComponent>) { }

  ngOnInit(): void {
  }

  confirmar(){
    lastValueFrom(this.userservice.deleteUser(this.data.idUsuario));

    this.dialogRef.close('Se ha Actualizado con exito');

  }

}
