import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from 'src/app/shared/services/roles/roles.service';

@Component({
  selector: 'app-roles-editar',
  templateUrl: './roles-editar.component.html',
  styleUrls: ['./roles-editar.component.scss'],
})
export class RolesEditarComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public rolesService: RolesService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  rolId: number | null = null;
  public ruta = rutas;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const catIdParam = params.get('rol_id');
      if (catIdParam !== null) {
        this.rolId = +catIdParam;
      }
    });
    this.rolDetalle(this.rolId);
  }

  datoRol: any;

  rolDetalle(rolId: any) {
    console.log(rolId);
    this.rolesService.getRol(rolId).subscribe({
      next: (data) => {
        this.datoRol = data;
        this.form.get('id')?.setValue(this.datoRol[0]['rol_id']);
        this.form.get('nombre')?.setValue(this.datoRol[0]['rol_nombre']);
        this.form
          .get('descripcion')
          ?.setValue(this.datoRol[0]['rol_descripcion']);
      },
      error: (errorData) => {
        console.error('Error al obtener los datos del usuario: ', errorData);
      },
      complete: () => {
        //console.log('DATOS OBTENIDOS EXITOSAMENTE');
      },
    });
  }
  form = this.fb.group({
    id: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
  });
  get f() {
    return this.form.controls;
  }

  editarRol() {
    if (this.form.valid) {
      const datos = this.form.value;
      this.rolesService.updatedRol(datos).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
        },
        error: (errorData) => {
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          this.router.navigate(['/roles']);
        },
      });
    }
  }
}
