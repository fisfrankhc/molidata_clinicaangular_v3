import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, HostListener } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { Router } from '@angular/router';
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
import { catchError, concatMap, map, startWith, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';
import * as Notiflix from 'notiflix';
import { Stock } from 'src/app/shared/interfaces/logistica';

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
  selector: 'app-transferencias-nuevo',
  templateUrl: './transferencias-nuevo.component.html',
  styleUrls: ['./transferencias-nuevo.component.scss'],
})
export class TransferenciasNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  public ruta = rutas;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private productoService: ProductoService,
    private stockService: StockService,
    private medidaService: MedidaService,
    private datePipe: DatePipe,
    //private movimientosCentralService: MovimientosCentralService,
    //private movimientosCentralDetalleService: MovimientosCentralDetalleService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService
  ) {}

  datoPRODUCTO: any[] = [];

  fechaActual = new Date();
  fechaFormateada2 = this.datePipe.transform(this.fechaActual, 'yyyy/MM/dd');
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  ngOnInit(): void {
    const initialForm = this.fb.group({
      detalleTransferencia: this.fb.group({
        sucursal_origen: ['', Validators.required],
        fecha: ['', Validators.required],
      }),
      productoBuscado: this.fb.group({
        idbuscado: ['', Validators.required],
        codigobuscado: [''],
        nombrebuscado: [''],
        nombrebproducto: [''],
        preciobuscado: [''],
        medidabuscado: [''],
        medidanombrebuscado: [''],
        cantidadbuscado: [''],
        observacionbuscado: [''],
      }),
      listaMovimiento: this.fb.array([]), // FormArray para la lista de compra
    });

    // Asignar el formulario
    this.form = initialForm;
    this.form.get('detalleTransferencia')?.patchValue({
      fecha: this.fechaFormateada2,
    });

    this.productoService.getProductosAll().subscribe({
      next: (data: any) => {
        this.datoPRODUCTO = data;
        console.log(this.datoPRODUCTO);
      },
      error: (_erroData) => {},
      complete: () => {},
    });

    this.medidasAll();
    this.filteresOption();
    this.sucursalAll();
    this.stockAll();
    this.stockProductos();
    //this.movimientosAll();
    // Agregar suscriptor para el evento valueChanges del campo nombrebproducto en caso este vacio
    this.form
      .get('productoBuscado.nombrebproducto')
      ?.valueChanges.subscribe((value) => {
        if (!value || value.trim() === '') {
          // Si el valor es vacío, resetear los campos del grupo productoBuscado
          this.form.get('productoBuscado')?.patchValue({
            idbuscado: '',
            codigobuscado: '',
            nombrebuscado: '',
            preciobuscado: '',
            medidabuscado: '',
            medidanombrebuscado: '',
            cantidadbuscado: '',
            observacionbuscado: '',
          });
        }
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
  public selectedValue!: string;

  datosSUC: any;
  datosSUCU: any;
  nombreSucursal!: string;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
        //FILTRAMOS LA SUCURSAL AL CUAL PERTENECE EL USUARIO
        this.datosSUCU = this.datosSUC.filter(
          (sucursal: any) => sucursal.suc_id !== this.usersucursal
        );
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datosSTOCK: any;
  stockAll(): void {
    this.stockService.getStockAll().subscribe({
      next: (dataStockResponse) => {
        this.datosSTOCK = dataStockResponse;
        console.log(this.datosSTOCK);
        //this.stockProductos();
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosSTOCK2: any;
  datoPRODUCTOSTOCK: any[] = [];
  stockProductos(): void {
    this.stockService.getStockAll().subscribe({
      next: (dataStockResponse2) => {
        this.datosSTOCK2 = dataStockResponse2;
        let almacen_id_deseado = this.usersucursal; // El almacen_id que quieres filtrar
        // Filtrar productos basados en el almacen_id
        let productosFiltrados = this.datoPRODUCTO.filter((producto: any) => {
          // Verificar si hay alguna entrada en datosSTOCK que coincida con el producto_id y almacen_id
          return this.datosSTOCK.some((stock: any) => {
            return (
              stock.producto_id === producto.prod_id &&
              stock.almacen_id === almacen_id_deseado
            );
          });
        });
        this.datoPRODUCTOSTOCK = productosFiltrados;
        console.log(productosFiltrados);
      },
      error: () => {},
      complete: () => {},
    });
  }

  filteredOptions!:
    | Observable<{ id: string; nombre: string; descripcion: string }[]>
    | undefined;
  filteresOption() {
    this.filteredOptions = this.form
      .get('productoBuscado.nombrebproducto')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value as string))
      ) as
      | Observable<{ id: string; nombre: string; descripcion: string }[]>
      | undefined;
  }
  private _filter(
    value: string | null
  ): { id: string; nombre: string; descripcion: string }[] {
    if (!value) {
      return this.datoPRODUCTOSTOCK.map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        descripcion: option.prod_descripcion,
      }));
    }

    const filterValue = value.toLowerCase();
    return this.datoPRODUCTOSTOCK
      .filter((option) =>
        option.prod_nombre.toLowerCase().includes(filterValue)
      )
      .map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        descripcion: option.prod_descripcion,
      }));
  }

  //PARA EL 2DO FORMGROUP
  onProductSelected(event: any) {
    const selectedProduct = event.option.value;
    //console.log('Este el valor de selectedProduct: ' + selectedProduct);

    const productoSeleccionado = this.datoPRODUCTOSTOCK.find(
      (producto) => producto.prod_nombre == selectedProduct
    );
    //console.log(productoSeleccionado);
    if (productoSeleccionado) {
      const medida = this.datosMED.find(
        (medida: any) => medida.med_id == productoSeleccionado.med_id
      );
      this.form.get('productoBuscado')?.patchValue({
        idbuscado: productoSeleccionado.prod_id,
        codigobuscado: productoSeleccionado.prod_codigo,
        nombrebuscado: productoSeleccionado.prod_id,
        nombrebproducto: productoSeleccionado.prod_nombre,
        preciobuscado: productoSeleccionado.precio_venta,
        medidabuscado: productoSeleccionado.med_id,
        medidanombrebuscado: medida.med_simbolo,
        cantidadbuscado: 1,
        observacionbuscado: '-',
      });
    } else {
      // Si no se selecciona un producto, puedes limpiar los campos
      this.form.get('productoBuscado')?.patchValue({
        idbuscado: '',
        codigobuscado: '',
        nombrebuscado: '',
        nombrebproducto: '',
        preciobuscado: '',
        medidabuscado: '',
        medidanombrebuscado: '',
        cantidadbuscado: null,
        observacionbuscado: '',
      });
    }
  }

  //PARA EL TERCER FORMGROUP
  agregarALista() {
    if (this.form.get('productoBuscado')?.valid) {
      const productoBuscado = this.form.get('productoBuscado');
      const listaMovimiento = this.form.get('listaMovimiento') as FormArray;

      // Crea un nuevo FormGroup para el producto
      const nuevoProducto = this.fb.group({
        idobtenido: ['', Validators.required],
        codigoobtenido: ['', Validators.required],
        producto: ['', Validators.required],
        nombrepobtenido: ['', Validators.required],
        cantidad: ['', Validators.required],
        medida: [''],
        medidanombre: [''],
        precio: ['', Validators.required],
        observacion: '',
        subtotalagregado: ['', Validators.required],
        descuento: [0],
      });

      // Obtener el id del producto buscado
      const idProductoBuscado = productoBuscado?.get('idbuscado')?.value;
      // Verificar si el producto ya está en la listaMovimiento
      const productoExistente = listaMovimiento.controls.find(
        (control) => control.get('idobtenido')?.value === idProductoBuscado
      );
      if (!productoExistente) {
        // Copia los valores del producto buscado al nuevo producto
        nuevoProducto.patchValue({
          idobtenido: productoBuscado?.get('idbuscado')?.value,
          codigoobtenido: productoBuscado?.get('codigobuscado')?.value,
          producto: productoBuscado?.get('nombrebuscado')?.value,
          nombrepobtenido: productoBuscado?.get('nombrebproducto')?.value,
          cantidad: productoBuscado?.get('cantidadbuscado')?.value,
          medida: productoBuscado?.get('medidabuscado')?.value,
          medidanombre: productoBuscado?.get('medidanombrebuscado')?.value,
          precio: productoBuscado?.get('preciobuscado')?.value,
          observacion: productoBuscado?.get('observacionbuscado')?.value,
          descuento: 0,
          subtotalagregado: (
            productoBuscado?.get('preciobuscado')?.value *
            productoBuscado?.get('cantidadbuscado')?.value
          ).toString(),
        });

        // Agrega el nuevo producto a la lista de compra
        listaMovimiento.push(nuevoProducto);
        //console.log(listaMovimiento.controls);

        this.calcularSubtotal();

        this.form.get('productoBuscado')?.reset();
      } else {
        alert('El producto ya está en la lista.');
      }
    } else {
      alert('Se necesita un producto');
    }
  }

  eliminarProducto(index: number) {
    const listaMovimiento = this.form.get('listaMovimiento') as FormArray;
    listaMovimiento.removeAt(index);

    this.calcularSubtotal();
  }

  //ID DE VENTA OBTENIDA GUARDADA
  movimiento: any;
  dataCOMPRA: any;
  dataPROCOMPRA: any[] = [];
  productosNoEncontrados: number[] = [];
  dataOperacionCompra: any;

  productoEncontrado(producto: any): boolean {
    return (
      this.dataPROCOMPRA &&
      this.dataPROCOMPRA.some(
        (productoCompra: any) =>
          productoCompra.producto_id === producto.idobtenido
      )
    );
  }

  calcularSubtotal(): number {
    const listaMovimiento = this.form.get('listaMovimiento') as FormArray;
    let subtotal = 0;

    for (const control of listaMovimiento.controls) {
      const subtotalProducto = parseFloat(
        control.get('subtotalagregado')?.value || 0
      );
      subtotal += subtotalProducto;
    }

    return subtotal;
  }

  calcularTotal(): number {
    // Puedes agregar impuestos u otros costos si es necesario
    return this.calcularSubtotal(); // Por ahora, el total es igual al subtotal
  }

  @ViewChild('addToListLink') addToListLink!: ElementRef;
  // Escucha el evento keydown en toda la página.
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Verificar si la tecla si la tecla 'Ctrl' y la tecla 'A' y está presionada.
    if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
      // Evita el comportamiento predeterminado del navegador para la combinación Ctrl + A.
      event.preventDefault();

      // Llama a la función agregarALista().
      this.agregarALista();
    }
  }

  idrptaMovimientoIngreso: any;
  idrptaMovimientoEgreso: any;
  dataverifyStock: any;
  ConfirmarTransferencia() {
    if (
      this.form.get('detalleTransferencia')?.valid &&
      this.form.get('listaMovimiento')?.valid
    ) {
      if (this.form.get('listaMovimiento')?.value == '') {
        alert('No ha añadido productos');
      } else {
        const dataMovimientoEgreso = {
          fecha: this.fechaFormateada,
          tipo: 'EGRESO',
          usuario: this.userid,
          //sucursal: this.usersucursal,
          sucursal: this.usersucursal,
          origen: 'TRANSFERENCIA',
          origencodigo: '',
          observaciones: '',
        };

        /* const dataMovimientoIngreso = {
          fecha: this.fechaFormateada,
          tipo: 'INGRESO',
          usuario: this.userid,
          //sucursal: this.usersucursal,
          sucursal: this.form.get('detalleTransferencia.sucursal_origen')
            ?.value,
          origen: 'TRANSFERENCIA',
          origencodigo: this.idrptaMovimientoEgreso,
          observaciones: '',
        }; */

        //console.log(dataMovimientoEgreso);
        //console.log(dataMovimientoIngreso);
        this.stockAll();

        //PRIMER RECORRIDO PARA QUE MARQUE CUAL SE PASA
        let todosProductosCumplen = true; // Variable de bandera
        //SEGUNDO RECORRIDO PARA QUE VERIFIQUE SI AL MENOS UNO NO CUMPLE CON QUE SEA MENOR QE EL STOCK
        this.form.value.listaMovimiento.map((producto: Producto) => {
          console.log(producto);

          const stockEncontrada = this.datosSTOCK.find(
            (stoc: any) =>
              stoc.producto_id === producto.idobtenido &&
              stoc.almacen_id === this.usersucursal
          );
          if (stockEncontrada) {
            console.log(stockEncontrada, 'SE ENCONTRO EL PRODUCTO');

            if (Number(producto.cantidad) <= Number(stockEncontrada.cantidad)) {
              console.log(
                'SI ESTA PERMITIDA EL MOVIMIENTO YA QUE LA CANTIDAD ES MENOR'
              );
            } else {
              console.log('LA CANTIDAD ES SUPERIOR A LA PERMITIDA');
              todosProductosCumplen = false;
            }
            producto.estiloRojo =
              Number(producto.cantidad) >= Number(stockEncontrada.cantidad);
            //console.log(producto.estiloRojo);
          }
        });
        //console.log(todosProductosCumplen);
        if (!todosProductosCumplen) {
          console.log('UN PRODUCTO NO CUMPLE LAS CARACTERISTICAS');
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            timerProgressBar: true, // Muestra una barra de progreso
            showConfirmButton: false,
            timer: 4000,
            text: 'HAY UNO O MAS PRODUCTOS QUE NO CUENTAN CON EL STOCK PARA TRANSFERENCIA',
          });
        }
        //SI NO HAY NINGUN PROBLEMA CON EL STOCK, PROCEDEMOS A REALIZAR LA TRANSFERENCIA
        else {
          console.log('TODO ES CORRECTO');
          Notiflix.Loading.circle('Guardando transferencia...');

          this.movimientosAlmacenService
            .postMovimientos(dataMovimientoEgreso)
            .pipe(
              tap((responseMovimientoEgreso) => {
                console.log(
                  'Registro de Egreso exitoso',
                  responseMovimientoEgreso
                );
                this.idrptaMovimientoEgreso = responseMovimientoEgreso;
              }),
              concatMap(() =>
                forkJoin(
                  this.form.value.listaMovimiento.map((producto: Producto) => {
                    const dataMovimientoEgresoDetalle = {
                      movimiento: this.idrptaMovimientoEgreso,
                      producto: producto.idobtenido,
                      cantidad: producto.cantidad,
                      medida: producto.medida,
                      lote: '',
                      peso: '',
                    };
                    return this.movimientosAlmacenDetalleService.postMovimientosDetalle(
                      dataMovimientoEgresoDetalle
                    );
                  })
                ).pipe(
                  catchError((errorDataDetalleEgreso) => {
                    Notiflix.Loading.remove();
                    console.error(
                      'Error al enviar la solicitud POST de MOVIMIENTODETALLE EGRESO:',
                      errorDataDetalleEgreso
                    );
                    return of(null);
                  })
                )
              )
            )
            .subscribe({
              next: () => {
                console.log('Registro de Egreso completado');

                // Definir dataMovimientoIngreso después de obtener idrptaMovimientoEgreso
                const dataMovimientoIngreso = {
                  fecha: this.fechaFormateada,
                  tipo: 'INGRESO',
                  usuario: this.userid,
                  sucursal: this.form.get(
                    'detalleTransferencia.sucursal_origen'
                  )?.value,
                  origen: 'TRANSFERENCIA',
                  origencodigo: this.idrptaMovimientoEgreso,
                  observaciones: '',
                };

                // Continúa con la llamada para postMovimientos de ingreso
                this.movimientosAlmacenService
                  .postMovimientos(dataMovimientoIngreso)
                  .pipe(
                    tap((responseMovimientoIngreso) => {
                      console.log(
                        'Registro de Ingreso exitoso',
                        responseMovimientoIngreso
                      );
                      this.idrptaMovimientoIngreso = responseMovimientoIngreso;
                    }),
                    concatMap(() =>
                      forkJoin(
                        // Segundo recorrido para guardar detalles de ingreso
                        this.form.value.listaMovimiento.map(
                          (producto: Producto) => {
                            const dataMovimientoIngresoDetalle = {
                              movimiento: this.idrptaMovimientoIngreso,
                              producto: producto.idobtenido,
                              cantidad: producto.cantidad,
                              medida: producto.medida,
                              lote: '',
                              peso: '',
                            };
                            return this.movimientosAlmacenDetalleService.postMovimientosDetalle(
                              dataMovimientoIngresoDetalle
                            );
                          }
                        )
                      ).pipe(
                        catchError((errorDataDetalleIngreso) => {
                          Notiflix.Loading.remove();
                          console.error(
                            'Error al enviar la solicitud POST de MOVIMIENTODETALLE INGRESO:',
                            errorDataDetalleIngreso
                          );
                          return of(null);
                        })
                      )
                    )
                  )
                  .subscribe({
                    next: () => {
                      console.log('Todas las operaciones completadas');
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
                        html: '<div style="font-size: 15px; font-weight: 700">Movimiento de transferencia realizada exitosamente...</div>',
                      });
                      this.router.navigate([rutas.almacen_movimientosalmacen]);
                    },
                    error: (errorData) => {
                      Notiflix.Loading.remove();
                      console.error(
                        'Error en alguna de las operaciones:',
                        errorData
                      );
                    },
                    complete: () => {},
                  });
              },
              error: (errorData) => {
                Notiflix.Loading.remove();
                console.error('Error en alguna de las operaciones:', errorData);
              },
              complete: () => {},
            });
        }
      }
    } else {
      alert('Faltan datos');
    }
  }
}

