import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map , catchError} from 'rxjs';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndpoint:string = 'http://localhost:8080/api/clientes';

  private HttpHeaders = new HttpHeaders({'Content-type':'application/json'})
  constructor(private http: HttpClient, private router : Router) { }

  getClientes(): Observable<Cliente[]>{
    //return of(CLIENTES);
    return this.http.get<Cliente[]>(this.urlEndpoint);
  }

  create(cliente:Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndpoint,cliente,{headers: this.HttpHeaders}).pipe(
      catchError(e =>{
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
}
