import { Component, OnInit } from '@angular/core';
import { rutasadministracion } from 'src/app/shared/routes/rutasadministracion';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from 'src/app/shared/services/roles/roles.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { GeneralService } from 'src/app/shared/services/general.service';

import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as Notiflix from 'notiflix';

interface data {
  id: string;
  value: string;
}
@Component({
  selector: 'app-usuarios-editar',
  templateUrl: './usuarios-editar.component.html',
  styleUrls: ['./usuarios-editar.component.scss'],
})
export class UsuariosEditarComponent implements OnInit {
  userId: number | null = null;
  public rutaadministracion = rutasadministracion;
  public selectedValue?: string;
  public selectedValue2?: string;

  constructor(
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private sucursalService: SucursalService,
    private generalService: GeneralService,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {}

  datosROL: any[] = [];
  datosSUC: any[] = [];
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userIdParam = params.get('usuario_id');
      if (userIdParam !== null) {
        this.userId = +userIdParam; // Convierte el valor en un número si es necesario
      }
    });

    this.usuarioDetalle(this.userId);

    this.rolesService.getRolesAll().subscribe((dataR: any) => {
      this.datosROL = dataR;
    });
    this.sucursalService.getSucursalAll().subscribe((dataS: any) => {
      this.datosSUC = dataS;
    });
    console.log(this.fechaFormateada);
  }

  selectedUserPanel: data[] = [
    { id: '1', value: 'VENTAS' },
    { id: '2', value: 'CLINICA' },
    { id: '3', value: 'ADMINISTRACION' },
  ];

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');

  form = this.fb.group({
    id: ['', Validators.required],
    user_name: ['', Validators.required],
    user_nombre: ['', Validators.required],
    user_correo: ['', Validators.email],
    user_telefono: [''],
    user_clave: ['', Validators.required],
    rol_id: ['', Validators.required],
    sucursal_id: ['', Validators.required],
    user_panel: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  datoUSUARIO: any;
  usuarioDetalle(prodId: any) {
    //console.log(prodId);
    this.generalService.getUsuario(prodId).subscribe({
      next: (data) => {
        this.datoUSUARIO = data;
        //console.log(this.datoUSUARIO);
        this.form.get('id')?.setValue(this.datoUSUARIO[0]['user_id']);
        this.form.get('user_name')?.setValue(this.datoUSUARIO[0]['user_name']);
        this.form
          .get('user_nombre')
          ?.setValue(this.datoUSUARIO[0]['user_nombre']);
        this.form
          .get('user_correo')
          ?.setValue(this.datoUSUARIO[0]['user_correo']);
        this.form
          .get('user_telefono')
          ?.setValue(this.datoUSUARIO[0]['user_telefono']);
        this.form
          .get('user_clave')
          ?.setValue(this.datoUSUARIO[0]['user_clave']);
        this.form.get('rol_id')?.setValue(this.datoUSUARIO[0]['rol_id']);
        this.form
          .get('sucursal_id')
          ?.setValue(this.datoUSUARIO[0]['sucursal_id']);
        this.form
          .get('user_panel')
          ?.setValue(this.datoUSUARIO[0]['user_panel']);
      },
      error: (errorData) => {
        console.error('Error al obtener los datos del usuario: ', errorData);
      },
      complete: () => {
        //console.log('DATOS OBTENIDOS EXITOSAMENTE');
      },
    });
  }

  dataUSUARIOGEN: any;
  actualizarUsuario() {
    if (this.form.valid) {
      Notiflix.Loading.standard('Actualizando...');
      const datos = {
        id: this.userId,
        user_name: this.form.value.user_name,
        user_nombre: this.form.value.user_nombre,
        user_correo: this.form.value.user_correo,
        user_telefono: this.form.value.user_telefono,
        //user_clave: this.form.value.user_clave,
        //fecha_registro: this.fechaFormateada,
        rol_id: this.form.value.rol_id,
        sucursal_id: this.form.value.sucursal_id,
        user_panel: this.form.value.user_panel,
        condicion: 'ADMINISTRAR-USUARIO',
      };

      this.generalService.updatedUsuario(datos).subscribe({
        next: (responseUsuario) => {
          Notiflix.Loading.remove();
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            //title: 'Stock minimo guardado',
            html: `<div style="font-size: 15px; font-weight: 700">Usuario id ${responseUsuario} actualizado con &eacute;xito.</div>`,
          });
          //console.log('Registrado con éxito', responseUsuario);
        },
        error: (errorData) => {
          Notiflix.Loading.remove();
          console.error('Error al enviar la solicitud POST:', errorData);
        },
        complete: () => {
          this.form.reset();
          this.router.navigate([rutasadministracion.administracion_usuarios]);
        },
      });
    }
  }
}
