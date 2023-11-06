import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
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
  public ruta = rutas;

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
          this.router.navigate(['/farmacia/cliente']);
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
