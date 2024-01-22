import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { VentasService } from 'src/app/shared/services/despacho/ventas/ventas.service';
import { VentasItemService } from 'src/app/shared/services/despacho/ventas/ventas-item.service';
import { ClientesService } from 'src/app/shared/services/despacho/clientes/clientes.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { StockService } from 'src/app/shared/services/logistica/stock/stock.service';
import { Stock } from 'src/app/shared/interfaces/logistica';
import { VentasDetalle } from 'src/app/shared/interfaces/despacho';

import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenDetalleService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-detalle.service';

import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas-ver',
  templateUrl: './ventas-ver.component.html',
  styleUrls: ['./ventas-ver.component.scss'],
})
export class VentasVerComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public ventasService: VentasService,
    public ventasItemService: VentasItemService,
    public clientesService: ClientesService,
    public productoService: ProductoService,
    private stockService: StockService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService,
    private datePipe: DatePipe
  ) {}
  ventaId: number | null = null;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  public ruta = rutas;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const ventaIdParam = params.get('venta_id');
      if (ventaIdParam !== null) {
        this.ventaId = +ventaIdParam;
      }
    });
    this.clientesAll();
    this.productosAll();
    this.ventaDetalle(this.ventaId);
  }

  form = this.fb.group({
    clienteDetalle: this.fb.group({
      id: ['', Validators.required],
      documento: [''],
      nombrecliente: [''],
      email: [''],
    }),
    listaCompra: this.fb.array([]), // FormArray para la lista de compra
  });

  datosCLI: any;
  clientesAll(): void {
    this.clientesService.getClientesAll().subscribe({
      next: (datosCLI: any) => {
        this.datosCLI = datosCLI;
        this.ventaDetalle(this.ventaId);
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.ventaDetalleItem(this.ventaId);
        this.stockAll();
      },
      error: () => {},
      complete: () => {},
    });
  }

  datoStock: any[] = [];
  stockAll() {
    this.stockService.getStockAll().subscribe({
      next: (data: any) => {
        this.datoStock = data;
        // Mapea los nombres de datos de ventas
        this.datoStock = this.datoStock.map((stockValor: Stock) => {
          //PARA PROVEEDOR
          const datoStocks = this.datosPRO.find(
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

        this.ventaDetalle(this.ventaId);
        this.ventaDetalleItem(this.ventaId);
      },
      error: (erroData) => {},
      complete: () => {},
    });
  }

  datoVenta: any = {};
  sucursalVenta: any;
  ventaDetalle(ventaId: any) {
    //console.log(ventaId);
    this.ventasService.getVenta(ventaId).subscribe({
      next: (data) => {
        this.datoVenta = data;
        this.sucursalVenta = this.datoVenta[0]['sucursal_id'];
        if (this.datosCLI && this.datosCLI.length > 0) {
          // Buscar el cliente correspondiente en datosCLI
          const cliente = this.datosCLI.find(
            (cli: any) => cli.cli_id === this.datoVenta[0]['cliente_id']
          );
          // Asignar el nombre del cliente al formulario si se encontró
          if (cliente) {
            this.form
              .get('clienteDetalle.nombrecliente')
              ?.setValue(cliente.cli_nombre);
            this.form
              .get('clienteDetalle.documento')
              ?.setValue(cliente.numero_documento);
          }
        }

        this.form
          .get('clienteDetalle.id')
          ?.setValue(this.datoVenta[0]['venta_id']);
        this.form
          .get('clienteDetalle.email')
          ?.setValue(this.datoVenta[0]['venta_proceso']);
      },
      error: (errorData) => {
        console.error('Error al obtener los datos de la venta: ', errorData);
      },
      complete: () => {
        //console.log('DATOS OBTENIDOS EXITOSAMENTE');
      },
    });
  }

  datosProductosDetalle: any;
  sucursalVentaId: any;
  ventaDetalleItem(ventaId: any) {
    this.ventasItemService.getVentaItem(ventaId).subscribe({
      next: (response) => {
        this.datosProductosDetalle = response;

        // Mapea los nombres de los clientes a los datos de ventas
        this.datosProductosDetalle = this.datosProductosDetalle.map(
          (ventasDetalle: VentasDetalle) => {
            //PARA CATEGORIAS
            const producto = this.datosPRO.find(
              (pro: any) => pro.prod_id === ventasDetalle.prod_id
            );
            this.sucursalVentaId = this.sucursalVenta;
            const valorStock = this.datoStock.find(
              (stock: any) =>
                stock.prod_id === ventasDetalle.prod_id &&
                stock.almacen_id === this.sucursalVentaId
            );
            if (producto) {
              ventasDetalle.nombreProducto = producto.prod_nombre;
              ventasDetalle.codigoProducto = producto.prod_codigo;
              ventasDetalle.medidaid = producto.med_id;
            }
            if (valorStock) {
              ventasDetalle.cantidadStockSucursal =
                valorStock.cantidadStockSucursal;
            }
            return ventasDetalle;
          }
        );

        this.productoList = this.datosProductosDetalle;
      },
      error: (errorData) => {
        console.error(
          'Error al enviar la solicitud POST de VentaDetalleItems:',
          errorData
        );
      },
      complete: () => {},
    });
  }

  public calcularSubtotal(producto: any): number {
    const precio = producto.precio_venta;
    const cantidad = producto.cantidad_venta;
    const descuento = producto.descuento;

    return precio * cantidad - descuento;
  }

  productoList = [];
  public calcularSubtotalTotal(): number {
    let subtotalTotal = 0;
    this.productoList.forEach((producto) => {
      subtotalTotal += this.calcularSubtotal(producto);
    });
    return subtotalTotal;
  }

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  movimiento: any;
  actualizarVenta() {
    const cantidadesPorId: {
      [id: string]: {
        almacen: number;
        producto: number;
        cantidad: number;
        medida: string;
        stock_id: number;
      };
    } = {};

    if (this.form.valid) {
      //console.log(this.form.value);
      const ventaData = {
        id: this.ventaId,
        proceso: 'CONFIRMADO',
      };
      this.productoList.forEach((producto: any) => {
        //PARA SUMAR LAS CANTIDADES DE LOS PRODUCTOS
        console.log(producto);
        const idobtenido = producto.prod_id;
        const cantidad = +producto.cantidad_venta;
        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.datoVenta[0]['sucursal_id'],
          producto: producto.prod_id,
          cantidad: 0,
          medida: producto.medida,
          stock_id: '', //ID DEL STOCK PARA EL PUT
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;
      });

      let todosProductosCumplen = true; // Variable de bandera
      const productosCumplenCriterio: {
        id: number;
        cantidad: number;
        producto: number;
      }[] = []; // Almacena los productos que cumplen con el criterio

      Object.keys(cantidadesPorId).forEach((id) => {
        //console.log(cantidadesPorId);
        const datosFind = this.datoStock.find(
          (stock: any) => stock.prod_id === cantidadesPorId[id].producto
        );
        console.log(this.datoStock);
        console.log(cantidadesPorId[id]);

        const operacionCantidad = parseFloat(
          (
            datosFind.cantidadStockSucursal - cantidadesPorId[id].cantidad
          ).toFixed(2)
        );
        //console.log(operacionCantidad);

        const stockSucursal = this.datoStock.find(
          (stock: any) =>
            stock.prod_id === cantidadesPorId[id].producto &&
            stock.almacen_id === this.datoVenta[0]['sucursal_id']
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

      if (todosProductosCumplen) {
        productosCumplenCriterio.forEach((ventasDataPut) => {
          //HACER EL PUT
          console.log(ventasDataPut);
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

          this.ventasService.updatedVenta(ventaData).subscribe({
            next: (response) => {
              console.log(response);
              const movimientoData = {
                fecha: this.fechaFormateada,
                tipo: 'SALIDA',
                usuario: this.userid,
                sucursal: this.usersucursal,
                origen: 'VENTA',
                origencodigo: this.ventaId, //ID DE LA VENTA
                observaciones: '',
              };
              console.log(movimientoData);
              //POST MOVIMIENTOS
              this.movimientosAlmacenService
                .postMovimientos(movimientoData)
                .subscribe({
                  next: (response) => {
                    this.movimiento = response;

                    this.productoList.forEach((producto: any) => {
                      producto.movimiento = this.movimiento;

                      const movimientoDetalleData = {
                        movimiento: producto.movimiento,
                        producto: producto.prod_id,
                        cantidad: producto.cantidad_venta,
                        medida: producto.medidaid,
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
              console.log(errorData);
            },
            complete: () => {
              //this.router.navigate(['/despacho/caja']);
              this.router.navigate([rutas.despacho_caja]);
            },
          });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          timerProgressBar: true, // Muestra una barra de progreso
          showConfirmButton: false,
          timer: 4000,
          text: 'HAY UN PRODUCTO QUE YA NO CUENTA CON EL STOCK SUFICIENTE PARA CONFIRMAR LA COMPRA',
        });
      }
    }
  }
}
