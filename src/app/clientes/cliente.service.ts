import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient,HttpEvent, HttpRequest } from '@angular/common/http';
import { map , catchError, tap} from 'rxjs';

import { Router } from '@angular/router';
import { Region } from './region';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndpoint:string = 'http://localhost:8080/api/clientes';

  

  constructor(private http: HttpClient, private router : Router) { }

    /*private agregarAuthorizationHeader(){
      let token = this.authService.token;
      if(token !=null){
        return this.httpHeaders.append('Authorization','Bearer ' +  token);
      }
      return this.httpHeaders;
    }*/

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndpoint + '/regiones');
  }


  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndpoint + '/page/' + page ).pipe(
      tap((response:any) => {
        console.log('Cliente Service: tap 1');
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        })
      }),
      map((response:any) => {
        (response.content as Cliente[]).map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();
        
          let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt,'EEEE dd,MMMM yyyy');  //formatDate(cliente.createAt, 'dd-MM-yyyy','en-US');
          return cliente;
        });
        return response;
      }
      ),
      tap(response => {
        (response.content as Cliente[]).forEach(cliente =>{
        console.log('Cliente Service: tap 2');
          console.log(cliente.nombre);
        })
      })
    );
  }

  create(cliente:Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndpoint,cliente).pipe(
      catchError(e =>{
        if(e.status==400){

          return throwError(e);
        }
        if( e.error.mensaje){
          console.error(e.error.mensaje);
        }
       
        return throwError(e);
      })
    )
  }
  
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e =>{
        if(e.status !=401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        
        return throwError(e);
      })
    )
  }
  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`,cliente).pipe(
      catchError(e =>{
        if(e.status==400){
          
          return throwError(e);
        }
        if( e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    )
  }
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e =>{
  
        if( e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    )
  }

  subirFoto(archivo:File,id): Observable<HttpEvent<any>>{

    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);
    const req = new HttpRequest('POST',`${this.urlEndpoint}/upload`,formData,{
      reportProgress:true
    });
    return this.http.request(req); 
    
  }
}
