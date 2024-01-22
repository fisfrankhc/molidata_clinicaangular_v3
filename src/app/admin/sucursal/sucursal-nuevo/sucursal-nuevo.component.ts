import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';

@Component({
  selector: 'app-sucursal-nuevo',
  templateUrl: './sucursal-nuevo.component.html',
  styleUrls: ['./sucursal-nuevo.component.scss'],
})
export class SucursalNuevoComponent {
  public ruta = rutas;

  constructor(
    public sucursalService: SucursalService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  form = this.fb.group({
    nombre: ['', Validators.required],
    direccion: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  registrarSucursal() {
    if (this.form.valid) {
      const datos = this.form.value;

      this.sucursalService.postSucursal(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          //this.router.navigate(['/sucursal']);
          this.router.navigate([rutas.sucursal]);
        },
      });
    }
  }
}
