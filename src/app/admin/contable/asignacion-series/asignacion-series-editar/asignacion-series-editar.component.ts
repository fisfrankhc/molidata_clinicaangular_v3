import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-asignacion-series-editar',
  templateUrl: './asignacion-series-editar.component.html',
  styleUrls: ['./asignacion-series-editar.component.scss'],
})
export class AsignacionSeriesEditarComponent implements OnInit {
  comprobnumeroId: number | null = null;
  public ruta = rutas;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    public comprobanteNumeracionService: ComprobanteNumeracionService,
    private comprobanteTipoService: ComprobanteTipoService
  ) {}

  comprobantesNumeros: any[] = [];
  comprobantesTipos: any[] = [];
  sucursales: any[] = [];
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const comprobnumeroIdParam = params.get('comprobnumero_id');
      if (comprobnumeroIdParam !== null) {
        this.comprobnumeroId = +comprobnumeroIdParam; // Convierte el valor en un número si es necesario
      }
    });
    this.comprobanteNumeroDetalle(this.comprobnumeroId);
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

  datoComprobanteNumero: any;
  comprobanteNumeroDetalle(comprobnumeroId: any) {
    console.log(comprobnumeroId);
    this.comprobanteNumeracionService
      .getComprobanteNumeracion(comprobnumeroId)
      .subscribe({
        next: (data) => {
          this.datoComprobanteNumero = data;
          //console.log(this.datoCategoria);
          this.form
            .get('id')
            ?.setValue(this.datoComprobanteNumero[0]['numeracion_id']);
          this.form
            .get('sede')
            ?.setValue(this.datoComprobanteNumero[0]['sede_id']);
          this.form
            .get('tipo')
            ?.setValue(this.datoComprobanteNumero[0]['comprobante_tipo']);
          this.form
            .get('serie')
            ?.setValue(this.datoComprobanteNumero[0]['serie']);
          this.form
            .get('numero')
            ?.setValue(this.datoComprobanteNumero[0]['numero']);
        },
        error: (errorData) => {
          console.error('Error al obtener los datos del usuario: ', errorData);
        },
        complete: () => {
          //console.log('DATOS OBTENIDOS EXITOSAMENTE');
        },
      });
  }

  /*   public selectedValue!: string;
  selectedList1: data[] = [
    { value: 'BOLETA DE VENTA ELECTRONICA' },
    { value: 'FACTURA ELECTRONICA' },
  ]; */

  form = this.fb.group({
    id: ['', Validators.required],
    sede: ['', Validators.required],
    tipo: ['', Validators.required],
    serie: ['', Validators.required],
    numero: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  actualizarSerieS() {
    if (this.form.valid) {
      //console.log(this.form.value);

      const sede = this.form.value.sede;
      const tipo = this.form.value.tipo;

      /* const limitarResultado = this.comprobantesNumeros.filter(
        (cnum: any) => cnum.numeracion_id !== String(this.comprobnumeroId)
      );
      console.log(limitarResultado); */

      const existeCoincidencia = this.comprobantesNumeros.some(
        (conumero: any) => {
          return (
            conumero.sede_id === sede &&
            conumero.comprobante_tipo === tipo &&
            conumero.numeracion_id !== String(this.comprobnumeroId)
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
        console.log('Actualizar serie');
        const datos = {
          id: this.form.value.id,
          sede: this.form.value.sede,
          tipo: this.form.value.tipo,
          serie: this.form.value.serie,
          numero: this.form.value.numero,
        };
        console.log(datos);
        this.comprobanteNumeracionService
          .updatedComprobanteNumeracion(datos)
          .subscribe({
            next: (response) => {
              console.log('Respuesta de la API:', response);
            },
            error: (errorData) => {
              console.error('Error al enviar la solicitud UPTADED:', errorData);
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
                html: '<div style="font-size: 15px; font-weight: 700">Serie actualizada con &eacute;xito.</div>',
              });
            },
          });
      }
    }
  }

  actualizarSerie() {
    if (this.form.valid) {
      const datos = {
        id: this.form.value.id,
        sede: this.form.value.sede,
        tipo: this.form.value.tipo,
        serie: this.form.value.serie,
        numero: this.form.value.numero,
        condicion: 'ASIGNACION-SERIE',
      };
      console.log(datos);
      this.comprobanteNumeracionService
        .updatedComprobanteNumeracion(datos)
        .subscribe({
          next: (response) => {
            console.log('Respuesta de la API:', response);
          },
          error: (errorData) => {},
          complete: () => {
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
              html: '<div style="font-size: 15px; font-weight: 700">Serie actualizada con &eacute;xito.</div>',
            });
          },
        });
    }
  }
}
