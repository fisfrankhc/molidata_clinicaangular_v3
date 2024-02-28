import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { rutas } from 'src/app/shared/routes/rutas';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';
import { DatePipe } from '@angular/common';
import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenItemService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-item.service';
import { Movimientos_Detalle } from 'src/app/shared/interfaces/almacen';

import * as Notiflix from 'notiflix';
import Swal from 'sweetalert2';

interface data {
  value: string;
}

interface Producto {
  cantidad: number;
  codigoProducto: string;
  detalle_id: number;
  fecha_vencimiento: string;
  lote: number;
  movimiento_id: number;
  nombreMedida: string;
  nombreProducto: string;
  peso: number;
  producto_id: number;
  unidad_medida: number;
}

@Component({
  selector: 'app-logrevtransferencia-ver',
  templateUrl: './logrevtransferencia-ver.component.html',
  styleUrls: ['./logrevtransferencia-ver.component.scss'],
})
export class LogrevtransferenciaVerComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private generalService: GeneralService,
    private sucursalService: SucursalService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenItemService: MovimientosAlmacenItemService,
    private datePipe: DatePipe,
    private stockService: StockService
  ) {}

  movimientoId: number | null = null;
  public ruta = rutas;
  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const movimientoIdParam = params.get('movimiento_id');
      if (movimientoIdParam !== null) {
        this.movimientoId = +movimientoIdParam;
      }
    });
    this.productosAll();

    const initialForm = this.fb.group({
      movimientoDetalle: this.fb.group({
        movimiento_id: ['', Validators.required],
        movimiento_fecha: [''],
        movimiento_tipo: [''],
        usuario_id: [''],
        usuario_nombre: [''],
        sucursal_id: [''],
        sucursal_nombre: [''],
        movimiento_origen: [''],
      }),
      listaCompra: this.fb.array([]), // FormArray para la lista de compra
      comprobanteDetalle: this.fb.group({
        comprobante_tipo: ['', Validators.required],
        comprobante_serie: ['', Validators.required],
        comprobante_numero: ['', Validators.required],
        suc_destino: ['', Validators.required],
      }),
    });

    // Asignar el formulario
    this.form = initialForm;

    this.productoService.getProductosAll().subscribe({
      next: (data: any) => {
        this.datoPRODUCTO = data;
      },
      error: (_erroData) => {},
      complete: () => {},
    });

    this.medidasAll();
    this.sucursalAll();
    this.usuariosAll();
    this.stockAll();
  }

  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.movimientoDetalleItems(this.movimientoId);
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

  datoUSUARIO: any[] = [];
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datoUSUARIO: any) => {
        this.datoUSUARIO = datoUSUARIO;
        //console.log(this.datoUSUARIO);
        this.movimientoDetalle(this.movimientoId);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datoSUC: any[] = [];
  sucursalAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datoSUC: any) => {
        this.datoSUC = datoSUC;
        //console.log(this.datoSUC);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datoStock: any;
  stockAll(): void {
    this.stockService.getStockAll().subscribe({
      next: (datoStock: any) => {
        this.datoStock = datoStock;
        //console.log(this.datoStock);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datoMOVIMIENTO: any = {};
  movimientoDetalle(movimientoId: any) {
    console.log(movimientoId);
    this.movimientosAlmacenService.getMovimiento(movimientoId).subscribe({
      next: (data) => {
        this.datoMOVIMIENTO = data;
        console.log(this.datoMOVIMIENTO);
        if (this.datoSUC && this.datoUSUARIO.length > 0) {
          const usuario = this.datoUSUARIO.find(
            (user: any) => user.user_id === this.datoMOVIMIENTO[0]['usuario_id']
          );
          const sucursal = this.datoSUC.find(
            (suc: any) => suc.suc_id === this.datoMOVIMIENTO[0]['sucursal_id']
          );
          if (usuario) {
            this.form
              .get('movimientoDetalle.usuario_nombre')
              ?.setValue(usuario.user_name);
          }
          if (sucursal) {
            this.form
              .get('movimientoDetalle.sucursal_nombre')
              ?.setValue(sucursal.suc_nombre);
          }
        }
        this.form
          .get('movimientoDetalle.movimiento_origen')
          ?.setValue(this.datoMOVIMIENTO[0]['movimiento_origen']);
        this.form
          .get('movimientoDetalle.movimiento_fecha')
          ?.setValue(this.datoMOVIMIENTO[0]['movimiento_fecha']);
        this.form
          .get('movimientoDetalle.movimiento_tipo')
          ?.setValue(this.datoMOVIMIENTO[0]['movimiento_tipo']);
      },
      error: (errorData) => {
        console.error('Error al obtener los datos de la venta: ', errorData);
      },
      complete: () => {
        //console.log('DATOS OBTENIDOS EXITOSAMENTE');
      },
    });
  }

  datosMovimientoDetalle: any;
  movimientoDetalleItems(movimientoId: any) {
    this.movimientosAlmacenItemService
      .getMovimientosItem(movimientoId)
      .subscribe({
        next: (response) => {
          this.datosMovimientoDetalle = response;
          console.log(this.datosMovimientoDetalle);
          // Mapea los nombres de los clientes a los datos de ventas
          this.datosMovimientoDetalle = this.datosMovimientoDetalle.map(
            (movimientosDetalle: Movimientos_Detalle) => {
              //PARA CATEGORIAS
              const producto = this.datosPRO.find(
                (pro: any) => pro.prod_id === movimientosDetalle.producto_id
              );
              if (producto) {
                movimientosDetalle.nombreProducto = producto.prod_nombre;
                movimientosDetalle.codigoProducto = producto.prod_codigo;
              }
              if (movimientosDetalle.unidad_medida == 0) {
                movimientosDetalle.nombreMedida = '';
              } else {
                //PARA MEDIDAS
                const medida = this.datosMED.find(
                  (med: any) => med.med_id === movimientosDetalle.unidad_medida
                );
                if (medida) {
                  movimientosDetalle.nombreMedida = medida.med_nombre;
                }
              }
              return movimientosDetalle;
            }
          );
          this.productoList = this.datosMovimientoDetalle;
        },
        error: (errorData) => {
          console.error(
            'Error al enviar la solicitud GET de ComprasItems:',
            errorData
          );
        },
        complete: () => {},
      });
  }

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );
  comprobanteTipo: data[] = [{ value: 'BOLETA' }, { value: 'FACTURA' }];

  public calcularSubtotal(producto: any): number {
    const precio = producto.precio_compra;
    const cantidad = producto.cantidad;

    return precio * cantidad;
  }

  productoList = [];
  public calcularSubtotalTotal(): number {
    let subtotalTotal = 0;
    this.productoList.forEach((producto) => {
      subtotalTotal += this.calcularSubtotal(producto);
    });
    return subtotalTotal;
  }

  rechazarTransferencia(): void {
    const dataRechazar = {
      id: this.movimientoId,
      observacion: 'TRANSFERENCIA RECHAZADA',
      condicion: 'ATENCION-TRANSFERENCIA',
    };
    this.movimientosAlmacenService.updatedMovimiento(dataRechazar).subscribe({
      next: (responseDataRechazar) => {
        console.log(
          'ACTUALIZACION EXITOSA EN MOVIMIENTOS',
          responseDataRechazar
        );
      },
      error: (errorData1) => {
        console.log('Error al actualizar movimiento de rechazo', errorData1);
      },
      complete: () => {},
    });
  }

  aceptarTransferencia(): void {
    Notiflix.Loading.pulse('Actualizando stock de transferencia...');
    const dataAceptada = {
      id: this.movimientoId,
      observacion: 'TRANSFERENCIA ACEPTADA',
      condicion: 'ATENCION-TRANSFERENCIA',
    };

    this.movimientosAlmacenService.updatedMovimiento(dataAceptada).subscribe({
      next: (responseDataAceptada) => {
        console.log(
          'ACTUALIZACION EXITOSA EN MOVIMIENTOS',
          responseDataAceptada
        );

        ///////////RECORREMOS CADA PRODUCTO
        this.productoList.forEach((producto: Producto) => {
          /////////////PRIMERO DESCONTAMOS DEL STOCK
          const dataCompStock = this.datoStock.find(
            (stoc: any) =>
              stoc.producto_id == producto.producto_id &&
              stoc.almacen_id === '1'
          );
          console.log(dataCompStock);
          if (dataCompStock) {
            const nuevaStockPrincipal =
              Number(dataCompStock.cantidad) - Number(producto.cantidad);
            console.log(nuevaStockPrincipal);

            const dataUpdateStock = {
              id: dataCompStock.stock_id,
              condicion: 'TRANSFERENCIA-ACEPTADA-SALIDA',
              cantidad: nuevaStockPrincipal,
            };
            console.log(dataUpdateStock);

            this.stockService.updatedStock(dataUpdateStock).subscribe({
              next: (responseDataUpdateDescuento) => {
                console.log(
                  'ACTUALIZACION EXITOSA EN DESCUENTO DE STOCK',
                  responseDataUpdateDescuento
                );
              },
              error: (errorData2) => {
                Notiflix.Loading.remove();
                console.log(
                  'Error al actualizar el descuento de stock de almacen 1',
                  errorData2
                );
              },
              complete: () => {},
            });
          }

          ///////////AHORA SUMAMOS AL STOCK
          const dataStockPost = {
            almacen: this.datoMOVIMIENTO[0]['sucursal_id'],
            producto: producto.producto_id,
            cantidad: producto.cantidad,
            medida: producto.unidad_medida,
          };
          this.stockService.getStockAll().subscribe({
            next: (responseFind: any) => {
              //SI ES UN TABLA VACIA, REGISTRAMOS EL PRIMER DATO DE LA TABLA
              if (responseFind == 'no hay resultados') {
                this.stockService.postStock(dataStockPost).subscribe({
                  next: (responsePostStock) => {
                    console.log(
                      'Entrada registrada con éxito:',
                      responsePostStock
                    );
                  },
                  error: (errorData) => {
                    Notiflix.Loading.remove();
                    console.error(
                      'Error al enviar la solicitud POST PRIMERA de STOCK A ALMACEN DE DESTINO:',
                      errorData
                    );
                  },
                  complete: () => {},
                });
                console.log(dataStockPost);
              }
              //SI NO ES UNA TABLA VACIA, YA QUE BUSQUE
              else {
                //buscamos algun producto que se encuentre en la tabla
                const dataCompStockIngreso = this.datoStock.find(
                  (stoc: any) =>
                    stoc.producto_id == producto.producto_id &&
                    stoc.almacen_id === this.datoMOVIMIENTO[0]['sucursal_id']
                );
                //console.log(dataCompStockIngreso);
                //SI ENCONTRAMOS HACEMOS EL PUT
                if (dataCompStockIngreso) {
                  const nuevaStockIngreso =
                    Number(dataCompStock.cantidad) + Number(producto.cantidad);
                  console.log(nuevaStockIngreso);

                  const dataUpdateStockIngreso = {
                    id: dataCompStock.stock_id,
                    condicion: 'TRANSFERENCIA-ACEPTADA-INGRESO',
                    cantidad: nuevaStockIngreso,
                  };
                  //console.log(dataUpdateStockIngreso);
                  this.stockService
                    .updatedStock(dataUpdateStockIngreso)
                    .subscribe({
                      next: (responseDataUpdateSuma) => {
                        console.log(
                          'ACTUALIZACION EXITOSA EN SUMA DE STOCK',
                          responseDataUpdateSuma
                        );
                      },
                      error: (errorData2) => {
                        Notiflix.Loading.remove();
                        console.log(
                          'Error al actualizar la suma de stock de almacen destino',
                          errorData2
                        );
                      },
                      complete: () => {},
                    });
                }
                //SI NO SE ENCUENTRA LA DATA QUE COINCIDA, HACEMOS EL POST
                else {
                  this.stockService.postStock(dataStockPost).subscribe({
                    next: (responsePostStock) => {
                      console.log(
                        'Entrada registrada con éxito:',
                        responsePostStock
                      );
                    },
                    error: (errorData) => {
                      Notiflix.Loading.remove();
                      console.error(
                        'Error al enviar la solicitud POST de STOCK A ALMACEN DE DESTINO:',
                        errorData
                      );
                    },
                    complete: () => {},
                  });
                  //console.log(dataStockPost);
                }
              }
            },
            error: () => {},
            complete: () => {},
          });
        });
      },
      error: (errorData1) => {
        Notiflix.Loading.remove();
        console.log('Error al actualizar movimiento de aceptacion', errorData1);
      },
      complete: () => {
        Notiflix.Loading.remove();
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          html: `<div style="font-size: 15px; font-weight: 700">Datos de transferencia de ID: ${this.movimientoId} añadidas con &eacute;xito.</div>`,
        });
      },
    });
  }
}
