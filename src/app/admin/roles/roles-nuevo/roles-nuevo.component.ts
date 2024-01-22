import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/shared/services/roles/roles.service';

@Component({
  selector: 'app-roles-nuevo',
  templateUrl: './roles-nuevo.component.html',
  styleUrls: ['./roles-nuevo.component.scss'],
})
export class RolesNuevoComponent {
  public ruta = rutas;

  constructor(
    public rolesService: RolesService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  registrarRol() {
    if (this.form.valid) {
      const datos = this.form.value;

      this.rolesService.postRoles(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          //this.router.navigate(['/roles']);
          this.router.navigate([rutas.rol]);
        },
      });
    }
  }
}
