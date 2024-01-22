import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ComprobanteNumeracionService } from 'src/app/shared/services/contable/asignacion-serie/comprobante-numeracion.service';
import { ComprobanteTipoService } from 'src/app/shared/services/contable/asignacion-serie/comprobante-tipo.service';
import Swal from 'sweetalert2';

interface data {
  value: string;
}
@Component({
  selector: 'app-asignacion-series-nuevo',
  templateUrl: './asignacion-series-nuevo.component.html',
  styleUrls: ['./asignacion-series-nuevo.component.scss'],
})
export class AsignacionSeriesNuevoComponent implements OnInit {
  public ruta = rutas;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private comprobanteNumeracionService: ComprobanteNumeracionService,
    private comprobanteTipoService: ComprobanteTipoService
  ) {}

  comprobantesNumeros: any[] = [];
  comprobantesTipos: any[] = [];
  sucursales: any[] = [];
  ngOnInit(): void {
    this.sucursalService.getSucursalAll().subscribe((data: any) => {
      this.sucursales = data;
    });
    this.comprobanteNumeracionService
      .getComprobanteNumeracionAll()
      .subscribe((data: any) => {
        this.comprobantesNumeros = data;
      });
    this.comprobanteTipoService
      .getComprobanteTiposAll()
      .subscribe((data: any) => {
        this.comprobantesTipos = data;
      });
  }

  /*   public selectedValue!: string;
  selectedList1: data[] = [
    { value: 'BOLETA DE VENTA ELECTRONICA' },
    { value: 'FACTURA ELECTRONICA' },
  ]; */

  form = this.fb.group({
    sede: ['', Validators.required],
    tipo: ['', Validators.required],
    serie: ['', Validators.required],
    numero: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  registrarSerie() {
    if (this.form.valid) {
      //console.log(this.form.value);
      const datos = this.form.value;

      const sede = this.form.value.sede;
      const tipo = this.form.value.tipo;

      const existeCoincidencia = this.comprobantesNumeros.some(
        (conumero: any) => {
          return (
            conumero.sede_id === sede && conumero.comprobante_tipo === tipo
          );
        }
      );

      if (existeCoincidencia) {
        console.log('Ya no se puede guardar, al menos uno es igual');
        Swal.fire({
          title: 'Ya existe una serie con la sede y tipo creada',
          icon: 'error',
          timer: 2700,
        });
      }
      // Aquí realizamos la lógica para guardar la serie
      else {
        console.log('Guardar producto');
        this.comprobanteNumeracionService
          .postComprobanteNumeracion(datos)
          .subscribe({
            next: (response) => {
              console.log('Respuesta de la API:', response);
            },
            error: (errorData) => {
              console.error('Error al enviar la solicitud POST:', errorData);
            },
            complete: () => {
              this.form.reset();
              //this.router.navigate(['/contable/asignacion-series']);
              this.router.navigate([rutas.contable_asignacionserie]);

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
                html: '<div style="font-size: 15px; font-weight: 700">Serie creada con &eacute;xito.</div>',
              });
            },
          });
      }

      /*  */
    }
  }
}
