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
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';
import { Stock } from 'src/app/shared/interfaces/logistica';
import { VentasDetalle } from 'src/app/shared/interfaces/despacho';

import { MovimientosAlmacenService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen.service';
import { MovimientosAlmacenDetalleService } from 'src/app/shared/services/almacen/movimientos-almacen/movimientos-almacen-detalle.service';

import { ComprobantesItemsService } from 'src/app/shared/services/contable/comprobantes/comprobantes-items.service';
import { ComprobantesVentaService } from 'src/app/shared/services/contable/comprobantes/comprobantes-venta.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { DatosEmpresa } from 'src/app/shared/interfaces/empresa';

import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { jsPDF } from 'jspdf';
import * as Notiflix from 'notiflix';
import { EmailService } from 'src/app/shared/services/email.service';

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
    private datePipe: DatePipe,
    private comprobantesItemsService: ComprobantesItemsService,
    private comprobantesVentaService: ComprobantesVentaService,
    private emailService: EmailService,
    public generalService: GeneralService
  ) {}
  ventaId: any;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  usernombre = localStorage.getItem('usernombre');
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
    this.comprobantesAll(this.ventaId);
  }

  form = this.fb.group({
    clienteDetalle: this.fb.group({
      id: ['', Validators.required],
      documento: [''],
      nombrecliente: [''],
      email: [''],
    }),
    listaCompra: this.fb.array([]), // FormArray para la lista de compra
    datoVerBoleta: this.fb.group({
      envioOpcion: [''],
      correoBoleta: ['', Validators.email],
      whatsappBoleta: [''],
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
          .filter((datoStock) => datoStock !== null); // Filtra los valores null (es decir, los que eran undefined)

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
        console.log(this.datoVenta);
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

  //PARA COMPROBANTEEEE
  datosCOMPROBANTE: any;
  comprobanteExist: boolean = false;
  comprobantesAll(ventaId: number): void {
    this.comprobantesVentaService.getComprobanteVentaItem(ventaId).subscribe({
      next: (datosCOMPROBANTE: any) => {
        if (datosCOMPROBANTE === 'No hay resultados') {
          this.datosCOMPROBANTE = 'No hay resultados';
        } else {
          this.datosCOMPROBANTE = datosCOMPROBANTE[0];
          this.comprobanteExist = true;
          console.log(this.datosCOMPROBANTE);

          this.infoItemsComprobantesAll(this.datosCOMPROBANTE.comprobante_id);
          this.infoEmpresaAll();
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  infoEmpresa: any;
  infoEmpresaAll(): void {
    this.generalService.getDatosEmpresa().subscribe({
      next: (responsEmpresa: any) => {
        this.infoEmpresa = responsEmpresa;
        this.infoEmpresa = this.infoEmpresa.find(
          (inempre: any) =>
            inempre.empresa_ruc === this.datosCOMPROBANTE.empresa_emision
        );
        console.log(this.infoEmpresa);
      },
      error: () => {},
      complete: () => {},
    });
  }

  infoItemsComprobantes: any;
  infoItemsComprobantesAll(comprobanteid: any): void {
    this.comprobantesItemsService
      .getComprobanteDetalleItem(comprobanteid)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.infoItemsComprobantes = response;
          console.log(this.infoItemsComprobantes);

          this.itemList = this.infoItemsComprobantes;
        },
        error: () => {},
        complete: () => {},
      });
  }

  public calcularSubtotalItem(producto: any): number {
    const precio = producto.precio_venta;
    const cantidad = producto.cantidad_venta;
    const descuento = producto.exonerado;

    return precio * cantidad - descuento;
  }

  itemList = [];
  public calcularTotalItem(): number {
    let subtotalTotal = 0;
    this.itemList.forEach((producto) => {
      subtotalTotal += this.calcularSubtotalItem(producto);
    });

    return subtotalTotal;
  }

  public totalEnTextoItem(): string {
    const subtotalTotal = this.calcularTotalItem();
    const parteEntera = Math.floor(subtotalTotal);
    const parteDecimal = Math.round((subtotalTotal - parteEntera) * 100);
    // Convertir a texto
    if (subtotalTotal !== 0) {
      const parteEnteraEnPalabras = this.numeroAStringItem(parteEntera);
      const parteDecimalEnPalabras = this.numeroAStringItem(parteDecimal);
      return `${parteEnteraEnPalabras} con ${parteDecimalEnPalabras}/100 soles`;
    } else {
      // En caso de que subtotalTotal sea igual a 0
      return 'Cero soles';
    }
  }

  numeroAStringItem(numero: number): string {
    const especiales = [
      'Diez',
      'Once',
      'Doce',
      'Trece',
      'Catorce',
      'Quince',
      'Dieciséis',
      'Diecisiete',
      'Dieciocho',
      'Diecinueve',
    ];
    const unidades = [
      'Cero',
      'Uno',
      'Dos',
      'Tres',
      'Cuatro',
      'Cinco',
      'Seis',
      'Siete',
      'Ocho',
      'Nueve',
    ];
    const decenas = [
      '',
      '',
      'Veinte',
      'Treinta',
      'Cuarenta',
      'Cincuenta',
      'Sesenta',
      'Setenta',
      'Ochenta',
      'Noventa',
    ];
    const centenas = [
      '',
      'Ciento',
      'Doscientos',
      'Trescientos',
      'Cuatrocientos',
      'Quinientos',
      'Seiscientos',
      'Setecientos',
      'Ochocientos',
      'Novecientos',
    ];

    if (numero === 0) {
      return 'Cero';
    } else if (numero < 10) {
      return unidades[numero];
    } else if (numero < 20) {
      return especiales[numero - 10];
    } else if (numero < 100) {
      const unidad = numero % 10;
      const decena = Math.floor(numero / 10);
      return decenas[decena] + (unidad > 0 ? ' y ' + unidades[unidad] : '');
    } else if (numero < 1000) {
      const centena = Math.floor(numero / 100);
      const restoCentena = numero % 100;
      return (
        centenas[centena] +
        (restoCentena > 0 ? ' ' + this.numeroAStringItem(restoCentena) : '')
      );
    } else if (numero < 1e6) {
      const miles = Math.floor(numero / 1e3);
      const restoMiles = numero % 1e3;
      return (
        (miles === 1 ? 'Mil' : this.numeroAStringItem(miles) + ' Mil') +
        (restoMiles > 0 ? ' ' + this.numeroAStringItem(restoMiles) : '')
      );
    } else {
      const millones = Math.floor(numero / 1e6);
      const restoMillones = numero % 1e6;
      return (
        (millones === 1
          ? 'Un Millón'
          : this.numeroAStringItem(millones) + ' Millones') +
        (restoMillones > 0 ? ' ' + this.numeroAStringItem(restoMillones) : '')
      );
    }
  }

  generarBOLETAA4() {
    //SE EJECUTA DE FORMA NORMAL EL CODIGO DE PDF
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    });

    // Obtén el contenido del div
    const contenidoDiv = document.getElementById('boletaA4Emitir');

    // Verifica que el div exista antes de continuar
    if (contenidoDiv) {
      pdf.html(contenidoDiv, {
        callback: (pdf) => {
          // Guarda el PDF después de cargar el contenido
          pdf.output('dataurlnewwindow');
        },
      });
    } else {
      console.error('Elemento no encontrado:', contenidoDiv);
    }
  }

  generarBOLETATicket() {
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a7',
      orientation: 'portrait',
    });

    // Obtén el contenido del div
    const contenidoDiv = document.getElementById('boletaTicketEmitir');

    // Verifica que el div exista antes de continuar
    if (contenidoDiv) {
      pdf.html(contenidoDiv, {
        callback: (pdf) => {
          // Guarda el PDF después de cargar el contenido
          pdf.output('dataurlnewwindow');
        },
      });
    } else {
      console.error('Elemento no encontrado:', contenidoDiv);
    }
  }

  enviarACorreo() {
    const datoEmailBoleta = this.form.get('datoVerBoleta')?.value.correoBoleta;
    if (datoEmailBoleta) {
      const correoBoletaControl = this.form.get('datoVerBoleta.correoBoleta');

      if (correoBoletaControl?.invalid) {
        if (correoBoletaControl.hasError('email')) {
          console.log('Correo electrónico inválido');
          alert('El campo ingresado no es un correo electrónico válido.');
        } else {
          alert('HAY UN ERROR');
        }
      } else {
        //PASAMOS A EJECUTAR EL CODIGO
        const pdf = new jsPDF({
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        });

        // Obtén el contenido del div
        const contenidoDiv = document.getElementById('boletaA4Emitir');

        // Verifica que el div exista antes de continuar
        if (contenidoDiv) {
          pdf.html(contenidoDiv, {
            callback: (pdf) => {
              Notiflix.Loading.dots('Enviando correo');
              // Obtiene el PDF en formato base64
              const pdfBase64 = pdf.output('datauristring').split(',')[1];
              // Llama al servicio para enviar el correo electrónico con el PDF adjunto
              const formData = new FormData();
              formData.append('to_email', datoEmailBoleta);
              formData.append('subject', 'Boleta Electronica QARA');
              formData.append(
                'message',
                'Buen dia, se envia una copia de su boleta electrónica'
              );
              formData.append('attachment', pdfBase64);
              this.emailService.enviarEmail(formData).subscribe({
                next: (response) => {
                  console.log(
                    'Correo electrónico enviado con éxito:',
                    response
                  );

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
                    //title: 'Stock minimo guardado',
                    html: '<div style="font-size: 15px; font-weight: 700">Correo enviado exitosamente</div>',
                  });
                },
                error: (errorData) => {
                  console.error(
                    'Error al enviar el correo electrónico:',
                    errorData
                  );
                },
                complete: () => {},
              });
            },
          });
        } else {
          console.error('Elemento no encontrado:', contenidoDiv);
        }
      }
    } else {
      alert('INGRESE UN CORREO ELECTRÓNICO');
    }
  }

  enviarAWhatsApp() {
    const numeroWhatsApp = this.form.get('datoVerBoleta.whatsappBoleta')?.value;

    const valorTotal = this.calcularTotalItem();
    const valorFormateado = valorTotal.toFixed(2); // 2 indica el número de decimales

    const mensaje = `USTED TIENE UN COMPROBANTE ELECTRONICO DE LA EMPRESA
    ${this.infoEmpresa.razon_social}
    CON RUC: ${this.infoEmpresa.empresa_ruc} 
    POR EL VALOR DE S/.${valorFormateado} \n.
    SERIE Y NUMERO: ${this.datosCOMPROBANTE.comprobante_serie}-${this.datosCOMPROBANTE.comprobante_numero}`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const enlaceWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;

    window.open(enlaceWhatsApp, '_blank');
  }
}
