import { Component, OnInit } from '@angular/core';
import { ElementRef, ViewChild, HostListener } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { rutas } from 'src/app/shared/routes/rutas';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';
import { ComprasService } from 'src/app/shared/services/logistica/compra/compras.service';
import { ComprasDetalleService } from 'src/app/shared/services/logistica/compra/compras-detalle.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { StockCentralService } from 'src/app/shared/services/logistica/stock-central/stock-central.service';
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';

import { GeneralService } from 'src/app/shared/services/general.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators';

import * as Notiflix from 'notiflix';
import Swal from 'sweetalert2';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';

interface Producto {
  idobtenido: string;
  codigoobtenido: string;
  producto: number; //*
  nombrepobtenido: string;
  cantidad: number; //*
  medida: number; //*
  precio: number; //*
  subtotalagregado: string;
  compra: number; //*
}
interface data {
  value: string;
}

@Component({
  selector: 'app-compras-nuevo',
  templateUrl: './compras-nuevo.component.html',
  styleUrls: ['./compras-nuevo.component.scss'],
})
export class ComprasNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private comprasService: ComprasService,
    private comprasDetalleService: ComprasDetalleService,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private generalService: GeneralService,
    private stockCentralService: StockCentralService,
    private datePipe: DatePipe,
    private stockService: StockService,
    private sucursalService: SucursalService
  ) {}

  public ruta = rutas;
  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    const initialForm = this.fb.group({
      proveedorDetalle: this.fb.group({
        id: ['', Validators.required],
        documento_numero: [''],
        razon_social: [''],
        proveedor_descripcion: [''],
      }),
      compraDetalle: this.fb.group({
        compra_moneda: ['', Validators.required],
        tipo_pago: ['', Validators.required],
        idempresa: ['', Validators.required],
        empresa: ['', Validators.required],
      }),
      comprobanteDetalle: this.fb.group({
        comprobante_tipo: ['', Validators.required],
        comprobante_serie: ['', Validators.required],
        comprobante_numero: ['', Validators.required],
        //suc_destino: ['', Validators.required],
      }),
      productoBuscado: this.fb.group({
        idbuscado: [''],
        codigobuscado: [''],
        nombrebuscado: [''],
        nombrebproducto: [''],
        preciobuscado: [''],
        medidabuscado: [''],
        medidanombrebuscado: [''],
        cantidadbuscado: [''],
      }),
      listaCompra: this.fb.array([]), // FormArray para la lista de compra
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
            nombrebproducto: '',
            preciobuscado: '',
            medidabuscado: '',
            medidanombrebuscado: '',
            cantidadbuscado: '',
          });
        }
      });

    this.medidasAll();
    this.filteresOption();
    this.empresaAll();
    this.sucursalAll();
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

  datoSUC: any[] = [];
  sucursalAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datoSUC: any) => {
        this.datoSUC = datoSUC;
      },
      error: () => {},
      complete: () => {},
    });
  }
  comprobanteTipo: data[] = [{ value: 'BOLETA' }, { value: 'FACTURA' }];

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

  datoPROVEEDOR: any[] = [];
  //PRIMER FORMGROUP
  obtenerProveedor() {
    const documento = this.form.get('proveedorDetalle.documento_numero')?.value;

    if (documento && (documento.length === 8 || documento.length === 11)) {
      this.proveedoresService.getProveedoresAll().subscribe({
        next: (response: any) => {
          this.datoPROVEEDOR = response;

          const proveedorEncontrado = this.datoPROVEEDOR.find(
            (proveedor) => proveedor.documento_numero === documento
          );

          if (proveedorEncontrado) {
            this.form
              .get('proveedorDetalle.id')
              ?.patchValue(proveedorEncontrado.proveedor_id);
            this.form
              .get('proveedorDetalle.razon_social')
              ?.patchValue(proveedorEncontrado.razon_social);
            this.form
              .get('proveedorDetalle.proveedor_descripcion')
              ?.patchValue(proveedorEncontrado.proveedor_descripcion);
          } else {
            // En caso de no encontrar el cliente, puedes limpiar los campos
            this.form.get('proveedorDetalle.id')?.patchValue('');
            this.form
              .get('proveedorDetalle.razon_social')
              ?.patchValue('Cliente no encontrado');
            this.form
              .get('proveedorDetalle.proveedor_descripcion')
              ?.patchValue('-');
          }
        },
        error: (_errorData) => {},
        complete: () => {},
      });
    } else {
      this.form.get('proveedorDetalle.id')?.patchValue('');
      this.form.get('proveedorDetalle.razon_social')?.patchValue('');
      this.form.get('proveedorDetalle.proveedor_descripcion')?.patchValue('');
    }
  }

  compraMoneda: data[] = [
    { value: 'SOLES' },
    { value: 'DOLARES' },
    { value: 'PESOS ARGENTINOS' },
  ];
  tipoPago: data[] = [{ value: 'CONTADO' }, { value: 'CREDITO' }];
  datosEMP: any;
  empresaAll() {
    this.generalService.getDatosEmpresa().subscribe({
      next: (datosEMP: any) => {
        this.datosEMP = datosEMP[0];
        this.form.get('compraDetalle')?.patchValue({
          idempresa: this.datosEMP.empresa_id,
          empresa: this.datosEMP.nombre_comercial,
        });
      },
      error: () => {},
      complete: () => {},
    });
  }

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
      });
    }
    console.log(this.form.value.productoBuscado);
  }

  //PARA EL TERCER FORMGROUP
  agregarALista() {
    if (this.form.get('productoBuscado')?.valid) {
      const productoBuscado = this.form.get('productoBuscado');
      const listaCompra = this.form.get('listaCompra') as FormArray;

      // Crea un nuevo FormGroup para el producto
      const nuevoProducto = this.fb.group({
        idobtenido: ['', Validators.required],
        codigoobtenido: ['', Validators.required],
        producto: ['', Validators.required],
        nombrepobtenido: ['', Validators.required],
        cantidad: [0, Validators.required],
        medida: [''],
        precio: [0, Validators.required],
        subtotalagregado: [0, Validators.required],
        descuento: [0],
      });

      // Copia los valores del producto buscado al nuevo producto
      nuevoProducto.patchValue({
        idobtenido: productoBuscado?.get('idbuscado')?.value,
        codigoobtenido: productoBuscado?.get('codigobuscado')?.value,
        producto: productoBuscado?.get('nombrebuscado')?.value,
        nombrepobtenido: productoBuscado?.get('nombrebproducto')?.value,
        cantidad: +productoBuscado?.get('cantidadbuscado')?.value,
        medida: productoBuscado?.get('medidabuscado')?.value,
        precio: +productoBuscado?.get('preciobuscado')?.value,
        descuento: 0,
        subtotalagregado:
          +productoBuscado?.get('preciobuscado')?.value *
          +productoBuscado?.get('cantidadbuscado')?.value,
      });

      // Agrega el nuevo producto a la lista de compra
      listaCompra.push(nuevoProducto);
      //console.log(listaCompra.controls);

      this.calcularSubtotal();

      this.form.get('productoBuscado')?.reset();
    } else {
      alert('Se necesita un producto');
    }
  }

  eliminarProducto(index: number) {
    const listaCompra = this.form.get('listaCompra') as FormArray;
    listaCompra.removeAt(index);

    this.calcularSubtotal();
  }

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );
  //ID DE VENTA OBTENIDA GUARDADA
  compra: any;

  cotizacionClick() {
    const compraData = {
      proveedor: this.form.value.proveedorDetalle['id'],
      fecha: this.fechaFormateada,
      moneda: this.form.value.compraDetalle['compra_moneda'],
      empresa: this.form.value.compraDetalle['idempresa'],
      pago: this.form.value.compraDetalle['tipo_pago'],
      usuario: this.userid,
      proceso: 'COTIZACION',
      comprobante: '',
      seriecomprobante: '',
      numerocomprobante: '',
      destino: '',
    };
    if (this.form.valid) {
      if (this.form.get('listaCompra')?.value == '') {
        alert('No ha añadido productos');
      } else {
        Notiflix.Loading.pulse('Guardando la compra para almacen central...');
        this.comprasService.postCompras(compraData).subscribe({
          next: (response) => {
            this.compra = response;

            this.form.value.listaCompra.forEach((producto: Producto) => {
              producto.compra = this.compra;

              this.comprasDetalleService
                .postComprasDetalle(producto)
                .subscribe({
                  next: (response) => {
                    console.log('Entrada registrada con éxito:', response);
                  },
                  error: (errorData) => {
                    console.error(
                      'Error al enviar la solicitud POST de COMPRADETALLE:',
                      errorData
                    );
                  },
                  complete: () => {},
                });
            });
          },
          error: (errorData) => {
            Notiflix.Loading.remove();
            console.error(
              'Error al enviar la solicitud POST de COMPRA:',
              errorData
            );
          },
          complete: () => {
            Notiflix.Loading.remove();
            //this.router.navigate(['/logistica/compra']);
            this.router.navigate([rutas.logistica_compra]);
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
              html: '<div style="font-size: 15px; font-weight: 700">Cotizacion registrada exitosamente</div>',
            });
          },
        });
      }
    }
  }
  //10416820959
  dataFindStock: any;
  ConfirmarCompraClick() {
    if (this.form.valid) {
      if (this.form.get('listaCompra')?.value == '') {
        alert('No ha añadido productos');
      } else {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger',
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire({
            title: 'Elija una opci&oacute;n',
            //text: "You won't be able to revert this!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'PARA SUCURSAL',
            cancelButtonText: 'ALMACEN CENTRAL',
            reverseButtons: true,
          })
          .then(async (result) => {
            //PARA SUCURSAL
            if (result.isConfirmed) {
              const inputOptions: any = {};
              for (const data of this.datoSUC) {
                inputOptions[data.suc_id] = data.suc_nombre;
              }
              const { value: sucursalIDE } = await Swal.fire({
                title: 'SELECCIONE UNA SUCURSAL',
                input: 'select',
                inputPlaceholder: 'Seleccione...',
                inputOptions: inputOptions,
                showCancelButton: true,
              });
              if (sucursalIDE) {
                //Swal.fire(`You selected: ${sucursalIDE}`);
                const compraData = {
                  proveedor: this.form.value.proveedorDetalle['id'],
                  fecha: this.fechaFormateada,
                  moneda: this.form.value.compraDetalle['compra_moneda'],
                  empresa: this.form.value.compraDetalle['idempresa'],
                  pago: this.form.value.compraDetalle['tipo_pago'],
                  usuario: this.userid,
                  proceso: 'CONFIRMADO',
                  comprobante:
                    this.form.value.comprobanteDetalle['comprobante_tipo'],
                  seriecomprobante:
                    this.form.value.comprobanteDetalle['comprobante_serie'],
                  numerocomprobante:
                    this.form.value.comprobanteDetalle['comprobante_numero'],
                  destino: sucursalIDE,
                };
                console.log(compraData);
                Notiflix.Loading.pulse('Guardando la compra para sucursal...');
                this.comprasService.postCompras(compraData).subscribe({
                  next: (response) => {
                    this.compra = response;
                    console.log('Compra registrada con éxito:', this.compra);
                    this.form.value.listaCompra.forEach(
                      (producto: Producto) => {
                        producto.compra = this.compra;

                        //GUARDAMOS INFORMACION EN COMPRA_DETALLE
                        this.comprasDetalleService
                          .postComprasDetalle(producto)
                          .subscribe({
                            next: (response) => {
                              console.log(
                                'Entrada registrada con éxito:',
                                response
                              );
                            },
                            error: (errorData) => {
                              Notiflix.Loading.remove();
                              console.error(
                                'Error al enviar la solicitud POST de COMPRADETALLE:',
                                errorData
                              );
                            },
                            complete: () => {},
                          });

                        //GUARDAMOS CADA PRODUCTRO EN STOCK
                        const productosAgrupados: { [id: string]: Producto } =
                          {};
                        this.form.value.listaCompra.forEach(
                          (producto: Producto) => {
                            const idProducto = producto.idobtenido;
                            if (productosAgrupados[idProducto]) {
                              // Si ya existe el producto en la lista agrupada, se suma la cantidad
                              productosAgrupados[idProducto].cantidad +=
                                producto.cantidad;
                              productosAgrupados[idProducto].subtotalagregado +=
                                producto.subtotalagregado;
                            } else {
                              // Si no existe, se agrega el producto a la lista agrupada
                              productosAgrupados[idProducto] = { ...producto };
                            }
                          }
                        );

                        // Ahora productosAgrupados contiene los productos agrupados por ID
                        Object.values(productosAgrupados).forEach(
                          (producto: Producto) => {
                            producto.compra = this.compra;

                            const dataStockPost = {
                              almacen: sucursalIDE,
                              producto: producto.producto,
                              cantidad: producto.cantidad,
                              medida: producto.medida,
                            };

                            this.stockService.getStockAll().subscribe({
                              next: (responseFind: any) => {
                                //SI ES UN TABLA VACIA, REGISTRAMOS EL PRIMER DATO DE LA TABLA
                                if (responseFind == 'no hay resultados') {
                                  this.stockService
                                    .postStock(dataStockPost)
                                    .subscribe({
                                      next: (responsePostStock) => {
                                        console.log(
                                          'Entrada registrada con éxito:',
                                          responsePostStock
                                        );
                                      },
                                      error: (errorData) => {
                                        Notiflix.Loading.remove();
                                        console.error(
                                          'Error al enviar la solicitud POST PRIMERA de STOCK A ALMACEN 1:',
                                          errorData
                                        );
                                      },
                                      complete: () => {},
                                    });
                                }
                                //SI NO ES UNA TABLA VACIA, YA QUE BUSQUE
                                else {
                                  this.dataFindStock = responseFind;
                                  //buscamos algun producto que se encuentre en la tabla
                                  const StockEncontrado =
                                    this.dataFindStock.find(
                                      (stoc: any) =>
                                        stoc.producto_id ===
                                          producto.producto &&
                                        stoc.almacen_id === sucursalIDE
                                    );
                                  //SI ENCONTRAMOS HACEMOS EL PUT
                                  if (StockEncontrado) {
                                    const nuevostock =
                                      Number(StockEncontrado.cantidad) +
                                      Number(producto.cantidad);

                                    const dataStockUpdate = {
                                      producto: producto.producto,
                                      cantidad: nuevostock,
                                      condicion: 'COMPRA-NUEVA',
                                    };

                                    this.stockService
                                      .updatedStock(dataStockUpdate)
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
                                  //SI NO SE ENCUENTRA LA DATA QUE COINCIDA
                                  else {
                                    this.stockService
                                      .postStock(dataStockPost)
                                      .subscribe({
                                        next: (responsePostStock) => {
                                          console.log(
                                            'Entrada registrada con éxito:',
                                            responsePostStock
                                          );
                                        },
                                        error: (errorData) => {
                                          Notiflix.Loading.remove();
                                          console.error(
                                            'Error al enviar la solicitud POST de STOCK:',
                                            errorData
                                          );
                                        },
                                        complete: () => {},
                                      });
                                  }
                                }
                              },
                              error: () => {},
                              complete: () => {},
                            });
                          }
                        );
                      }
                    );

                    Notiflix.Loading.remove();
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
                      html: '<div style="font-size: 15px; font-weight: 700">Compra para sucursal registrada exitosamente</div>',
                    });
                  },
                  error: (errorData) => {
                    Notiflix.Loading.remove();
                    console.error(errorData);
                  },
                  complete: () => {
                    //this.router.navigate(['/logistica/compra']);
                    this.router.navigate([rutas.logistica_compra]);
                  },
                });
              } else {
                Swal.fire('No seleccion&oacute; una sucursal');
              }
            }
            //ALMACEN CENTRAL
            else if (result.dismiss === Swal.DismissReason.cancel) {
              Notiflix.Loading.pulse(
                'Guardando la compra para almacen central...'
              );
              //HACEMOS EL POST DE COMPRAS
              //alert('PROCEDEMOS PARA ALMACEN CENTRAL');
              const compraData = {
                proveedor: this.form.value.proveedorDetalle['id'],
                fecha: this.fechaFormateada,
                moneda: this.form.value.compraDetalle['compra_moneda'],
                empresa: this.form.value.compraDetalle['idempresa'],
                pago: this.form.value.compraDetalle['tipo_pago'],
                usuario: this.userid,
                proceso: 'CONFIRMADO',
                comprobante:
                  this.form.value.comprobanteDetalle['comprobante_tipo'],
                seriecomprobante:
                  this.form.value.comprobanteDetalle['comprobante_serie'],
                numerocomprobante:
                  this.form.value.comprobanteDetalle['comprobante_numero'],
                destino: 1,
              };
              console.log(compraData);
              this.comprasService.postCompras(compraData).subscribe({
                next: (response) => {
                  this.compra = response;
                  console.log('Compra registrada con éxito:', this.compra);
                  this.form.value.listaCompra.forEach((producto: Producto) => {
                    producto.compra = this.compra;

                    //GUARDAMOS INFORMACION EN COMPRA_DETALLE
                    this.comprasDetalleService
                      .postComprasDetalle(producto)
                      .subscribe({
                        next: (response) => {
                          console.log(
                            'Entrada registrada con éxito:',
                            response
                          );
                        },
                        error: (errorData) => {
                          Notiflix.Loading.remove();
                          console.error(
                            'Error al enviar la solicitud POST de COMPRADETALLE:',
                            errorData
                          );
                        },
                        complete: () => {},
                      });

                    //GUARDAMOS CADA PRODUCTRO EN STOCK
                    const productosAgrupados: { [id: string]: Producto } = {};
                    this.form.value.listaCompra.forEach(
                      (producto: Producto) => {
                        const idProducto = producto.idobtenido;
                        if (productosAgrupados[idProducto]) {
                          // Si ya existe el producto en la lista agrupada, se suma la cantidad
                          productosAgrupados[idProducto].cantidad +=
                            producto.cantidad;
                          productosAgrupados[idProducto].subtotalagregado +=
                            producto.subtotalagregado;
                        } else {
                          // Si no existe, se agrega el producto a la lista agrupada
                          productosAgrupados[idProducto] = { ...producto };
                        }
                      }
                    );

                    // Ahora productosAgrupados contiene los productos agrupados por ID
                    Object.values(productosAgrupados).forEach(
                      (producto: Producto) => {
                        producto.compra = this.compra;

                        const dataStockPost = {
                          almacen: 1,
                          producto: producto.producto,
                          cantidad: producto.cantidad,
                          medida: producto.medida,
                        };

                        this.stockService.getStockAll().subscribe({
                          next: (responseFind: any) => {
                            //SI ES UN TABLA VACIA, REGISTRAMOS EL PRIMER DATO DE LA TABLA
                            if (responseFind == 'no hay resultados') {
                              this.stockService
                                .postStock(dataStockPost)
                                .subscribe({
                                  next: (responsePostStock) => {
                                    console.log(
                                      'Entrada registrada con éxito:',
                                      responsePostStock
                                    );
                                  },
                                  error: (errorData) => {
                                    Notiflix.Loading.remove();
                                    console.error(
                                      'Error al enviar la solicitud POST PRIMERA de STOCK A ALMACEN 1:',
                                      errorData
                                    );
                                  },
                                  complete: () => {},
                                });
                            }
                            //SI NO ES UNA TABLA VACIA, YA QUE BUSQUE
                            else {
                              this.dataFindStock = responseFind;
                              //buscamos algun producto que se encuentre en la tabla
                              const StockEncontrado = this.dataFindStock.find(
                                (stoc: any) =>
                                  stoc.producto_id === producto.producto &&
                                  stoc.almacen_id === '1'
                              );
                              //SI ENCONTRAMOS HACEMOS EL PUT
                              if (StockEncontrado) {
                                const nuevostock =
                                  Number(StockEncontrado.cantidad) +
                                  Number(producto.cantidad);

                                const dataStockUpdate = {
                                  producto: producto.producto,
                                  cantidad: nuevostock,
                                  condicion: 'COMPRA-NUEVA',
                                };

                                this.stockService
                                  .updatedStock(dataStockUpdate)
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
                              //SI NO SE ENCUENTRA LA DATA QUE COINCIDA
                              else {
                                this.stockService
                                  .postStock(dataStockPost)
                                  .subscribe({
                                    next: (responsePostStock) => {
                                      console.log(
                                        'Entrada registrada con éxito:',
                                        responsePostStock
                                      );
                                    },
                                    error: (errorData) => {
                                      Notiflix.Loading.remove();
                                      console.error(
                                        'Error al enviar la solicitud POST de STOCK:',
                                        errorData
                                      );
                                    },
                                    complete: () => {},
                                  });
                              }
                            }
                          },
                          error: () => {},
                          complete: () => {},
                        });
                      }
                    );
                  });

                  Notiflix.Loading.remove();
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
                    html: '<div style="font-size: 15px; font-weight: 700">Compra en almacen central registrada exitosamente</div>',
                  });
                },
                error: (errorData) => {
                  Notiflix.Loading.remove();
                  console.error(errorData);
                },
                complete: () => {
                  //this.router.navigate(['/logistica/compra']);
                  this.router.navigate([rutas.logistica_compra]);
                },
              });
            }
          });
      }
    }
  }

  calcularSubtotal(): number {
    const listaCompra = this.form.get('listaCompra') as FormArray;
    let subtotal = 0;

    for (const control of listaCompra.controls) {
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
