import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenDetalleService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-detalle.service';
import { MovimientosAlmacenItemService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-item.service';

import { Movimientos_Detalle } from 'src/app/shared/interfaces/almacen';

import Swal from 'sweetalert2';
import * as Notiflix from 'notiflix';
import { Stock } from 'src/app/shared/interfaces/logistica';
import { GeneralService } from 'src/app/shared/services/general.service';

interface Producto {
  estiloRojo: boolean;
  idobtenido: string;
  codigoobtenido: string;
  producto: number; //*
  nombrepobtenido: string;
  cantidad: number; //*
  medida: number; //*
  subtotalagregado: string;
  movimiento: number; //*
  observacion: string;
}
interface data {
  value: string;
}

@Component({
  selector: 'app-transferencias-ver',
  templateUrl: './transferencias-ver.component.html',
  styleUrls: ['./transferencias-ver.component.scss'],
})
export class TransferenciasVerComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  public ruta = rutas;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private productoService: ProductoService,
    private stockService: StockService,
    private medidaService: MedidaService,
    private datePipe: DatePipe,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService,
    private movimientosAlmacenItemService: MovimientosAlmacenItemService,
    private generalService: GeneralService
  ) {}

  datoPRODUCTO: any[] = [];

  fechaActual = new Date();
  fechaFormateada2 = this.datePipe.transform(this.fechaActual, 'yyyy/MM/dd');
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );
  movimientoId: any;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const movimientoIdParam = params.get('movimiento_id');
      if (movimientoIdParam !== null) {
        this.movimientoId = +movimientoIdParam;
      }
    });

    const initialForm = this.fb.group({
      movimientoDetalle: this.fb.group({
        id: ['', Validators.required],
        fecha: [''],
        tipo_origen: [''],
        usuario_id: [''],
        usuarioEncargado: [''],
        idsucursal: [''],
        nombreSucursal: [''],
        movimiento_origen: [''],
        codigo_origen: [''],
        observaciones: [''],
        estado: [''],
      }),
      listaMovimiento: this.fb.array([]),
    });

    // Asignar el formulario
    this.form = initialForm;
    this.medidasAll();
    this.usuariosAll();
    this.sucursalAll();
    this.productosAll();
    this.stockAll();
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
  datosUSUARIO: any;
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSUARIO: any) => {
        this.datosUSUARIO = datosUSUARIO;
        //console.log(this.datosUSUARIO);
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
        this.movimientoInformacionGet(this.movimientoId);
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }
  productosAll(): void {
    this.productoService.getProductosAll().subscribe({
      next: (data: any) => {
        this.datoPRODUCTO = data;
        //console.log(this.datoPRODUCTO);
        this.movimientoInformacionProductos(this.movimientoId);
      },
      error: (_erroData) => {},
      complete: () => {},
    });
  }

  datosSTOCK: any;
  stockAll(): void {
    this.stockService.getStockAll().subscribe({
      next: (dataStockResponse) => {
        this.datosSTOCK = dataStockResponse;
        console.log(this.datosSTOCK);
      },
      error: () => {},
      complete: () => {},
    });
  }

  movimientoINFO: any;
  movimientoBusqueda: any;
  movimientoInformacionGet(movimientoId: any): void {
    this.movimientosAlmacenService.getMovimiento(movimientoId).subscribe({
      next: (responseMov) => {
        this.movimientoINFO = responseMov;
        console.log(responseMov);
        //PARA SUCURSAL
        const sucursal = this.datosSUC.find(
          (suc: any) => suc.suc_id == this.movimientoINFO[0]['sucursal_id']
        );
        if (sucursal) {
          this.form
            .get('movimientoDetalle.nombreSucursal')
            ?.setValue(sucursal.suc_nombre);
        }
        //PARA USUARIO
        const user = this.datosUSUARIO.find(
          (user: any) => user.user_id == this.movimientoINFO[0]['usuario_id']
        );
        if (user) {
          this.form
            .get('movimientoDetalle.usuarioEncargado')
            ?.setValue(user.user_nombre);
        }
        this.form
          .get('movimientoDetalle.tipo_origen')
          ?.setValue(this.movimientoINFO[0]['movimiento_tipo']);
        this.form
          .get('movimientoDetalle.fecha')
          ?.setValue(
            this.datePipe.transform(
              this.movimientoINFO[0]['movimiento_fecha'],
              'dd/MM/yyyy HH:mm'
            )
          );
        this.form
          .get('movimientoDetalle.id')
          ?.setValue(this.movimientoINFO[0]['movimiento_id']);
        this.form
          .get('movimientoDetalle.usuario_id')
          ?.setValue(this.movimientoINFO[0]['usuario_id']);
        this.form
          .get('movimientoDetalle.idsucursal')
          ?.setValue(this.movimientoINFO[0]['sucursal_id']);
        this.form
          .get('movimientoDetalle.movimiento_origen')
          ?.setValue(this.movimientoINFO[0]['movimiento_origen']);

        //BUSCAMOS EL MOVIMIENTO DE EGRESO DE REFERENCIA
        this.form
          .get('movimientoDetalle.codigo_origen')
          ?.setValue(this.movimientoINFO[0]['codigo_origen']);
        this.movimientosAlmacenService
          .getMovimiento(this.movimientoINFO[0]['codigo_origen'])
          .subscribe({
            next: (responseMovBusq) => {
              this.movimientoBusqueda = responseMovBusq;
              //console.log(this.movimientoBusqueda[0]);
            },
            error: (errorDataMovBusq) => {
              console.log(errorDataMovBusq);
            },
            complete: () => {},
          });

        this.form
          .get('movimientoDetalle.observaciones')
          ?.setValue(this.movimientoINFO[0]['movimiento_observaciones']);
        this.form
          .get('movimientoDetalle.estado')
          ?.setValue(this.movimientoINFO[0]['movimiento_estado']);
      },
      error: () => {},
      complete: () => {},
    });
  }

  productoList = [];
  datosProductosDetalle: any;
  movimientoInformacionProductos(movimientoId: any) {
    this.movimientosAlmacenItemService
      .getMovimientosItem(movimientoId)
      .subscribe({
        next: (response) => {
          this.datosProductosDetalle = response;

          // Mapea los nombres personales a los datos de movimiento detalle
          this.datosProductosDetalle = this.datosProductosDetalle.map(
            (movimientoDetalle: Movimientos_Detalle) => {
              //PARA CATEGORIAS
              const producto = this.datoPRODUCTO.find(
                (pro: any) => pro.prod_id === movimientoDetalle.producto_id
              );
              if (producto) {
                movimientoDetalle.nombreProducto = producto.prod_nombre;
                movimientoDetalle.codigoProducto = producto.prod_codigo;
              }
              if (movimientoDetalle.unidad_medida == 0) {
                movimientoDetalle.nombreMedida = '';
              } else {
                //PARA MEDIDAS
                const medida = this.datosMED.find(
                  (med: any) => med.med_id === movimientoDetalle.unidad_medida
                );
                if (medida) {
                  movimientoDetalle.nombreMedida = medida.med_nombre;
                }
              }
              return movimientoDetalle;
            }
          );
          this.productoList = this.datosProductosDetalle;

          const listaMovimiento = this.form.get('listaMovimiento') as FormArray;
          this.productoList.forEach((producto: any) => {
            const nuevoProducto = this.fb.group({
              idobtenido: [producto.movimiento_id, Validators.required],
              codigoobtenido: [producto.codigoProducto, Validators.required],
              producto: [producto.producto_id, Validators.required],
              nombrepobtenido: [producto.nombreProducto, Validators.required],
              cantidad: [producto.cantidad, Validators.required],
              medida: [producto.unidad_medida],
              medidanombre: [producto.nombreMedida],
              vencimiento: [''],
              lote: [''],
              peso: [''],
            });
            listaMovimiento.push(nuevoProducto);
          });
          console.log(this.productoList);
        },
        error: (errorData) => {
          console.error(
            'Error al enviar la solicitud GET de MovimientosItems:',
            errorData
          );
        },
        complete: () => {},
      });
  }

  openEditModal(data: any) {
    // Mostrar el modal
    const modalElement = document.getElementById('modal_codigosucursal');
    if (modalElement) {
      modalElement.classList.add('show');
    }
  }

  trackByIndex(index: number, item: any) {
    return index;
  }

  dataPRODLISTA: any;
  confirmarTransferencia() {
    console.log('CONFIRMAR TRANSFERENCIA');
    this.dataPRODLISTA = this.form.get('listaMovimiento')?.value;
    console.log(this.dataPRODLISTA);
    Notiflix.Loading.pulse('Confirmando transferencia...');
    const dataMovimientoPut = {
      id: this.movimientoId,
      observacion: 'TRANSFERENCIA ACEPTADA',
      condicion: 'ATENCION-TRANSFERENCIA',
    };

    this.movimientosAlmacenService
      .updatedMovimiento(dataMovimientoPut)
      .subscribe({
        next: (responseUpdateMov) => {
          console.log('Observacion agregada con exito', responseUpdateMov);

          //PASAMOS A ACTUALIZAR CADA PRODUCTO
          this.dataPRODLISTA.forEach((data: any) => {
            const dataMovimientoDetallePut = {
              id: data.idobtenido,
              producto: data.producto,
              medida: data.medida,
              vencimiento: data.vencimiento,
              lote: data.lote,
              peso: data.peso,
              condicion: 'CONFIRMACION-TRANSFERENCIA',
            };
            console.log(dataMovimientoDetallePut);

            this.movimientosAlmacenDetalleService
              .updatedMovimientosDetalle(dataMovimientoDetallePut)
              .subscribe({
                next: (responseMovDetalle) => {
                  console.log('ACTUALIZACION EXITOSA ', responseMovDetalle);

                  const stockFindEgreso = this.datosSTOCK.find(
                    (sto: any) =>
                      sto.almacen_id ==
                        this.movimientoBusqueda[0]['sucursal_id'] &&
                      sto.producto_id == data.producto &&
                      sto.unidad_medida == data.medida
                  );
                  if (stockFindEgreso) {
                    console.log(stockFindEgreso);
                    const nuevostock =
                      Number(stockFindEgreso.cantidad) - Number(data.cantidad);
                    const dataStockUpdateEgreso = {
                      almacen: this.movimientoBusqueda[0]['sucursal_id'],
                      producto: data.producto,
                      medida: data.medida,
                      cantidad: nuevostock,
                      condicion: 'ACTUALIZACION-POR-TRANSFERENCIA-EGRESO',
                    };
                    //console.log(dataStockUpdateEgreso);
                    this.stockService
                      .updatedStock(dataStockUpdateEgreso)
                      .subscribe({
                        next: (responseUpdateStock) => {
                          console.log(
                            'Entrada actualizada de stock con éxito:',
                            responseUpdateStock
                          );
                        },
                        error: (errorData) => {
                          Notiflix.Loading.remove();
                          console.error(
                            'Error al enviar la solicitud PUT de Egreso en STOCK:',
                            errorData
                          );
                        },
                        complete: () => {},
                      });
                  }

                  const stockFindIngreso = this.datosSTOCK.find(
                    (sto: any) =>
                      sto.almacen_id == this.movimientoINFO[0]['sucursal_id'] &&
                      sto.producto_id == data.producto &&
                      sto.unidad_medida == data.medida
                  );
                  if (stockFindIngreso) {
                    console.log(stockFindIngreso);
                    const nuevostock =
                      Number(stockFindIngreso.cantidad) + Number(data.cantidad);
                    const dataStockUpdateIngreso = {
                      almacen: this.movimientoINFO[0]['sucursal_id'],
                      producto: data.producto,
                      medida: data.medida,
                      cantidad: nuevostock,
                      condicion: 'ACTUALIZACION-POR-TRANSFERENCIA-INGRESO',
                    };
                    //console.log(dataStockUpdateIngreso);
                    this.stockService
                      .updatedStock(dataStockUpdateIngreso)
                      .subscribe({
                        next: (responseUpdateStock) => {
                          console.log(
                            'Entrada actualizada de stock con éxito:',
                            responseUpdateStock
                          );
                        },
                        error: (errorData) => {
                          Notiflix.Loading.remove();
                          console.error(
                            'Error al enviar la solicitud PUT de Ingreso en STOCK:',
                            errorData
                          );
                        },
                        complete: () => {},
                      });
                  }
                },
                error: (errorDataMovDetalle) => {
                  Notiflix.Loading.remove();
                  console.log(
                    'Error al actualizar datos de producto en Almacen Detalle',
                    errorDataMovDetalle
                  );
                },
                complete: () => {},
              });
          });
        },
        error: (errorData) => {
          Notiflix.Loading.remove();
          console.error(
            'Error al enviar la solicitud PUT de MOVIMIENTO:',
            errorData
          );
        },
        complete: () => {
          Notiflix.Loading.remove();
          this.router.navigate([
            rutas.almacen_movimientosalmacen_transferencias,
          ]);
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            //title: 'Stock minimo guardado',
            html: '<div style="font-size: 15px; font-weight: 700">Transferencia aceptada de forma exitosa.</div>',
          });
        },
      });
  }

  confirmarTransferencia2() {
    this.dataPRODLISTA = this.form.get('listaMovimiento')?.value;
    this.dataPRODLISTA.forEach((data: any) => {
      const dataMovimientoDetallePut = {
        id: data.idobtenido,
        producto: data.producto,
        medida: data.medida,
        vencimiento: data.vencimiento,
        lote: data.lote,
        peso: data.peso,
        condicion: 'CONFIRMACION-TRANSFERENCIA',
      };
      console.log(dataMovimientoDetallePut);

      this.movimientosAlmacenDetalleService
        .updatedMovimientosDetalle(dataMovimientoDetallePut)
        .subscribe({
          next: (responseMovDetalle) => {
            console.log('ACTUALIZACION EXITOSA ', responseMovDetalle);
          },
          error: (errorDataMovDetalle) => {
            Notiflix.Loading.remove();
            console.log(
              'Error al actualizar datos de producto en Almacen Detalle',
              errorDataMovDetalle
            );
          },
          complete: () => {},
        });
    });
  }

  rechazarTransferencia() {
    console.log('RECHAZAR TRANSFERENCIA');
    Notiflix.Loading.pulse('Rechazando transferencia...');
    const dataMovimientoPut = {
      id: this.movimientoId,
      observacion: 'TRANSFERENCIA RECHAZADA',
      condicion: 'ATENCION-TRANSFERENCIA',
    };
    this.movimientosAlmacenService
      .updatedMovimiento(dataMovimientoPut)
      .subscribe({
        next: (responseUpdateMov) => {
          console.log(
            'Observacion agregada con &eacute;xito',
            responseUpdateMov
          );
        },
        error: (errorData) => {
          Notiflix.Loading.remove();
          console.error(
            'Error al enviar la solicitud PUT de MOVIMIENTO:',
            errorData
          );
        },
        complete: () => {
          Notiflix.Loading.remove();
          this.router.navigate([
            rutas.almacen_movimientosalmacen_transferencias,
          ]);
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            //title: 'Stock minimo guardado',
            html: '<div style="font-size: 15px; font-weight: 700">Transferencia rechazada de forma exitosa.</div>',
          });
        },
      });
  }

  /* 
  aConfirmarTransferencia() {
    if (
      this.form.get('movimientoDetalle')?.valid &&
      this.form.get('listaMovimiento')?.valid
    ) {
      //console.log(this.form.get('listaMovimiento')?.value);
      //Notiflix.Loading.pulse('Confirmando transferencia...');
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: '¿Esta seguro?',
          text: '¡Los siguientes productos pasarán a ser parte de su agencia!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'ACEPTAR!',
          cancelButtonText: 'RECHAZAR!',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const dataMovimientPut = {
              id: this.movimientoId,
              observacion: 'TRANSFERENCIA ACEPTADA',
              condicion: 'ATENCION-TRANSFERENCIA',
            };
            console.log(dataMovimientPut);
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            const dataMovimientPut = {
              id: this.movimientoId,
              observacion: 'TRANSFERENCIA RECHAZADA',
              condicion: 'ATENCION-TRANSFERENCIA',
            };
            console.log(dataMovimientPut);
          }
        });
        /////////////////////////
      this.movimientosAlmacenService
        .updatedMovimiento(dataMovimientPut)
        .subscribe({
          next: (responseUpdateMov) => {
            console.log(
              'Observacion agregada con &eacute;xito',
              responseUpdateMov
            );
          },
          error: (errorData) => {
            Notiflix.Loading.remove();
            console.error(
              'Error al enviar la solicitud PUT de MOVIMIENTO:',
              errorData
            );
          },
          complete: () => {},
        });

      this.form.get('listaMovimiento')?.value.forEach((data: any) => {
        const dataMovimientoDetallePut = {
          id: data.idobtenido,
          producto: data.producto,
          medida: data.medida,
          vencimiento: data.vencimiento,
          lote: data.lote,
          peso: data.peso,
          condicion: 'CONFIRMACION-TRANSFERENCIA',
        }; //console.log(dataMovimientoDetallePut);

        this.movimientosAlmacenDetalleService
          .updatedMovimientosDetalle(dataMovimientoDetallePut)
          .subscribe({
            next: (responseMovDetalle) => {
              console.log('ACTUALIZACION EXITOSA, ', responseMovDetalle);

              const stockFindEgreso = this.datosSTOCK.find(
                (sto: any) =>
                  sto.almacen_id == this.movimientoBusqueda[0]['sucursal_id'] &&
                  sto.producto_id == data.producto &&
                  sto.unidad_medida == data.medida
              );
              if (stockFindEgreso) {
                console.log(stockFindEgreso);
                const nuevostock =
                  Number(stockFindEgreso.cantidad) - Number(data.cantidad);
                const dataStockUpdateEgreso = {
                  almacen: this.movimientoBusqueda[0]['sucursal_id'],
                  producto: data.producto,
                  medida: data.medida,
                  cantidad: nuevostock,
                  condicion: 'ACTUALIZACION-POR-TRANSFERENCIA-EGRESO',
                };
                //console.log(dataStockUpdateEgreso);
                this.stockService
                  .updatedStock(dataStockUpdateEgreso)
                  .subscribe({
                    next: (responseUpdateStock) => {
                      console.log(
                        'Entrada actualizada de stock con éxito:',
                        responseUpdateStock
                      );
                    },
                    error: (errorData) => {
                      Notiflix.Loading.remove();
                      console.error(
                        'Error al enviar la solicitud PUT de STOCK:',
                        errorData
                      );
                    },
                    complete: () => {},
                  });
              }

              const stockFindIngreso = this.datosSTOCK.find(
                (sto: any) =>
                  sto.almacen_id == this.movimientoINFO[0]['sucursal_id'] &&
                  sto.producto_id == data.producto &&
                  sto.unidad_medida == data.medida
              );
              if (stockFindIngreso) {
                console.log(stockFindIngreso);
                const nuevostock =
                  Number(stockFindIngreso.cantidad) + Number(data.cantidad);
                const dataStockUpdateIngreso = {
                  almacen: this.movimientoINFO[0]['sucursal_id'],
                  producto: data.producto,
                  medida: data.medida,
                  cantidad: nuevostock,
                  condicion: 'ACTUALIZACION-POR-TRANSFERENCIA-INGRESO',
                };
                //console.log(dataStockUpdateIngreso);
                this.stockService
                  .updatedStock(dataStockUpdateIngreso)
                  .subscribe({
                    next: (responseUpdateStock) => {
                      console.log(
                        'Entrada actualizada de stock con éxito:',
                        responseUpdateStock
                      );
                    },
                    error: (errorData) => {
                      Notiflix.Loading.remove();
                      console.error(
                        'Error al enviar la solicitud PUT de STOCK:',
                        errorData
                      );
                    },
                    complete: () => {},
                  });
              }
            },
            error: (errorDataMovDetalle) => {
              Notiflix.Loading.remove();
              console.log(errorDataMovDetalle);
            },
            complete: () => {
              Notiflix.Loading.remove();
              this.router.navigate([
                rutas.almacen_movimientosalmacen_transferencias,
              ]);
              const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: 'success',
                //title: 'Stock minimo guardado',
                html: '<div style="font-size: 15px; font-weight: 700">Transferencia aceptada de forma exitosa.</div>',
              });
            },
          });
      });
    } else {
      alert('Faltan datos');
    }
  }
  */

  /*   onKeyDown(event: KeyboardEvent) {
    event.stopPropagation();

  }
  updateValue(controlName: string, event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.form.get('listaMovimiento')?.get(controlName)?.patchValue(value);
  } */
}
