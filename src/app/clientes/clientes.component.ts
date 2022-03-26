import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private clienteService: ClienteService,
    private activatedRouted : ActivatedRoute) { }

  ngOnInit(): void {
    
    this.activatedRouted.paramMap.subscribe(params =>{
      let page: number = + params.get('page');
      
      if(!page){
        page = 0;
      }

      this.clienteService.getClientes(page).pipe(
        tap(response =>{
          console.log('clienteComponent: tap 3');
          (response.content as Cliente[]).forEach(cliente =>{ 
            console.log(cliente.nombre)
          })
        })
      ).subscribe(response => this.clientes = response.content as Cliente[]);
    }
    );
  }
  delete(cliente: Cliente):void{
    swal.fire({
      title: 'Está Seguro?',
      text: `Seguro que deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response =>{
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal.fire(
              'Cliente eliminado!',
              `Cliente ${cliente.nombre} eliminado con exito.`,
              'success'
            )
          }
        )
        
      }
    })
    
  }
}
