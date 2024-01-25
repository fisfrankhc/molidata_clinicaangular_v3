import { Component } from '@angular/core';
import { rutasclinica } from 'src/app/shared/routes/rutasclinica';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClientesService } from 'src/app/shared/services/despacho/clientes/clientes.service';
import { Router } from '@angular/router';

interface data {
  value: string;
}

@Component({
  selector: 'app-clientes-nuevo',
  templateUrl: './clientes-nuevo.component.html',
  styleUrls: ['./clientes-nuevo.component.scss'],
})
export class ClientesNuevoComponent {
  public rutaclinica = rutasclinica;

  constructor(
    public clientesService: ClientesService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  form = this.fb.group({
    documento: ['', Validators.required],
    numero: ['', [Validators.required, Validators.minLength(8)]],
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }
  registrarCliente() {
    if (this.form.valid) {
      const datos = this.form.value;
      console.log(datos);
      this.clientesService.postClientes(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          //this.router.navigate(['/despacho/cliente']);
          this.router.navigate([rutasclinica.cita_cliente]);
        },
      });
    }
  }

  public selectedValue!: string;
  selectedList1: data[] = [
    { value: 'DNI' },
    { value: 'CARNET DE EXTRANJERIA' },
  ];
}
