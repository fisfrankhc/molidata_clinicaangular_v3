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

import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { VentasDetalleService } from 'src/app/shared/services/farmacia/ventas/ventas-detalle.service';
import { StockService } from 'src/app/shared/services/logistica/stock/stock.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators';
import { Stock } from 'src/app/shared/interfaces/logistica';

import Swal from 'sweetalert2';
//import { ChangeDetectorRef } from '@angular/core';
import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenDetalleService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-detalle.service';

interface Producto {
  estiloRojo: boolean;
  idobtenido: string;
  codigoobtenido: string;
  producto: string; //
  nombrepobtenido: string;
  cantidad: number; //
  precio: number;
  subtotalagregado: string;
  venta: number;
  medida: number; //
  cantidadfinal: number;
  movimiento: string; //
}

@Component({
  selector: 'app-ventas-nuevo',
  templateUrl: './ventas-nuevo.component.html',
  styleUrls: ['./ventas-nuevo.component.scss'],
})
export class VentasNuevoComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private productoService: ProductoService,
    private ventasService: VentasService,
    private ventasDetalleService: VentasDetalleService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService,
    private stockService: StockService,
    private medidaService: MedidaService,
    private datePipe: DatePipe //private cdr: ChangeDetectorRef
  ) {}

  public ruta = rutas;
  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    /*     Swal.fire({
      position: 'bottom-end',
      icon: 'warning',
      title:
        '<i class="fas fa-check-circle" style="font-size: 15px;"></i> Your work has been saved',
      width: '300px',
      heightAuto: true,
      timerProgressBar: true, // Muestra una barra de progreso
      showConfirmButton: false,
      timer: 1500,
      //iconHtml: '<i class="fas fa-check-circle" style="font-size: 24px;"></i>',
      didOpen: (toast) => {
        const titleElement = toast.querySelector('.swal2-title') as HTMLElement;
        const iconElement = toast.querySelector('.swal2-icon') as HTMLElement;
        titleElement.style.fontSize = '15px'; // Ajustar el tamaño del texto
        iconElement.style.fontSize = '10px'; // Ajustar el tamaño del ícono
      },
    }); */

    const initialForm = this.fb.group({
      clienteDetalle: this.fb.group({
        id: ['', Validators.required],
        documento: [''],
        nombrecliente: [''],
        email: [''],
      }),
      productoBuscado: this.fb.group({
        idbuscado: ['', Validators.required],
        codigobuscado: [''],
        nombrebuscado: [''],
        nombrebproducto: [''],
        preciobuscado: [''],
        medidabuscado: [''],
        medidanombrebuscado: [''],
        cantidadStockBuscado: [''],
        cantidadbuscado: [''],
      }),
      listaVenta: this.fb.array([]), // FormArray para la lista de compra
    });

    // Asignar el formulario
    this.form = initialForm;

    this.medidasAll();
    this.productosAll();

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
            cantidadStockBuscado: '',
            cantidadbuscado: '',
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

  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (data: any) => {
        this.datoPRODUCTO = data;
        this.stockAll();
      },
      error: (_erroData) => {},
      complete: () => {},
    });

    this.filteresOption();
  }

  datoStock: any[] = [];
  stockAll() {
    this.stockService.getStockAll().subscribe({
      next: (data: any) => {
        this.datoStock = data;
        console.log(data);
        // Mapea los nombres de datos de ventas
        this.datoStock = this.datoStock.map((stockValor: Stock) => {
          //PARA PROVEEDOR
          const datoStocks = this.datoPRODUCTO.find(
            (prod: any) =>
              stockValor.producto_id === prod.prod_id &&
              stockValor.almacen_id === this.usersucursal &&
              stockValor.unidad_medida === prod.med_id
          );
          if (datoStocks) {
            datoStocks.cantidadStockSucursal = stockValor.cantidad;
            datoStocks.almacen_id = stockValor.almacen_id;
            datoStocks.stock_id = stockValor.stock_id;
          }
          return datoStocks;
        });
        console.log(this.datoStock);
      },
      error: (_erroData) => {},
      complete: () => {},
    });
  }

  datoCliente: any[] = [];
  //PRIMER FORMGROUP
  obtenerCliente() {
    const documento = this.form.get('clienteDetalle.documento')?.value;

    if (documento && (documento.length === 8 || documento.length === 12)) {
      console.log(documento);
      this.clientesService.getClientesAll().subscribe({
        next: (response: any) => {
          this.datoCliente = response;

          const clienteEncontrado = this.datoCliente.find(
            (cliente) => cliente.numero_documento === documento
          );

          if (clienteEncontrado) {
            this.form
              .get('clienteDetalle.id')
              ?.patchValue(clienteEncontrado.cli_id);
            this.form
              .get('clienteDetalle.nombrecliente')
              ?.patchValue(clienteEncontrado.cli_nombre);
            this.form
              .get('clienteDetalle.email')
              ?.patchValue(clienteEncontrado.cli_email);
          } else {
            // En caso de no encontrar el cliente, puedes limpiar los campos
            this.form.get('clienteDetalle.id')?.patchValue('');
            this.form
              .get('clienteDetalle.nombrecliente')
              ?.patchValue('Cliente no encontrado');
            this.form.get('clienteDetalle.email')?.patchValue('-');
          }
        },
        error: (_errorData) => {},
        complete: () => {},
      });
    } else {
      this.form.get('clienteDetalle.id')?.patchValue('');
      this.form.get('clienteDetalle.nombrecliente')?.patchValue('');
      this.form.get('clienteDetalle.email')?.patchValue('');
    }
  }

  filteredOptions!:
    | Observable<
        {
          stock: any;
          id: string;
          nombre: string;
          descripcion: string;
        }[]
      >
    | undefined;
  filteresOption() {
    this.filteredOptions = this.form
      .get('productoBuscado.nombrebproducto')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value as string))
      ) as
      | Observable<
          { id: string; nombre: string; stock: number; descripcion: string }[]
        >
      | undefined;
  }
  private _filter(
    value: string | null
  ): { id: string; nombre: string; stock: number; descripcion: string }[] {
    if (!value) {
      /* return this.datoPRODUCTO.map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        descripcion: option.prod_descripcion,
      })); */
      return this.datoStock.map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        stock: option.cantidadStockSucursal,
        descripcion: option.prod_descripcion,
      }));
    }

    const filterValue = value.toLowerCase();
    return this.datoStock
      .filter((option) =>
        option.prod_nombre.toLowerCase().includes(filterValue)
      )
      .map((option) => ({
        id: option.prod_id,
        nombre: option.prod_nombre,
        stock: option.cantidadStockSucursal,
        descripcion: option.prod_descripcion,
      }));
  }
  //PARA EL 2DO FORMGROUP
  onProductSelected(event: any) {
    const selectedProduct = event.option.value;
    console.log('Este el valor de selectedProduct: ' + selectedProduct);
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
        cantidadStockBuscado: productoSeleccionado.cantidadStockSucursal,
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
        cantidadStockBuscado: '',
        cantidadbuscado: null,
      });
    }
    //console.log(this.form.value.productoBuscado);
  }

  //PARA EL TERCER FORMGROUP
  agregarALista() {
    if (this.form.get('productoBuscado')?.valid) {
      const productoBuscado = this.form.get('productoBuscado');
      const listaVenta = this.form.get('listaVenta') as FormArray;

      // Crea un nuevo FormGroup para el producto
      const nuevoProducto = this.fb.group({
        idobtenido: [''],
        codigoobtenido: [''],
        producto: [''],
        nombrepobtenido: [''],
        cantidad: [''],
        precio: [''],
        medida: [''],
        subtotalagregado: [''],
        descuento: [0],
      });

      // Copia los valores del producto buscado al nuevo producto
      nuevoProducto.patchValue({
        idobtenido: productoBuscado?.get('idbuscado')?.value,
        codigoobtenido: productoBuscado?.get('codigobuscado')?.value,
        producto: productoBuscado?.get('nombrebuscado')?.value,
        nombrepobtenido: productoBuscado?.get('nombrebproducto')?.value,
        cantidad: productoBuscado?.get('cantidadbuscado')?.value,
        precio: productoBuscado?.get('preciobuscado')?.value,
        medida: productoBuscado?.get('medidabuscado')?.value,
        descuento: 0,
        subtotalagregado: (
          productoBuscado?.get('preciobuscado')?.value *
          productoBuscado?.get('cantidadbuscado')?.value
        ).toFixed(2),
      });

      // Agrega el nuevo producto a la lista de compra
      listaVenta.push(nuevoProducto);
      //console.log(listaVenta.controls);

      this.calcularSubtotal();

      this.form.get('productoBuscado')?.reset();
    } else {
      alert('Se necesita un producto');
    }
  }

  eliminarProducto(index: number) {
    const listaVenta = this.form.get('listaVenta') as FormArray;
    listaVenta.removeAt(index);

    this.calcularSubtotal();
  }

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );
  //ID DE VENTA OBTENIDA GUARDADA
  venta: any;
  ActualizarVentaStock: any;

  ProformaClick() {
    const cantidadesPorId: {
      [id: string]: {
        almacen: number;
        producto: number;
        cantidad: number;
        medida: string;
        stock_id: number;
      };
    } = {};
    const ventaData = {
      fecha: this.fechaFormateada,
      cliente: this.form.value.clienteDetalle['id'],
      proceso: 'PROFORMA',
      usuario: this.userid,
      sucursal: this.usersucursal,
    };

    // Antes del bucle forEach
    if (
      this.form.get('clienteDetalle')?.valid &&
      this.form.get('listaVenta')?.valid
    ) {
      this.form.value.listaVenta.forEach((producto: Producto) => {
        //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
        const idobtenido = producto.idobtenido;
        const cantidad = +producto.cantidad;
        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.usersucursal,
          producto: producto.producto,
          cantidad: 0,
          medida: producto.medida,
          stock_id: '', //ID DEL STOCK PARA EL PUT
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;

        //PARA PODER VISUALIZAR EL ELEMENTO QUE SE SOBREPASA Y MARCARLO CON ROJO
        const datosFind0 = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[idobtenido].producto
        );
        const operacionCantidad0 = parseFloat(
          (
            datosFind0.cantidadStockSucursal -
            cantidadesPorId[idobtenido].cantidad
          ).toFixed(2)
        );
        producto.estiloRojo = operacionCantidad0 < 0;
        //FIN
      });

      let todosProductosCumplen = true; // Variable de bandera
      const productosCumplenCriterio: {
        id: number;
        cantidad: number;
        producto: number;
      }[] = []; // Almacena los productos que cumplen con el criterio

      //PARA EL PUT
      Object.keys(cantidadesPorId).forEach((id) => {
        const datosFind = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[id].producto
        );
        const operacionCantidad = parseFloat(
          (
            datosFind.cantidadStockSucursal - cantidadesPorId[id].cantidad
          ).toFixed(2)
        );
        const stockSucursal = this.datoStock.find(
          (stock: any) =>
            stock.prod_id === cantidadesPorId[id].producto &&
            stock.med_id === cantidadesPorId[id].medida &&
            stock.almacen_id === this.usersucursal
        );
        cantidadesPorId[id].stock_id = stockSucursal.stock_id;

        if (operacionCantidad < 0) {
          todosProductosCumplen = false;
        } else {
          productosCumplenCriterio.push({
            id: cantidadesPorId[id].stock_id,
            cantidad: operacionCantidad,
            producto: cantidadesPorId[id].producto,
          });
        }
      });

      // Verifica la variable de bandera antes de imprimir
      if (todosProductosCumplen) {
        productosCumplenCriterio.forEach((ventasDataPut) => {
          console.log(ventasDataPut);
          console.log(ventasDataPut.cantidad);
          //HACER EL PUT
          this.stockService.updatedStock(ventasDataPut).subscribe({
            next: (response) => {
              console.log(response);
            },
            error: (errorData) => {
              console.log(errorData);
            },
            complete: () => {},
          });
          //FIN HACER EL PUT
        });

        //HACER EL POST
        const movimientoData = {
          fecha: this.fechaFormateada,
          tipo: 'SALIDA',
          usuario: this.userid,
          sucursal: this.usersucursal,
          origen: 'VENTA',
          origencodigo: '', //I DE LA VENTA
          observaciones: '',
        };
        this.ventasService.postVentas(ventaData).subscribe({
          next: (response) => {
            this.venta = response;

            this.form.value.listaVenta.forEach((producto: Producto) => {
              // Agregamos el ID de venta obtenido al objeto producto
              producto.venta = this.venta;

              // Ahora, realizamos la solicitud POST para guardar cada producto individualmente
              this.ventasDetalleService.postVentasDetalle(producto).subscribe({
                next: (response) => {
                  console.log('Entrada registrada con éxito:', response);
                },
                error: (errorData) => {
                  console.error(
                    'Error al enviar la solicitud POST de VENTADETALLE:',
                    errorData
                  );
                },
                complete: () => {},
              });
              //FIN DE VENTA-DETALLE
            });
          },
          error: (errorData) => {
            console.error(
              'Error al enviar la solicitud POST de VENTA:',
              errorData
            );
          },
          complete: () => {
            this.router.navigate(['/farmacia/venta']);
          },
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          timerProgressBar: true, // Muestra una barra de progreso
          showConfirmButton: false,
          timer: 4000,
          text: 'HAY UN PRODUCTO QUE NO CUENTA CON EL STOCK DISPONIBLE PARA LA COMPRA',
        });
      }
    }
  }
  movimiento: any;
  ConfirmarVentaClick() {
    const cantidadesPorId: {
      [id: string]: {
        almacen: number;
        producto: number;
        cantidad: number;
        medida: string;
        stock_id: number;
      };
    } = {};
    const ventaData = {
      fecha: this.fechaFormateada,
      cliente: this.form.value.clienteDetalle['id'],
      proceso: 'CONFIRMADO',
      usuario: this.userid,
      sucursal: this.usersucursal,
    };

    // Antes del bucle forEach
    if (
      this.form.get('clienteDetalle')?.valid &&
      this.form.get('listaVenta')?.valid
    ) {
      this.form.value.listaVenta.forEach((producto: Producto) => {
        //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
        const idobtenido = producto.idobtenido;
        const cantidad = +producto.cantidad;
        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.usersucursal,
          producto: producto.producto,
          cantidad: 0,
          medida: producto.medida,
          stock_id: '', //ID DEL STOCK PARA EL PUT
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;

        //PARA PODER VISUALIZAR EL ELEMENTO QUE SE SOBREPASA Y MARCARLO CON ROJO
        const datosFind0 = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[idobtenido].producto
        );
        const operacionCantidad0 = parseFloat(
          (
            datosFind0.cantidadStockSucursal -
            cantidadesPorId[idobtenido].cantidad
          ).toFixed(2)
        );
        producto.estiloRojo = operacionCantidad0 < 0;
        //FIN
      });

      let todosProductosCumplen = true; // Variable de bandera
      const productosCumplenCriterio: {
        id: number;
        cantidad: number;
        producto: number;
      }[] = []; // Almacena los productos que cumplen con el criterio

      //PARA EL PUT
      Object.keys(cantidadesPorId).forEach((id) => {
        const datosFind = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[id].producto
        );
        const operacionCantidad = parseFloat(
          (
            datosFind.cantidadStockSucursal - cantidadesPorId[id].cantidad
          ).toFixed(2)
        );
        const stockSucursal = this.datoStock.find(
          (stock: any) =>
            stock.prod_id === cantidadesPorId[id].producto &&
            stock.med_id === cantidadesPorId[id].medida &&
            stock.almacen_id === this.usersucursal
        );
        cantidadesPorId[id].stock_id = stockSucursal.stock_id;

        if (operacionCantidad < 0) {
          todosProductosCumplen = false;
        } else {
          productosCumplenCriterio.push({
            id: cantidadesPorId[id].stock_id,
            cantidad: operacionCantidad,
            producto: cantidadesPorId[id].producto,
          });
        }
      });

      // Verifica la variable de bandera antes de imprimir
      if (todosProductosCumplen) {
        productosCumplenCriterio.forEach((ventasDataPut) => {
          //console.log(ventasDataPut);
          //console.log(ventasDataPut.cantidad);
          //HACER EL PUT
          this.stockService.updatedStock(ventasDataPut).subscribe({
            next: (response) => {
              console.log(response);
            },
            error: (errorData) => {
              console.log(errorData);
            },
            complete: () => {},
          });
          //FIN HACER EL PUT
        });

        //HACER EL POST
        const movimientoData = {
          fecha: this.fechaFormateada,
          tipo: 'SALIDA',
          usuario: this.userid,
          sucursal: this.usersucursal,
          origen: 'VENTA',
          origencodigo: '', //ID DE LA VENTA
          observaciones: '',
        };
        //POST VENTAS
        this.ventasService.postVentas(ventaData).subscribe({
          next: (response) => {
            this.venta = response;

            this.form.value.listaVenta.forEach((producto: Producto) => {
              // Agregamos el ID de venta obtenido al objeto producto
              producto.venta = this.venta;

              // Ahora, realizamos la solicitud POST para guardar cada producto individualmente
              this.ventasDetalleService.postVentasDetalle(producto).subscribe({
                next: (response) => {
                  console.log('Entrada registrada con éxito:', response);
                },
                error: (errorData) => {
                  console.error(
                    'Error al enviar la solicitud POST de VENTADETALLE:',
                    errorData
                  );
                },
                complete: () => {},
              });
              //FIN DE VENTA-DETALLE
            });

            const movimientoData = {
              fecha: this.fechaFormateada,
              tipo: 'SALIDA',
              usuario: this.userid,
              sucursal: this.usersucursal,
              origen: 'VENTA',
              origencodigo: this.venta, //I DE LA VENTA
              observaciones: '',
            };
            //POST MOVIMIENTOS
            this.movimientosAlmacenService
              .postMovimientos(movimientoData)
              .subscribe({
                next: (response) => {
                  this.movimiento = response;

                  this.form.value.listaVenta.forEach((producto: Producto) => {
                    producto.movimiento = this.movimiento;
                    const movimientoDetalleData = {
                      movimiento: producto.movimiento,
                      producto: producto.producto,
                      cantidad: producto.cantidad,
                      medida: producto.medida,
                      vencimiento: '',
                      lote: '',
                      peso: '',
                    };
                    this.movimientosAlmacenDetalleService
                      .postMovimientosDetalle(movimientoDetalleData)
                      .subscribe({
                        next: (response) => {
                          console.log(
                            'Movimientodetalle registrado con éxito:',
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
                  });
                },
                error: (errorData) => {
                  console.error(
                    'Error al enviar la solicitud POST de MOVIMIENTO:',
                    errorData
                  );
                },
                complete: () => {},
              });
          },
          error: (errorData) => {
            console.error(
              'Error al enviar la solicitud POST de VENTA:',
              errorData
            );
          },
          complete: () => {
            this.router.navigate(['/farmacia/caja']);
          },
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          timerProgressBar: true, // Muestra una barra de progreso
          showConfirmButton: false,
          timer: 4000,
          text: 'HAY UN PRODUCTO QUE NO CUENTA CON EL STOCK DISPONIBLE PARA LA COMPRA',
        });
      }
    }
  }

  calcularSubtotal(): number {
    const listaVenta = this.form.get('listaVenta') as FormArray;
    let subtotal = 0;

    for (const control of listaVenta.controls) {
      const subtotalProducto = parseFloat(
        control.get('subtotalagregado')?.value || 0
      );
      subtotal += subtotalProducto;
    }

    // Redondear a dos decimales
    const subtotalRedondeado = parseFloat(subtotal.toFixed(2));

    return subtotalRedondeado;
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
