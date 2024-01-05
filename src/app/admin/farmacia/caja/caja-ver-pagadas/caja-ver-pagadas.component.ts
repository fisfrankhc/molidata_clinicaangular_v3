import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { VentasItemService } from 'src/app/shared/services/farmacia/ventas/ventas-item.service';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MediosPagoService } from 'src/app/shared/services/farmacia/caja/medios-pago.service';
import { OperacionService } from 'src/app/shared/services/farmacia/caja/operacion.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ComprobanteTipoService } from 'src/app/shared/services/contable/asignacion-serie/comprobante-tipo.service';
import { ComprobanteNumeracionService } from 'src/app/shared/services/contable/asignacion-serie/comprobante-numeracion.service';
import { ComprobantesService } from 'src/app/shared/services/contable/comprobantes/comprobantes.service';
import { ComprobantesItemsService } from 'src/app/shared/services/contable/comprobantes/comprobantes-items.service';

import { jsPDF } from 'jspdf';
import { DatePipe } from '@angular/common';
import * as Notiflix from 'notiflix';

import { VentasDetalle } from 'src/app/shared/interfaces/farmacia';
import { DatosEmpresa } from 'src/app/shared/interfaces/empresa';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { TDocumentDefinitions } from 'pdfmake/interfaces';

import emailjs from '@emailjs/browser';
import { EmailService } from 'src/app/shared/services/email.service';
import Swal from 'sweetalert2';
import { NgStyle } from '@angular/common';
import { ComprobantesDetalleService } from 'src/app//shared/services/contable/comprobantes/comprobantes-detalle.service';

