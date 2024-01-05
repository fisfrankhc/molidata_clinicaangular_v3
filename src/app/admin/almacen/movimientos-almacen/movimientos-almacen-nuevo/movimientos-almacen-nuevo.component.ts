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
import { forkJoin } from 'rxjs';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenDetalleService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-detalle.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { StockService } from 'src/app/shared/services/logistica/stock/stock.service';
import { ComprasItemService } from 'src/app/shared/services/logistica/compra/compras-item.service';
import { ComprasService } from 'src/app/shared/services/logistica/compra/compras.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

interface Producto {
  idobtenido: string;
  codigoobtenido: string;
  producto: number; //*
  nombrepobtenido: string;
  cantidad: number; //*
  medida: number; //*
  vencimiento: any; //*
  lote: string; //*
  peso: number; //*
  //precio: number; //*
  subtotalagregado: string;
  movimiento: number; //*
  condicion: string | null;
}
interface data {
  value: string;
}

@Component({
  selector: 'app-movimientos-almacen-nuevo',
  templateUrl: './movimientos-almacen-nuevo.component.html',
  styleUrls: ['./movimientos-almacen-nuevo.component.scss'],
})
export class MovimientosAlmacenNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  public ruta = rutas;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService,
    private productoService: ProductoService,
    private stockService: StockService,
    private medidaService: MedidaService,
    private comprasService: ComprasService,
    private comprasItemService: ComprasItemService,
    private datePipe: DatePipe
  ) {}

  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    const initialForm = this.fb.group({
      movimientoDetalle: this.fb.group({
        idsucursal_origen: ['', Validators.required],
        sucursal_origen: ['', Validators.required],
        tipo_origen: ['', Validators.required],
        movimiento_origen: ['', Validators.required],
        codigo_origen: [''],
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
        fechabuscado: [''],
        lotebuscado: [''],
        pesobuscado: [''],
      }),
      listaMovimiento: this.fb.array([]), // FormArray para la lista de compra
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
    this.filteresOption();
    this.sucursalAll();
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
            fecha_buscado: '',
            lote_buscado: '',
            peso_buscado: '',
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
  /*   dataMovimientos: any;
  movimientosAll() {
    this.movimientosAlmacenService.getMovimientosAll().subscribe({
      next: (dataMovimientos: any) => {
        this.dataMovimientos = dataMovimientos;
        console.log(this.dataMovimientos);
      },
      error: () => {},
      complete: () => {},
    });
  } */

  datosSUC: any;
  nombreSucursal!: string;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;

        // Realiza la lógica para obtener el nombre de la sucursal aquí
        const sucursalEncontrada = this.datosSUC.find(
          (sucursal: any) => sucursal.suc_id === this.usersucursal
        );
        this.form.get('movimientoDetalle')?.patchValue({
          idsucursal_origen: sucursalEncontrada.suc_id,
          sucursal_origen: sucursalEncontrada.suc_nombre,
        });
        /*         this.nombreSucursal = sucursalEncontrada
          ? sucursalEncontrada.suc_nombre
          : ''; */
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datosSTOCK: any;

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
      return this.datoPRODUCTO.map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        descripcion: option.prod_descripcion,
      }));
    }

    const filterValue = value.toLowerCase();
    return this.datoPRODUCTO
      .filter((option) =>
        option.prod_nombre.toLowerCase().includes(filterValue)
      )
      .map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        descripcion: option.prod_descripcion,
      }));
  }

  tipoOrigen: data[] = [{ value: 'INGRESO' }, { value: 'SALIDA' }];
  movmientoOrigen1: data[] = [{ value: 'STOCK INICIAL' }, { value: 'COMPRA' }];
  movmientoOrigen2: data[] = [{ value: 'VENTA' }, { value: 'MERMA' }];

  //PARA EL 2DO FORMGROUP
  onProductSelected(event: any) {
    const selectedProduct = event.option.value;
    //console.log('Este el valor de selectedProduct: ' + selectedProduct);
    const productoSeleccionado = this.datoPRODUCTO.find(
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
        fecha_buscado: '',
        lote_buscado: '',
        peso_buscado: '',
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
        vencimiento: '',
        lote: '',
        peso: '',
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
          vencimiento: this.datePipe.transform(
            productoBuscado?.get('fechabuscado')?.value,
            'yyyy/MM/dd'
          ),
          lote: productoBuscado?.get('lotebuscado')?.value,
          peso: productoBuscado?.get('pesobuscado')?.value,
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

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  //ID DE VENTA OBTENIDA GUARDADA
  movimiento: any;
  dataCOMPRA: any;
  dataPROCOMPRA: any[] = [];
  productosNoEncontrados: number[] = [];
  dataOperacionCompra: any;
  ConfirmarMovimiento() {
    const movimientoData = {
      fecha: this.fechaFormateada,
      tipo: this.form.value.movimientoDetalle['tipo_origen'],
      usuario: this.userid,
      sucursal: this.usersucursal,
      origen: this.form.value.movimientoDetalle['movimiento_origen'],
      origencodigo: this.form.value.movimientoDetalle['codigo_origen'],
      observaciones: '',
    };
    const cantidadesPorId: {
      [id: string]: {
        almacen: number;
        producto: number;
        cantidad: number;
        medida: string;
      };
    } = {};

    if (
      this.form.get('movimientoDetalle')?.valid &&
      this.form.get('listaMovimiento')?.valid
    ) {
      //console.log(movimientoData);
      //console.log(this.form.value);
      console.log(this.form.get('listaMovimiento')?.value);
      const valormovimiento =
        this.form.get('movimientoDetalle')?.value.movimiento_origen;
      const valorCodigo =
        this.form.get('movimientoDetalle')?.value.codigo_origen;
      if (movimientoData.tipo === 'INGRESO') {
        if (valormovimiento === 'COMPRA') {
          if (valorCodigo) {
            //BUSCAMOS LA COMPRA
            this.comprasService.getCompra(valorCodigo).subscribe({
              next: (response: any) => {
                this.dataCOMPRA = response;
                if (this.dataCOMPRA == 'no hay resultados') {
                  alert('LA COMPRA NO EXISTE');
                } else {
                  this.dataCOMPRA = response[0];
                  console.log(this.dataCOMPRA);

                  forkJoin([
                    this.comprasItemService.getCompraItems(
                      this.dataCOMPRA.compra_id
                    ),
                    // Otras llamadas asincrónicas que puedas tener
                  ]).subscribe({
                    next: ([compraItemsResponse /*otros resultados*/]: any) => {
                      // Código que se ejecuta cuando todas las llamadas asincrónicas se completan
                      this.dataPROCOMPRA = compraItemsResponse;
                      console.log(this.dataPROCOMPRA);

                      // Verificar productos aquí
                      const productosMovimiento =
                        this.form.get('listaMovimiento')?.value;
                      const todosProductosPresentes = productosMovimiento.every(
                        (productoMovimiento: any) => {
                          return (
                            this.dataPROCOMPRA &&
                            this.dataPROCOMPRA.some(
                              (productoCompra: any) =>
                                productoCompra.producto_id ===
                                productoMovimiento.producto
                            )
                          );
                        }
                      );
                      // Marcar productos no encontrados directamente en el arreglo
                      productosMovimiento.forEach(
                        (producto: any, index: any) => {
                          producto.encontrado = this.dataPROCOMPRA.some(
                            (productoCompra: any) =>
                              productoCompra.producto_id === producto.producto
                          );
                        }
                      );
                      //SI ESTAN TODOS LOS PRODUCTOS
                      if (todosProductosPresentes) {
                        console.log(
                          'Todos los productos están presentes en la compra'
                        );
                        //PARA VERIFICAR LAS CANTIDADES DE LOS PRODUCTOS, QUE NO SEAN MAYORES
                        const algunProductoSuperaMontoCompra =
                          productosMovimiento.some(
                            (productoMovimiento: any) => {
                              const productoCompra = this.dataPROCOMPRA.find(
                                (productoCompra: any) =>
                                  productoCompra.producto_id ===
                                  productoMovimiento.producto
                              );
                              if (productoCompra) {
                                const cantidadMovimiento = parseInt(
                                  productoMovimiento.cantidad
                                );
                                const cantidadCompra = parseFloat(
                                  productoCompra.cantidad
                                );
                                if (cantidadMovimiento > cantidadCompra) {
                                  // Aplicar estilo al producto que supera el monto de compra
                                  productoMovimiento.estilo = 'producto-mayor';
                                  return true; // Al menos un producto supera al monto de compra
                                }
                              }
                              return false;
                            }
                          );
                        if (algunProductoSuperaMontoCompra) {
                          console.log(
                            'Al menos un producto supera la cantidad de stock'
                          );
                          Swal.fire({
                            title:
                              'Al menos un producto supera la cantidad de stock',
                            icon: 'error',
                            timer: 2500,
                          });
                        }
                        //SI NO HAY PRODUCTOS QUE SUPERAN LA COMPRA
                        else {
                          console.log('No hay ningún problema');
                          this.movimientosAlmacenService
                            .postMovimientos(movimientoData)
                            .subscribe({
                              next: (response) => {
                                this.movimiento = response;
                                console.log(
                                  'Movimiento registrada con éxito:',
                                  this.movimiento
                                );
                                this.form.value.listaMovimiento.forEach(
                                  (producto: Producto) => {
                                    producto.movimiento = this.movimiento;

                                    //PARA ALMACENAR LOS PRODUCTOS
                                    this.movimientosAlmacenDetalleService
                                      .postMovimientosDetalle(producto)
                                      .subscribe({
                                        next: (response) => {
                                          console.log(
                                            'Entrada registrada con éxito:',
                                            response
                                          );
                                        },
                                        error: (errorData) => {
                                          console.error(
                                            'Error al enviar la solicitud POST de MOVIMIENTODETALLE:',
                                            errorData
                                          );
                                        },
                                        complete: () => {},
                                      });

                                    //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
                                    const idobtenido = producto.idobtenido;
                                    const cantidad = +producto.cantidad;
                                    cantidadesPorId[idobtenido] =
                                      cantidadesPorId[idobtenido] || {
                                        almacen: this.usersucursal,
                                        producto: producto.producto,
                                        cantidad: 0,
                                        medida: producto.medida,
                                      };
                                    cantidadesPorId[idobtenido].cantidad +=
                                      cantidad;
                                  }
                                );

                                Object.keys(cantidadesPorId).forEach((id) => {
                                  this.stockService.getStockAll().subscribe({
                                    next: (datosSTOCK: any) => {
                                      this.datosSTOCK = datosSTOCK;

                                      const sucursalFindUpdate =
                                        this.datosSTOCK.find(
                                          (stock: any) =>
                                            stock.almacen_id ===
                                              this.usersucursal &&
                                            stock.producto_id ===
                                              cantidadesPorId[id].producto
                                        );
                                      if (movimientoData.tipo === 'INGRESO') {
                                        if (sucursalFindUpdate) {
                                          sucursalFindUpdate.cantidad =
                                            Number(
                                              sucursalFindUpdate.cantidad
                                            ) +
                                            Number(
                                              cantidadesPorId[id].cantidad
                                            );
                                          //console.log(sucursalFindUpdate);
                                          const stockActualizar = {
                                            id: sucursalFindUpdate.stock_id,
                                            almacen:
                                              cantidadesPorId[id].almacen,
                                            producto:
                                              cantidadesPorId[id].producto,
                                            cantidad:
                                              sucursalFindUpdate.cantidad,
                                            medida: cantidadesPorId[id].medida,
                                            condicion: 'MOVIMIENTO-ALMACEN',
                                          };
                                          //console.log(stockActualizar);
                                          this.stockService
                                            .updatedStock(stockActualizar)
                                            .subscribe({
                                              next: (response) => {
                                                console.log(
                                                  'Respuesta de UpdatedPost interno: ' +
                                                    response
                                                );
                                              },
                                              error: (errorData) => {
                                                console.error(errorData);
                                              },
                                              complete: () => {},
                                            });
                                        } else {
                                          //REGISTRAMOS
                                          const stockPostNew = {
                                            almacen:
                                              cantidadesPorId[id].almacen,
                                            producto:
                                              cantidadesPorId[id].producto,
                                            cantidad:
                                              cantidadesPorId[id].cantidad,
                                            medida: cantidadesPorId[id].medida,
                                            condicion: 'MOVIMIENTO-ALMACEN',
                                          };

                                          this.stockService
                                            .postStock(stockPostNew)
                                            .subscribe({
                                              next: (response) => {
                                                console.log(
                                                  'Respuesta de PostStock interno: ' +
                                                    response
                                                );
                                              },
                                              error: (errorData) => {
                                                console.error(errorData);
                                              },
                                              complete: () => {},
                                            });
                                        }
                                      }
                                    },
                                    error: () => {},
                                    complete: () => {},
                                  });
                                });
                              },
                              error: (errorData) => {
                                console.error(errorData);
                              },
                              complete: () => {
                                this.router.navigate([
                                  '/almacen/movimientos-almacen',
                                ]);
                              },
                            });
                        }
                      }
                      //SI NO ESTAN TODOS LOS PRODUCTOS
                      else {
                        Swal.fire({
                          title: 'Un producto no corresponde a la compra',
                          icon: 'error',
                          timer: 2500,
                        });
                      }
                    },
                    error: (errorData) => {},
                    complete: () => {},
                  });
                }
              },
              error: (errorData) => {},
              complete: () => {},
            });
            console.log(valorCodigo);
          } else {
            alert('NO HAY INGRESADO UN CODIGO DE COMPRA');
          }
        } else {
          //SI ES DE TIPO STOCK INICIAL
          this.movimientosAlmacenService
            .postMovimientos(movimientoData)
            .subscribe({
              next: (response) => {
                this.movimiento = response;
                console.log(
                  'Movimiento registrada con éxito:',
                  this.movimiento
                );
                this.form.value.listaMovimiento.forEach(
                  (producto: Producto) => {
                    producto.movimiento = this.movimiento;

                    //PARA ALMACENAR LOS PRODUCTOS
                    this.movimientosAlmacenDetalleService
                      .postMovimientosDetalle(producto)
                      .subscribe({
                        next: (response) => {
                          console.log(
                            'Entrada registrada con éxito:',
                            response
                          );
                        },
                        error: (errorData) => {
                          console.error(
                            'Error al enviar la solicitud POST de MOVIMIENTODETALLE:',
                            errorData
                          );
                        },
                        complete: () => {},
                      });

                    //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
                    const idobtenido = producto.idobtenido;
                    const cantidad = +producto.cantidad;
                    cantidadesPorId[idobtenido] = cantidadesPorId[
                      idobtenido
                    ] || {
                      almacen: this.usersucursal,
                      producto: producto.producto,
                      cantidad: 0,
                      medida: producto.medida,
                    };
                    cantidadesPorId[idobtenido].cantidad += cantidad;
                  }
                );

                Object.keys(cantidadesPorId).forEach((id) => {
                  this.stockService.getStockAll().subscribe({
                    next: (datosSTOCK: any) => {
                      this.datosSTOCK = datosSTOCK;

                      const sucursalFindUpdate = this.datosSTOCK.find(
                        (stock: any) =>
                          stock.almacen_id === this.usersucursal &&
                          stock.producto_id === cantidadesPorId[id].producto
                      );
                      if (movimientoData.tipo === 'INGRESO') {
                        if (sucursalFindUpdate) {
                          sucursalFindUpdate.cantidad =
                            Number(sucursalFindUpdate.cantidad) +
                            Number(cantidadesPorId[id].cantidad);
                          //console.log(sucursalFindUpdate);
                          const stockActualizar = {
                            id: sucursalFindUpdate.stock_id,
                            almacen: cantidadesPorId[id].almacen,
                            producto: cantidadesPorId[id].producto,
                            cantidad: sucursalFindUpdate.cantidad,
                            medida: cantidadesPorId[id].medida,
                            condicion: 'MOVIMIENTO-ALMACEN',
                          };
                          //console.log(stockActualizar);
                          this.stockService
                            .updatedStock(stockActualizar)
                            .subscribe({
                              next: (response) => {
                                console.log(
                                  'Respuesta de UpdatedPost interno: ' +
                                    response
                                );
                              },
                              error: (errorData) => {
                                console.error(errorData);
                              },
                              complete: () => {},
                            });
                        } else {
                          //REGISTRAMOS
                          const stockPostNew = {
                            almacen: cantidadesPorId[id].almacen,
                            producto: cantidadesPorId[id].producto,
                            cantidad: cantidadesPorId[id].cantidad,
                            medida: cantidadesPorId[id].medida,
                            condicion: 'MOVIMIENTO-ALMACEN',
                          };

                          this.stockService.postStock(stockPostNew).subscribe({
                            next: (response) => {
                              console.log(
                                'Respuesta de PostStock interno: ' + response
                              );
                            },
                            error: (errorData) => {
                              console.error(errorData);
                            },
                            complete: () => {},
                          });
                        }
                      }
                    },
                    error: () => {},
                    complete: () => {},
                  });
                });
              },
              error: (errorData) => {
                console.error(errorData);
              },
              complete: () => {
                this.router.navigate(['/almacen/movimientos-almacen']);
              },
            });
        }
      } else if (movimientoData.tipo === 'SALIDA') {
        this.movimientosAlmacenService
          .postMovimientos(movimientoData)
          .subscribe({
            next: (response) => {
              this.movimiento = response;
              console.log('Movimiento registrada con éxito:', this.movimiento);
              this.form.value.listaMovimiento.forEach((producto: Producto) => {
                producto.movimiento = this.movimiento;

                //PARA ALMACENAR LOS PRODUCTOS
                this.movimientosAlmacenDetalleService
                  .postMovimientosDetalle(producto)
                  .subscribe({
                    next: (response) => {
                      console.log('Entrada registrada con éxito:', response);
                    },
                    error: (errorData) => {
                      console.error(
                        'Error al enviar la solicitud POST de MOVIMIENTODETALLE:',
                        errorData
                      );
                    },
                    complete: () => {},
                  });

                //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
                const idobtenido = producto.idobtenido;
                const cantidad = +producto.cantidad;
                cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
                  almacen: this.usersucursal,
                  producto: producto.producto,
                  cantidad: 0,
                  medida: producto.medida,
                };
                cantidadesPorId[idobtenido].cantidad += cantidad;
              });

              Object.keys(cantidadesPorId).forEach((id) => {
                //console.log(`Suma de cantidades de idobtenido ${id}: ${cantidadesPorId[id]}`);
                //console.log(cantidadesPorId[id].producto);
                //console.log(cantidadesPorId[id]);

                this.stockService.getStockAll().subscribe({
                  next: (datosSTOCK: any) => {
                    this.datosSTOCK = datosSTOCK;

                    const sucursalFindUpdate = this.datosSTOCK.find(
                      (stock: any) =>
                        stock.almacen_id === this.usersucursal &&
                        stock.producto_id === cantidadesPorId[id].producto
                    );

                    //PROCEDEMOS A EJECUTAR EL CODIGO
                    if (sucursalFindUpdate) {
                      sucursalFindUpdate.cantidad =
                        Number(sucursalFindUpdate.cantidad) -
                        Number(cantidadesPorId[id].cantidad);
                      //console.log(sucursalFindUpdate);
                      const stockActualizarVenta = {
                        id: sucursalFindUpdate.stock_id,
                        almacen: cantidadesPorId[id].almacen,
                        producto: cantidadesPorId[id].producto,
                        cantidad: sucursalFindUpdate.cantidad,
                        medida: cantidadesPorId[id].medida,
                        condicion: 'ACTUALIZAR',
                      };
                      //console.log(stockActualizarVenta);
                      this.stockService
                        .updatedStock(stockActualizarVenta)
                        .subscribe({
                          next: (response) => {
                            console.log(
                              'Respuesta de UpdatedPost interno 2: ' + response
                            );
                          },
                          error: (errorData) => {
                            console.error(errorData);
                          },
                          complete: () => {},
                        });
                    }
                  },
                  error: () => {},
                  complete: () => {},
                });
              });
            },
            error: (errorData) => {
              console.error(errorData);
            },
            complete: () => {
              this.router.navigate(['/almacen/movimientos-almacen']);
            },
          });
      }

      /* 
      this.movimientosAlmacenService.postMovimientos(movimientoData).subscribe({
        next: (response) => {
          this.movimiento = response;
          console.log('Movimiento registrada con éxito:', this.movimiento);
          this.form.value.listaMovimiento.forEach((producto: Producto) => {
            producto.movimiento = this.movimiento;

            //PARA ALMACENAR LOS PRODUCTOS
            this.movimientosAlmacenDetalleService
              .postMovimientosDetalle(producto)
              .subscribe({
                next: (response) => {
                  console.log('Entrada registrada con éxito:', response);
                },
                error: (errorData) => {
                  console.error(
                    'Error al enviar la solicitud POST de MOVIMIENTODETALLE:',
                    errorData
                  );
                },
                complete: () => {},
              });

            //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
            const idobtenido = producto.idobtenido;
            const cantidad = +producto.cantidad;
            cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
              almacen: this.usersucursal,
              producto: producto.producto,
              cantidad: 0,
              medida: producto.medida,
            };
            cantidadesPorId[idobtenido].cantidad += cantidad;
          });

          Object.keys(cantidadesPorId).forEach((id) => {
            //console.log(`Suma de cantidades de idobtenido ${id}: ${cantidadesPorId[id]}`);
            //console.log(cantidadesPorId[id].producto);
            //console.log(cantidadesPorId[id]);

            this.stockService.getStockAll().subscribe({
              next: (datosSTOCK: any) => {
                this.datosSTOCK = datosSTOCK;

                const sucursalFindUpdate = this.datosSTOCK.find(
                  (stock: any) =>
                    stock.almacen_id === this.usersucursal &&
                    stock.producto_id === cantidadesPorId[id].producto
                );
                if (movimientoData.tipo === 'INGRESO') {
                  if (sucursalFindUpdate) {
                    sucursalFindUpdate.cantidad =
                      Number(sucursalFindUpdate.cantidad) +
                      Number(cantidadesPorId[id].cantidad);
                    //console.log(sucursalFindUpdate);
                    const stockActualizar = {
                      id: sucursalFindUpdate.stock_id,
                      almacen: cantidadesPorId[id].almacen,
                      producto: cantidadesPorId[id].producto,
                      cantidad: sucursalFindUpdate.cantidad,
                      medida: cantidadesPorId[id].medida,
                      condicion: 'MOVIMIENTO-ALMACEN',
                    };
                    //console.log(stockActualizar);
                    this.stockService.updatedStock(stockActualizar).subscribe({
                      next: (response) => {
                        console.log(
                          'Respuesta de UpdatedPost interno: ' + response
                        );
                      },
                      error: (errorData) => {
                        console.error(errorData);
                      },
                      complete: () => {},
                    });
                  } else {
                    //REGISTRAMOS
                    const stockPostNew = {
                      almacen: cantidadesPorId[id].almacen,
                      producto: cantidadesPorId[id].producto,
                      cantidad: cantidadesPorId[id].cantidad,
                      medida: cantidadesPorId[id].medida,
                      condicion: 'MOVIMIENTO-ALMACEN',
                    };

                    this.stockService.postStock(stockPostNew).subscribe({
                      next: (response) => {
                        console.log(
                          'Respuesta de PostStock interno: ' + response
                        );
                      },
                      error: (errorData) => {
                        console.error(errorData);
                      },
                      complete: () => {},
                    });
                  }
                } else if (movimientoData.tipo === 'SALIDA') {
                  if (sucursalFindUpdate) {
                    sucursalFindUpdate.cantidad =
                      Number(sucursalFindUpdate.cantidad) -
                      Number(cantidadesPorId[id].cantidad);
                    //console.log(sucursalFindUpdate);
                    const stockActualizarVenta = {
                      id: sucursalFindUpdate.stock_id,
                      almacen: cantidadesPorId[id].almacen,
                      producto: cantidadesPorId[id].producto,
                      cantidad: sucursalFindUpdate.cantidad,
                      medida: cantidadesPorId[id].medida,
                      condicion: 'ACTUALIZAR',
                    };
                    //console.log(stockActualizarVenta);
                    this.stockService
                      .updatedStock(stockActualizarVenta)
                      .subscribe({
                        next: (response) => {
                          console.log(
                            'Respuesta de UpdatedPost interno 2: ' + response
                          );
                        },
                        error: (errorData) => {
                          console.error(errorData);
                        },
                        complete: () => {},
                      });
                  }
                }
              },
              error: () => {},
              complete: () => {},
            });
          });
        },
        error: (errorData) => {
          console.error(errorData);
        },
        complete: () => {
          this.router.navigate(['/almacen/movimientos-almacen']);
        },
      });
    */
    } else {
      alert('Faltan datos');
    }
  }

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
}
