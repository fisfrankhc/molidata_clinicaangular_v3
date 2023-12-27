import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configurar-codigo-index',
  templateUrl: './configurar-codigo-index.component.html',
  styleUrls: ['./configurar-codigo-index.component.scss'],
})
export class ConfigurarCodigoIndexComponent implements OnInit {
  public ruta = rutas;
  usersucursal: any = localStorage.getItem('usersucursal');
  constructor(
    private fb: FormBuilder,
    private sucursalService: SucursalService
  ) {}

  ngOnInit(): void {
    this.sucursalesAll();
  }
  dataSUC: any;
  sucursalesAll() {
    this.sucursalService.getSucursal(this.usersucursal).subscribe({
      next: (response: any) => {
        this.dataSUC = response;
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  ocultarCodigo(codigo: string): string {
    return '*'.repeat(codigo.length);
  }

  form = this.fb.group({
    idsucursal: ['', Validators.required],
    sucursalNombre: ['', Validators.required],
    sucursalDireccion: ['', Validators.required],
    codigoAutorizacion: ['', Validators.required],
    codigoAutorizacionVeri: ['', Validators.required],
    codigoAutorizacionNuevo: ['', Validators.required],
  });

  openEditModal(data: any) {
    // Mostrar el modal
    const modalElement = document.getElementById('modal_codigosucursal');
    if (modalElement) {
      modalElement.classList.add('show');
    }

    this.form.setValue({
      idsucursal: data.suc_id.toString(),
      sucursalNombre: data.suc_nombre,
      sucursalDireccion: data.suc_direccion,
      codigoAutorizacion: data.codigo_autorizacion.toString(),
      codigoAutorizacionVeri: '',
      codigoAutorizacionNuevo: '',
    });
  }

  actualizarCodigo() {
    if (this.form.valid) {
      const dataCodigoValidacion = {
        id: this.form.value.idsucursal,
        nombre: this.form.value.sucursalNombre,
        codigo: this.form.value.codigoAutorizacionNuevo,
        condicion: 'CAMBIO-CODIGO-VALIDACION',
      };

      if (
        this.form.value.codigoAutorizacion ===
        this.form.value.codigoAutorizacionVeri
      ) {
        console.log(dataCodigoValidacion);
        this.sucursalService.updatedSucursal(dataCodigoValidacion).subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (errorData) => {},
          complete: () => {
            this.sucursalesAll();

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
              html: '<div style="font-size: 15px; font-weight: 700">C&oacute;digo de validaci&oacute;n actualizado</div>',
            });
          },
        });
      } else {
        Swal.fire({
          title: 'El codigo de validacion no corresponde',
          icon: 'error',
          timer: 2700,
        });
      }
    }
  }
}
