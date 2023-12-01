import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';

import { GeneralService } from 'src/app/shared/services/general.service';
import { GenerarRequerimientoService } from 'src/app/shared/services/almacen/generar-requerimiento/generar-requerimiento.service';

import { GenerarRequerimientoItemService } from 'src/app/shared/services/almacen/generar-requerimiento/generar-requerimiento-item.service';
import { DatePipe } from '@angular/common';


import { Requerimiento_Detalle } from 'src/app/shared/interfaces/almacen';


@Component({
  selector: 'app-generar-requerimiento-ver',
  templateUrl: './generar-requerimiento-ver.component.html',
  styleUrls: ['./generar-requerimiento-ver.component.scss'],
})
export class GenerarRequerimientoVerComponent implements OnInit {
  public ruta = rutas;
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private generalService: GeneralService,
    private generarRequerimientoService: GenerarRequerimientoService,
    private generarRequerimientoItemService: GenerarRequerimientoItemService,
    private datePipe: DatePipe
  ) {}

  requerimientoId: number | null = null;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const requerimientoIdParam = params.get('requerimiento_id');
      if (requerimientoIdParam !== null) {
        this.requerimientoId = +requerimientoIdParam;
      }
    });

    const initialForm = this.fb.group({
      requerimientoDetalle: this.fb.group({
        idsucursal_origen: ['', Validators.required],
        sucursal_origen: ['', Validators.required],
        user_nombre: ['', Validators.required],
        fecha: ['', Validators.required],
      }),

      listaRequerimiento: this.fb.array([]), // FormArray para la lista de compra
    });

    // Asignar el formulario
    this.form = initialForm;

    this.medidasAll();
    this.sucursalAll();
    this.usuariosAll();
    this.productosAll();
  }

  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.requerimientoDetalleItem(this.requerimientoId);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosUSER: any;
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSER: any) => {
        this.datosUSER = datosUSER;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosMED: any;
  medidasAll(): void {
    this.medidaService.getMedidasAll().subscribe({
      next: (datosMED: any) => {
        this.datosMED = datosMED;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosSUC: any;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
        this.requerimientoDetalle(this.requerimientoId);
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datoREQUERIMIENTO: any = {};
  requerimientoDetalle(requerimientoId: any) {
    this.generarRequerimientoService
      .getRequerimiento(requerimientoId)
      .subscribe({
        next: (data) => {
          this.datoREQUERIMIENTO = data;

          const usuario = this.datosUSER.find(
            (user: any) =>
              user.user_id === this.datoREQUERIMIENTO[0]['usuario_id']
          );
          if (usuario) {
            this.form
              .get('requerimientoDetalle.user_nombre')
              ?.setValue(usuario.user_nombre);
          }
          const fechaformateada = this.datePipe.transform(
            this.datoREQUERIMIENTO[0]['requerimiento_fecha'],
            'dd/MM/yyyy'
          );

          const sucursal = this.datosSUC.find(
            (suc: any) =>
              suc.suc_id === this.datoREQUERIMIENTO[0]['sucursal_id']
          );
          if (sucursal) {
            this.form
              .get('requerimientoDetalle.sucursal_origen')
              ?.setValue(sucursal.suc_nombre);
            this.form
              .get('requerimientoDetalle.idsucursal_origen')
              ?.setValue(sucursal.suc_id);
          }
          //ASIGNAMOS DE FORMA INDEPENDIENTE EL RESULTADO DE LA FECHA OBTENIDA
          this.form
            .get('requerimientoDetalle.fecha')
            ?.setValue(fechaformateada);
        },
        error: (errorData) => {
          console.error('Error al obtener los datos de la venta: ', errorData);
        },
        complete: () => {},
      });
  }

  datosProductosDetalle: any;
  datosREQUERIMIENTODetalle: any;
  requerimientoDetalleItem(requerimientoId: any) {
    this.generarRequerimientoItemService
      .getRequerimientosItem(requerimientoId)
      .subscribe({
        next: (response) => {
          //console.log(response)
          this.datosProductosDetalle = response;
          // Mapea los nombres de los clientes a los datos de ventas
          this.datosProductosDetalle = this.datosProductosDetalle.map(
            (requerimientoDetalle: Requerimiento_Detalle) => {
              console.log(requerimientoDetalle);
              //PARA PRODUCTOS
              const producto = this.datosPRO.find(
                (pro: any) => pro.prod_id === requerimientoDetalle.producto_id
              );
              if (producto) {
                requerimientoDetalle.nombreProducto = producto.prod_nombre;
                requerimientoDetalle.codigoProducto = producto.prod_codigo;
              }
              return requerimientoDetalle;
            }
          );
          this.datosProductosDetalle = this.datosProductosDetalle;
        },
        error: (errorData) => {
          console.error(
            'Error al enviar la solicitud GET de VentaDetalleItems:',
            errorData
          );
        },
        complete: () => {},
      });
  }
}
