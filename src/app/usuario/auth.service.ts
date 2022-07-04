import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario{
    if(this._usuario != null){
      return this._usuario
    }else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();  
  }
  public get token(): string{
    if(this._token != null){
      return this._token
    }else if(this.usuario == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario:Usuario): Observable<any>{
    const urlEndpoint= 'http://localhost:8080/oauth/token';
    
    const credenciales = btoa('angularapp'+ ':' + '12345');
    
    const httpheaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + credenciales});
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',usuario.username);
    params.set('password',usuario.password);
    console.log(params.toString());
    
    
    return this.http.post<any>(urlEndpoint,params.toString(),{headers: httpheaders});
  }

  guardarUsuario(accessToken:string):void{
    let objetoPayloat = this.ObtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = objetoPayloat.nombre;
    this._usuario.apellido = objetoPayloat.apellido;
    this._usuario.email = objetoPayloat.email;
    this._usuario.username = objetoPayloat.user_name;
    this._usuario.roles = objetoPayloat.authorities;

    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));
  }

  guardarToken(accessToken:string):void{
    this._token = accessToken;
    sessionStorage.setItem('token ',accessToken);
  }

  ObtenerDatosToken(accessToken:string):any{
    if(accessToken !=null){
       return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }
  
  isAuthenticated():boolean{
    let payload = this.ObtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length>0){
      return true;
    }
    return false;
  }
  logout():void{
    this._token = null;
    this._usuario= null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
}