@Component({
  selector: 'app-caja-ver-pagadas',
  templateUrl: './caja-ver-pagadas.component.html',
  styleUrls: ['./caja-ver-pagadas.component.scss'],
})
export class CajaVerPagadasComponent implements OnInit {
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
    private datePipe: DatePipe,
    public medidaService: MedidaService,
    public generalService: GeneralService,
    private comprobantesService: ComprobantesService,
    private comprobantesDetalleService: ComprobantesDetalleService,
    private comprobanteTipoService: ComprobanteTipoService,
    private comprobanteNumeracionService: ComprobanteNumeracionService,
    private comprobantesItemsService: ComprobantesItemsService,
    private emailService: EmailService
  ) {}
  ventaId: number | null = null;
  public ruta = rutas;
  usernombre = localStorage.getItem('usernombre');

  // Variable para almacenar el valor seleccionado
  opcionSeleccionada: any;
  // Función para devolver los estilos en función de la opción seleccionada
  obtenerEstilos(opcion: string): any {
    return {
      color: this.opcionSeleccionada === opcion ? '#0000ff' : '',
      'font-weight': this.opcionSeleccionada === opcion ? 'bold' : '',
    };
  }

  datosEMP: any = {};
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const ventaIdParam = params.get('venta_id');
      if (ventaIdParam !== null) {
        this.ventaId = +ventaIdParam;
      }
    });
    this.comprobantesAll();
    this.clientesAll();
    this.productosAll();
    this.medidasAll();
    this.comprobantesNumeracionAll();
    this.comprobantesTiposAll();

    this.mediosPagoService.getMediosPagoAll().subscribe((data: any) => {
      this.mediosPago = data;
    });

    this.generalService.getDatosEmpresa().subscribe({
      next: (datosEMP: DatosEmpresa[]) => {
        this.datosEMP = datosEMP[0];
      },
      error: () => {},
      complete: () => {},
    });
  }

  form = this.fb.group({
    clienteDetalle: this.fb.group({
      id: ['', Validators.required],
      documento: [''],
      nombrecliente: [''],
      email: [''],
      direccioncliente: [''],
    }),
    listaCompra: this.fb.array([]), // FormArray para la lista de compra
    ventaMedioPago: this.fb.group({
      medio_pago: ['', Validators.required],
    }),
    datoEnvioBoleta: this.fb.group({
      tipoBoleta: ['', Validators.required],
    }),
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
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosMEDIDA: any;
  medidasAll() {
    this.medidaService.getMedidasAll().subscribe({
      next: (datosMEDIDA: any) => {
        this.datosMEDIDA = datosMEDIDA;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosComproNumeracion: any;
  comprobantesNumeracionAll(): void {
    this.comprobanteNumeracionService.getComprobanteNumeracionAll().subscribe({
      next: (response: any) => {
        this.datosComproNumeracion = response;
      },
      error: () => {},
      complete: () => {},
    });
  }
  datosTiposComp: any;
  idTipoBoleta: any;
  idTipoFactura: any;
  comprobantesTiposAll(): void {
    this.comprobanteTipoService.getComprobanteTiposAll().subscribe({
      next: (response: any) => {
        this.datosTiposComp = response;
        this.datosTiposComp.forEach((dataTipoComp: any) => {
          if (dataTipoComp.tipo_id === '1') {
            this.idTipoBoleta = dataTipoComp.tipo_id;
          } else if (dataTipoComp.tipo_id === '2') {
            this.idTipoFactura = dataTipoComp.tipo_id;
          }
        });
      },
      error: () => {},
      complete: () => {},
    });
  }

  datoVenta: any = {};
  clienteTipoDocumento: string = '';
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
            this.form
              .get('clienteDetalle.direccioncliente')
              ?.setValue(cliente.cli_direccion);
            this.clienteTipoDocumento = cliente.tipo_documento; //PARA VALIDAR DNI O RUC
          }
        }

        const compNumeracion = this.datosComproNumeracion.filter(
          (cnum: any) => cnum.sede_id === this.datoVenta[0]['sucursal_id']
        );
        if (compNumeracion) {
          compNumeracion.forEach((datacompnum: any) => {
            if (datacompnum.comprobante_tipo === '1') {
              this.BSerie = datacompnum.serie;
              this.BNumero = datacompnum.numero;
            } else if (datacompnum.comprobante_tipo === '2') {
              this.FSerie = datacompnum.serie;
              this.FNumero = datacompnum.numero;
            }
          });
        }

        console.log(compNumeracion);

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
            //PARA PRODUCTO
            const producto = this.datosPRO.find(
              (pro: any) => pro.prod_id === ventasDetalle.prod_id
            );
            if (producto) {
              ventasDetalle.nombreProducto = producto.prod_nombre;
              ventasDetalle.codigoProducto = producto.prod_codigo;

              // Busca la medida correspondiente en los datos de medida
              const medida = this.datosMEDIDA.find(
                (med: any) => med.med_id === producto.med_id
              );

              // Asigna el símbolo de medida al objeto ventasDetalle
              if (medida) {
                ventasDetalle.medidaProducto = medida.med_simbolo;
              }
            }
            return ventasDetalle;
          }
        );

        this.productoList = this.datosProductosDetalle;
        console.log(this.datosProductosDetalle);
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
  userid = localStorage.getItem('userid');
  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  public totalEnTexto(): string {
    const subtotalTotal = this.calcularSubtotalTotal();
    const parteEntera = Math.floor(subtotalTotal);
    const parteDecimal = Math.round((subtotalTotal - parteEntera) * 100);
    // Convertir a texto
    if (subtotalTotal !== 0) {
      const parteEnteraEnPalabras = this.numeroAString(parteEntera);
      const parteDecimalEnPalabras = this.numeroAString(parteDecimal);
      return `${parteEnteraEnPalabras} con ${parteDecimalEnPalabras}/100 soles`;
    } else {
      // En caso de que subtotalTotal sea igual a 0
      return 'Cero soles';
    }
  }

  numeroAString(numero: number): string {
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
        (restoCentena > 0 ? ' ' + this.numeroAString(restoCentena) : '')
      );
    } else if (numero < 1e6) {
      const miles = Math.floor(numero / 1e3);
      const restoMiles = numero % 1e3;
      return (
        (miles === 1 ? 'Mil' : this.numeroAString(miles) + ' Mil') +
        (restoMiles > 0 ? ' ' + this.numeroAString(restoMiles) : '')
      );
    } else {
      const millones = Math.floor(numero / 1e6);
      const restoMillones = numero % 1e6;
      return (
        (millones === 1
          ? 'Un Millón'
          : this.numeroAString(millones) + ' Millones') +
        (restoMillones > 0 ? ' ' + this.numeroAString(restoMillones) : '')
      );
    }
  }

  generarTICKET() {
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a7',
      orientation: 'portrait',
    });

    // Obtén el contenido del div
    const contenidoDiv = document.getElementById('ticketEmitir')!; // Reemplaza 'tuDiv' con el ID de tu div
    const anchoContenido = 74; // Ancho en milímetros

    // Verifica que el div exista antes de continuar
    if (contenidoDiv) {
      contenidoDiv.style.width = `${anchoContenido}mm`;
      contenidoDiv.style.fontSize = '1.7px';
      contenidoDiv.style.width = '75px';
      contenidoDiv.style.padding = '5px 15px';
      contenidoDiv.style.margin = 'auto';
      contenidoDiv.style.textAlign = 'center';
      contenidoDiv.style.display = 'fixed';

      // Agrega el contenido del div al PDF
      pdf.html(contenidoDiv, {
        callback: (pdf) => {
          // Guarda el PDF después de cargar el contenido
          //pdf.save('tu-archivo.pdf');
          // Abre el PDF en una nueva ventana o pestaña
          pdf.output('dataurlnewwindow');
        },
      });
    } else {
      console.error('Elemento no encontrado:', contenidoDiv);
    }
  }

  comprobanteTipo: any;
  comprobanteDatoSerie: any;
  comprobanteDatoNumero: any;

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  emitirComprobante() {
    const valorInputTipoBoleta =
      this.form.get('datoEnvioBoleta')?.value.tipoBoleta;
    if (valorInputTipoBoleta === 'BOLETA') {
      this.comprobanteTipo = this.idTipoBoleta;
      this.comprobanteDatoSerie = this.BSerie;
      this.comprobanteDatoNumero = this.BNumero;
    } else {
      this.comprobanteTipo = this.idTipoFactura;
      this.comprobanteDatoSerie = this.FSerie;
      this.comprobanteDatoNumero = this.FNumero;
    }

    const dataComprobante = {
      tipo: this.comprobanteTipo, //comprobante_tipo
      fecha: this.fechaFormateada, //fecha_emision
      empresa: this.datosEMP.empresa_ruc, //empresa_emision
      clienteDocumento: this.clienteTipoDocumento, //cliente_documento_tipo
      clienteNumero: this.form.get('clienteDetalle.documento')?.value, //cliente_documento_numero
      clienteNombre: this.form.get('clienteDetalle.nombrecliente')?.value, //cliente_razon_social
      clienteDireccion: this.form.get('clienteDetalle.direccioncliente')?.value,
      serie: this.comprobanteDatoSerie, //comprobante_serie
      numero: this.comprobanteDatoNumero, //comprobante_numero
      envio: 'PENDIENTE', //envio_sunat
      venta: this.ventaId, //venta_id
    };
    console.log(dataComprobante);

    /* const nuevodato = this.datosComproNumeracion.find(
      (dcompnum: any) =>
        dcompnum.sede_id === this.datoVenta[0]['sucursal_id'] &&
        dcompnum.comprobante_tipo === this.comprobanteTipo &&
        dcompnum.serie === this.comprobanteDatoSerie &&
        dcompnum.numero === '1'
    );
    if (!nuevodato) {
      console.log('NO EXISTE');
    } else {
      console.log(nuevodato);
    } */

    //PROCEDEMOS A GUARDAR
    Notiflix.Loading.hourglass('Enviando...');
    this.comprobantesService.postComprobante(dataComprobante).subscribe({
      next: (response) => {
        console.log(response);
        this.datosProductosDetalle.forEach((producto: any) => {
          const dataComprobanteDetalles = {
            comprobante: response, //comprobante_id
            codigo: producto.codigoProducto, //producto_codigo
            nombre: producto.nombreProducto, //producto_nombre
            precio: producto.precio_venta, //precio_venta
            cantidad: producto.cantidad_venta, //cantidad_venta
            medida: producto.medidaProducto, //medida
          };
          console.log(dataComprobanteDetalles);
          this.comprobantesDetalleService
            .postComprobanteDetalles(dataComprobanteDetalles)
            .subscribe({
              next: (response) => {
                console.log(response);
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
                  html: '<div style="font-size: 15px; font-weight: 700">Comprobante emitido exitosamente</div>',
                });
                //LLAMANOS PARA QUE CARGUE EL BOTON PARA VER PDF
                this.comprobantesAll();
              },
              error: (errorData) => {
                Notiflix.Loading.remove();
                Notiflix.Notify.failure('Ocurri&oacute; un error');
              },
              complete: () => {},
            });
        });
      },
      error: (errorData) => {
        console.log('Error al postear comprobante', errorData);
      },
      complete: () => {},
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  datosCOMPROBANTES: any;
  comprobantesAll(): void {
    this.comprobantesService.getComprobantesAll().subscribe({
      next: (datosCOMPROBANTES: any) => {
        if (datosCOMPROBANTES === 'NO hay resultados') {
          this.datosCOMPROBANTES = 'No hay resultados';
        } else {
          this.datosCOMPROBANTES = datosCOMPROBANTES;
          // Buscar el cliente correspondiente en datosCLI
          this.datosCOMPROBANTES = this.datosCOMPROBANTES.find(
            (comp: any) => Number(comp.venta_id) === this.ventaId
          );
          console.log(this.datosCOMPROBANTES);

          this.infoEmpresaAll();
          this.infoItemsComprobantesAll(this.datosCOMPROBANTES.comprobante_id);
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  infoEmpresa: any;
  infoEmpresaAll(): void {
    this.generalService.getDatosEmpresa().subscribe({
      next: (infoEmpresa: DatosEmpresa[]) => {
        this.infoEmpresa = infoEmpresa;
        this.infoEmpresa = this.infoEmpresa.find(
          (inempre: any) =>
            inempre.empresa_ruc === this.datosCOMPROBANTES.empresa_emision
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

  BSerie: any;
  BNumero: any;
  FSerie: any;
  FNumero: any;

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

  enviarCorreoElectronico(pdfBase64: string) {
    // Configura tus credenciales y configuración de emailjs-com
    emailjs.init('Wh1xUauFDsJtWNwdI');

    // Configura el servicio de correo electrónico y la plantilla
    const serviceID = 'service_wi78nka';
    const templateID = 'template_3a1nypl';

    // Configura los parámetros del correo electrónico
    const emailParams = {
      to_email: 'wesaxak955@vasteron.com',
      subject: 'Asunto del correo electrónico',
      message: 'Cuerpo del correo electrónico',
      attachment: pdfBase64,
    };

    // Envía el correo electrónico
    emailjs.send(serviceID, templateID, emailParams).then(
      (response) => {
        console.log('Correo electrónico enviado con éxito:', response);
      },
      (error) => {
        console.error('Error al enviar el correo electrónico:', error);
      }
    );
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
    SERIE Y NUMERO: ${this.datosCOMPROBANTES.comprobante_serie}-${this.datosCOMPROBANTES.comprobante_numero}`;

    const mensajeCodificado = encodeURIComponent(mensaje);
    const enlaceWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;

    window.open(enlaceWhatsApp, '_blank');
  }
}