/* 
forkJoin([
            this.movimientosAlmacenService
              .postMovimientos(dataMovimientoEgreso)
              .pipe(
                tap((responseMovimientoEgreso) => {
                  console.log(
                    'Registro de Egreso exitoso',
                    responseMovimientoEgreso
                  );
                  this.idrptaMovimientoEgreso = responseMovimientoEgreso;
                }),
                concatMap(() =>
                  forkJoin(
                    this.form.value.listaMovimiento.map(
                      (producto: Producto) => {
                        const dataMovimientoEgresoDetalle = {
                          movimiento: this.idrptaMovimientoEgreso,
                          producto: producto.idobtenido,
                          cantidad: producto.cantidad,
                          medida: producto.medida,
                          lote: '',
                          peso: '',
                        };
                        return this.movimientosAlmacenDetalleService.postMovimientosDetalle(
                          dataMovimientoEgresoDetalle
                        );
                      }
                    )
                  ).pipe(
                    catchError((errorDataDetalleEgreso) => {
                      Notiflix.Loading.remove();
                      console.error(
                        'Error al enviar la solicitud POST de MOVIMIENTODETALLE EGRESO:',
                        errorDataDetalleEgreso
                      );
                      return of(null);
                    })
                  )
                )
            ),
            this.movimientosAlmacenService
              .postMovimientos(dataMovimientoIngreso)
              .pipe(
                tap((responseMovimientoIngreso) => {
                  console.log(
                    'Registro de Ingreso exitoso',
                    responseMovimientoIngreso
                  );
                  this.idrptaMovimientoIngreso = responseMovimientoIngreso;
                }),
                concatMap(() =>
                  forkJoin(
                    //RECORRIDO 2 DE CADA PRODUCTO PARA GUARDAR DETALLE
                    this.form.value.listaMovimiento.map(
                      (producto: Producto) => {
                        const dataMovimientoIngresoDetalle = {
                          movimiento: this.idrptaMovimientoIngreso,
                          producto: producto.idobtenido,
                          cantidad: producto.cantidad,
                          medida: producto.medida,
                          lote: '',
                          peso: '',
                        };
                        return this.movimientosAlmacenDetalleService.postMovimientosDetalle(
                          dataMovimientoIngresoDetalle
                        );
                      }
                    )
                  ).pipe(
                    catchError((errorDataDetalleIngreso) => {
                      Notiflix.Loading.remove();
                      console.error(
                        'Error al enviar la solicitud POST de MOVIMIENTODETALLE INGRESO:',
                        errorDataDetalleIngreso
                      );
                      return of(null);
                    })
                  )
                )
              ),
          ]).subscribe({
            next: () => {
              console.log('Todas las operaciones completadas');
              
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
                html: '<div style="font-size: 15px; font-weight: 700">Movimiento de transferencia realizada exitosamente...</div>',
              });
              this.router.navigate([rutas.logistica_transferencias]);
            },
            error: (errorData) => {
              Notiflix.Loading.remove();
              console.error('Error en alguna de las operaciones:', errorData);
            },
            complete: () => {},
          });

*/
