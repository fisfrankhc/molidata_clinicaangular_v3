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
import { MediosPagoService } from 'src/app//shared/services/despacho/caja/medios-pago.service';
import { OperacionService } from 'src/app/shared/services/despacho/caja/operacion.service';
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';
import { DatePipe } from '@angular/common';

import { VentasDetalle } from 'src/app/shared/interfaces/despacho';
import { Stock } from 'src/app/shared/interfaces/logistica';

import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenDetalleService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-detalle.service';

@Component({
  selector: 'app-caja-ver',
  templateUrl: './caja-ver.component.html',
  styleUrls: ['./caja-ver.component.scss'],
})
export class CajaVerComponent implements OnInit {
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public ventasService: VentasService,
    public ventasItemService: VentasItemService,
    public clientesService: ClientesService,
    public productoService: ProductoService,
    public mediosPagoService: MediosPagoService,
    public operacionService: OperacionService,
    private stockService: StockService,
    private movimientosAlmacenService: MovimientosAlmacenService,
    private movimientosAlmacenDetalleService: MovimientosAlmacenDetalleService,
    private datePipe: DatePipe
  ) {}
  ventaId: number | null = null;
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

    this.mediosPagoService.getMediosPagoAll().subscribe((data: any) => {
      this.mediosPago = data;
    });
  }

  form = this.fb.group({
    clienteDetalle: this.fb.group({
      id: ['', Validators.required],
      documento: [''],
      nombrecliente: [''],
      email: [''],
    }),
    listaVenta: this.fb.array([]), // FormArray para la lista de compra
    ventaMedioPago: this.fb.group({
      medio_pago: ['', Validators.required],
      medioDetalle: [''],
    }),
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
        //console.log(data);
        // Mapea los nombres de datos de ventas
        this.datoStock = this.datoStock
          .map((stockValor: Stock) => {
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
            return datoStocks ? datoStocks : null; // Devuelve null si datoStocks es undefined
          })
          .filter((datoStock) => datoStock !== null); // Filtra los valores null (es decir, los que eran
        //console.log(this.datoStock);
      },
      error: (_erroData) => {},
      complete: () => {},
    });
  }

  datoVenta: any = {};
  ventaDetalle(ventaId: any) {
    //console.log(ventaId);
    this.ventasService.getVenta(ventaId).subscribe({
      next: (data) => {
        this.datoVenta = data;

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
            if (producto) {
              ventasDetalle.nombreProducto = producto.prod_nombre;
              ventasDetalle.codigoProducto = producto.prod_codigo;
              ventasDetalle.medidaProducto = producto.med_id;
            }
            return ventasDetalle;
          }
        );
        //console.log(this.datosProductosDetalle);
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

  public selectedValue?: string;
  mediosPago: any[] = [];
  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  movimiento: any;
  pagarVenta() {
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
      const ventaData = {
        id: this.ventaId,
        proceso: 'PAGADO',
      };

      this.productoList.forEach((producto: any) => {
        //console.log(producto);
        const idobtenido = producto.prod_id;
        const cantidad = +producto.cantidad_venta;
        cantidadesPorId[idobtenido] = cantidadesPorId[idobtenido] || {
          almacen: this.usersucursal,
          producto: producto.prod_id,
          cantidad: 0,
          medida: producto.medidaProducto,
          stock_id: '', //ID DEL STOCK PARA EL PUT
        };
        cantidadesPorId[idobtenido].cantidad += cantidad;
      });
      let todosProductosCumplen = true; // Variable de bandera
      const productosCumplenCriterio: {
        id: number;
        cantidad: number;
        producto: number;
        condicion: string;
      }[] = []; // Almacena los productos que cumplen con el criterio

      //PARA EL PUT
      Object.keys(cantidadesPorId).forEach((id) => {
        const datosFind = this.datoStock.find(
          (prod: any) => prod.prod_id === cantidadesPorId[id].producto
        );
        console.log();
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
            condicion: 'CAJA-PAGAR',
          });
        }
      });

      if (todosProductosCumplen) {
        productosCumplenCriterio.forEach((ventasDataPut) => {
          //console.log(ventasDataPut); console.log(ventasDataPut.cantidad);
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

        const movimientoData = {
          fecha: this.fechaFormateada,
          tipo: 'SALIDA',
          usuario: this.userid,
          sucursal: this.usersucursal,
          origen: 'VENTA',
          origencodigo: this.ventaId, //I DE LA VENTA
          observaciones: '',
        };

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
                  medida: producto.medidaProducto,
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

        //PROCEDIMIENTO ANTERIOR SIN MODIFICACIONES
        const operacionData = {
          usuario: this.userid, //user_id
          fecha: this.fechaFormateada, //fecha_pago
          tipo: 'INGRESO', //ope_tipo
          monto: this.calcularSubtotalTotal(), //monto_pago
          motivo: 'VENTA', // motivo_pago
          motivoCodigo: this.ventaId, // motivo_codigo: codigo de la venta, su id
          descripcion: '', // descripcion_pago: Cuando es egreso, se decribe la operacion
          medio: this.form.get('ventaMedioPago')?.value.medio_pago, //medio_pago
          medioDetalle: this.form.get('ventaMedioPago')?.value.medioDetalle, // medio_detalle: Cuando no es efectivo, se describe
        };

        this.ventasService.updatedVenta(ventaData).subscribe({
          next: (response) => {
            console.log(response);

            this.operacionService.postOperacion(operacionData).subscribe({
              next: (response2) => {
                console.log('Guardado con exito:' + response2);
              },
              error: (errorData) => {
                console.log('Error al guardar la Operacion');
                console.log(errorData);
              },
              complete: () => {},
            });
          },
          error: (errorData) => {
            console.log(errorData);
          },
          complete: () => {
            //this.router.navigate([`/despacho/caja/venta-pagada/${this.ventaId}`,]);
            this.router.navigate([
              rutas.despacho_caja_ventapagada + this.ventaId,
            ]);
          },
        });
        //FIN PROCEDIMIENTO ANTERIOR SIN MODIFICACIONES
      }
    }
  }
}
