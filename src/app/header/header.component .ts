import { Component } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../usuario/auth.service";


@Component({
    selector:'app-header',
    templateUrl:'./header.component.html'

})
export class HeaderComponent{
    title: String = `App Angular`;

    constructor(public authService : AuthService, public router:Router){}
    logout():void{
          let username = this.authService.usuario.username;
          this.authService.logout();
        Swal.fire('Logout',`Hola ${username} , has cerrado sesion con exito`,'success');
        this.router.navigate(['/login']);
    }
   
}
