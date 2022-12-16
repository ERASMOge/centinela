import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupModel } from 'src/app/models/group.model';
import { responseService } from 'src/app/models/responseService.model';
import { UsersModel } from 'src/app/models/users.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersmoduleService {
    local = environment.api;
    constructor(private http:HttpClient){}

    llamarUsuarios(){ 
        return this.http.get(this.local+"Users/usersModule.php");
      }
      llamarGroup(Group:string){ 
        return this.http.get(this.local+"Users/usersModule.php?Group="+Group);
      }
      llamarRol(Rol:string){ 
        
        
        return this.http.get(this.local+"Users/usersModule.php?Rol="+Rol);
        
      }
      llamarGroupList(GroupList:string){ 
        return this.http.get(this.local+"Users/usersModule.php?GroupList="+GroupList);
      }
      llamarUserbycount(){ 
        return this.http.get(this.local+"Users/usersModule.php");
      }
      insertarUser(input:UsersModel){
        let headers = new HttpHeaders().set('Content-type','Application/json')
        return this.http.post(this.local+"Users/UsersModule.php",input, {headers});
      }

      insertarGroup(input:GroupModel){
        
        let headers = new HttpHeaders().set('Content-type','Application/json')
        return this.http.post(this.local+"Users/UsersModule.php?Group=",input, {headers});
      }

      llamarListaAgentes(id:number){ 
        
        return this.http.get(this.local+"Users/usersModule.php?id="+id);
      }
llamarUserInfo(id:number){
  
        
  return this.http.get(this.local+"Users/usersModule.php?Info="+id);
}

llamarGroupInfo(id:number){
  
        
  return this.http.get(this.local+"Users/usersModule.php?InfoGroup="+id);
}


updateUser(input:UsersModel){
  
  let headers = new HttpHeaders().set('Content-type','Application/json')
  return this.http.patch(this.local+"Users/UsersModule.php?UpdateUser=",input, {headers});
}

updateGroup(input:GroupModel){
  
  let headers = new HttpHeaders().set('Content-type','Application/json')
  return this.http.patch(this.local+"Users/UsersModule.php?UpdateGroup=",input, {headers});
}

deleteUser(id:number){
  
        
  return this.http.delete(this.local+"Users/usersModule.php?DeleteUser="+id);
}

deleteGroup(id:number){

  return this.http.delete(this.local+"Users/usersModule.php?DeleteGroup="+id);
}
      }
  
     
