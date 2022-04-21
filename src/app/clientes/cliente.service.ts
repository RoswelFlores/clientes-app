import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient,HttpEvent,HttpHeaders, HttpRequest } from '@angular/common/http';
import { map , catchError, tap} from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndpoint:string = 'http://localhost:8080/api/clientes';

  private HttpHeaders = new HttpHeaders({'Content-type':'application/json'})
  constructor(private http: HttpClient, private router : Router) { }

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
    return this.http.post<Cliente>(this.urlEndpoint,cliente,{headers: this.HttpHeaders}).pipe(
      catchError(e =>{

        if(e.status==400){

          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    )
  }
  
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e =>{
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }
  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`,cliente,{headers: this.HttpHeaders}).pipe(
      catchError(e =>{

        if(e.status==400){
          
          return throwError(e);
        }

        console.error(e.error.mensaje);
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    )
  }
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`,{headers: this.HttpHeaders}).pipe(
      catchError(e =>{
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje,e.error.error,'error');
        return throwError(e);
      })
    )
  }

  subirFoto(archivo:File,id): Observable<HttpEvent<{}>>{

    let formData = new FormData();
    formData.append("archivo",archivo);
    formData.append("id",id);

    const req = new HttpRequest('POST',`${this.urlEndpoint}/upload`,formData,{
      reportProgress:true
    });
    return this.http.request(req); 
    
  }
}
