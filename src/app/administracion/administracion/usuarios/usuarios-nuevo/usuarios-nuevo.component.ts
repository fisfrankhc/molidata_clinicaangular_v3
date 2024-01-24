import { Component, OnInit } from '@angular/core';
import { rutasadministracion } from 'src/app/shared/routes/rutasadministracion';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RolesService } from 'src/app/shared/services/roles/roles.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { GeneralService } from 'src/app/shared/services/general.service';

import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as Notiflix from 'notiflix';

interface data {
  id: number;
  value: string;
}

@Component({
  selector: 'app-usuarios-nuevo',
  templateUrl: './usuarios-nuevo.component.html',
  styleUrls: ['./usuarios-nuevo.component.scss'],
})
export class UsuariosNuevoComponent implements OnInit {
  public rutaadministracion = rutasadministracion;
  public selectedValue?: string;
  public selectedValue2?: string;

  constructor(
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
    this.rolesService.getRolesAll().subscribe((dataR: any) => {
      this.datosROL = dataR;
    });
    this.sucursalService.getSucursalAll().subscribe((dataS: any) => {
      this.datosSUC = dataS;
    });
    console.log(this.fechaFormateada);
  }

  selectedUserPanel: data[] = [
    { id: 1, value: 'VENTAS' },
    { id: 2, value: 'CLINICA' },
    { id: 3, value: 'ADMINISTRACION' },
  ];

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');

  form = this.fb.group({
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

  dataUSUARIOGEN: any;
  registrarUsuario() {
    if (this.form.valid) {
      Notiflix.Loading.standard('Guardando...');
      const datos = {
        user_name: this.form.value.user_name,
        user_nombre: this.form.value.user_nombre,
        user_correo: this.form.value.user_correo,
        user_telefono: this.form.value.user_telefono,
        user_clave: this.form.value.user_clave,
        fecha_registro: this.fechaFormateada,
        rol_id: this.form.value.rol_id,
        sucursal_id: this.form.value.sucursal_id,
        user_panel: this.form.value.user_panel,
      };

      this.generalService.getUsuariosAll().subscribe({
        next: (response) => {
          this.dataUSUARIOGEN = response;
          const usuario = this.dataUSUARIOGEN.find(
            (user: any) => user.user_name === datos.user_name
          );
          //VERIFICAMOS SI EXISTE UN USUARIO CON ESE USER_NAME
          if (usuario) {
            Notiflix.Loading.remove();
            alert('YA EXISTE INFORMACION CON ESE NOMBRE DE USUARIO');
          }
          // SI NO EXISTE, PROCEDEMOS A GUARDAR
          else {
            this.generalService.postUsuario(datos).subscribe({
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
                  html: `<div style="font-size: 15px; font-weight: 700">Usuario id ${responseUsuario}registrado con &eacute;xito.</div>`,
                });
                //console.log('Registrado con éxito', responseUsuario);
              },
              error: (errorData) => {
                Notiflix.Loading.remove();
                console.error('Error al enviar la solicitud POST:', errorData);
              },
              complete: () => {
                this.form.reset();
                this.router.navigate([
                  rutasadministracion.administracion_usuarios,
                ]);
              },
            });
          }
        },
        error: (errorU) => {
          console.error('Error al consultar usuario:', errorU);
        },
        complete: () => {},
      });
    }
  }
}
