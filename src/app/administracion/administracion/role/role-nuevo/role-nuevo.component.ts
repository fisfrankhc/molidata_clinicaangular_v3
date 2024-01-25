import { Component } from '@angular/core';
import { rutasadministracion } from 'src/app/shared/routes/rutasadministracion';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/shared/services/roles/roles.service';

@Component({
  selector: 'app-role-nuevo',
  templateUrl: './role-nuevo.component.html',
  styleUrls: ['./role-nuevo.component.scss'],
})
export class RoleNuevoComponent {
  public rutaadministracion = rutasadministracion;

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
          this.router.navigate([rutasadministracion.administracion_roles]);
        },
      });
    }
  }
}
