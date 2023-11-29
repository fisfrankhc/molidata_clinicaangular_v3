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

import { jsPDF } from 'jspdf';
import { DatePipe } from '@angular/common';

import { VentasDetalle } from 'src/app/shared/interfaces/farmacia';
import { DatosEmpresa } from 'src/app/shared/interfaces/empresa';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { TDocumentDefinitions } from 'pdfmake/interfaces';

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
    public generalService: GeneralService
  ) {}
  ventaId: number | null = null;
  public ruta = rutas;
  usernombre = localStorage.getItem('usernombre');

  datosEMP: any = {};
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const ventaIdParam = params.get('venta_id');
      if (ventaIdParam !== null) {
        this.ventaId = +ventaIdParam;
      }
    });
    this.clientesAll();
    this.productosAll();
    this.medidasAll();

    this.mediosPagoService.getMediosPagoAll().subscribe((data: any) => {
      this.mediosPago = data;
    });

    this.generalService.getDatosEmpresa().subscribe({
      next: (datosEMP: DatosEmpresa[]) => {
        this.datosEMP = datosEMP[0];
        console.log(this.datosEMP);
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
        console.log(this.datosProductosDetalle);
        // Mapea los nombres de los clientes a los datos de ventas
        this.datosProductosDetalle = this.datosProductosDetalle.map(
          (ventasDetalle: VentasDetalle) => {
            //PARA PRODUCTO
            const producto = this.datosPRO.find(
              (pro: any) => pro.prod_id === ventasDetalle.prod_id
            );
            console.log(producto);
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
    const parteEntera = Math.floor(this.calcularSubtotalTotal());
    const parteDecimal = Math.round(
      (this.calcularSubtotalTotal() - parteEntera) * 100
    );

    const parteEnteraEnPalabras = this.numeroAString(parteEntera);
    const parteDecimalEnPalabras = this.numeroAString(parteDecimal);

    return `${parteEnteraEnPalabras} con ${parteDecimalEnPalabras}/100 soles`;
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

    /* if (numero < 10) {
      return unidades[numero];
    } else if (numero < 20) {
      //return 'Diez' + (numero === 10 ? '' : ' y ' + unidades[numero - 10]);
      return especiales[numero - 10];
    } else if (numero < 100) {
      const unidad = numero % 10;
      const decena = Math.floor(numero / 10);
      return decenas[decena] + (unidad > 0 ? ' y ' + unidades[unidad] : '');
    } else {
      const unidad = numero % 10;
      const decena = Math.floor((numero % 100) / 10);
      const centena = Math.floor(numero / 100);
      let result = centenas[centena];

      if (decena > 0 || unidad > 0) {
        result +=
          ' ' +
          (decena > 0 ? decenas[decena] : '') +
          (unidad > 0 ? ' y ' + unidades[unidad] : '');
      }

      return result;
    } */

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
    } else {
      const partes: string[] = [];
      let numeroRestante = Math.abs(numero);
      const billones = Math.floor(numeroRestante / 1e12);
      if (billones > 0) {
        partes.push(this.numeroAString(billones) + ' Billones');
        numeroRestante %= 1e12;
      }

      const millones = Math.floor(numeroRestante / 1e6);
      if (millones > 0) {
        partes.push(this.numeroAString(millones) + ' Millones');
        numeroRestante %= 1e6;
      }

      const miles = Math.floor(numeroRestante / 1e3);
      if (miles > 0) {
        partes.push(this.numeroAString(miles) + ' Mil');
        numeroRestante %= 1e3;
      }

      if (numeroRestante > 0) {
        partes.push(this.numeroAString(numeroRestante));
      }

      return partes.join(' ');
    }
  }

  generarPDF() {
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

  /*   generarPDF() {
    const contenidoHTMLElement = document.getElementById('ticketEmitir');

    if (contenidoHTMLElement) {
      const contenidoHTML = contenidoHTMLElement.outerHTML;

      const documentDefinition: TDocumentDefinitions = {
        content: [
          {
            text: 'Nota de Venta Electrónica',
            fontSize: 18,
            alignment: 'center',
            bold: true,
          },
          { text: '', margin: [0, 10] }, // espacio en blanco
          {
            text: 'Detalles del Ticket',
            fontSize: 14,
            alignment: 'center',
            bold: true,
          },
          { text: '', margin: [0, 10] }, // espacio en blanco
          {
            text: {
              text: '',
              link:
                'data:text/html;charset=utf-8,' +
                encodeURIComponent(contenidoHTML),
            },
          },
        ],
      };

      pdfMake.createPdf(documentDefinition).open();
    } else {
      console.error('Elemento con ID "ticketEmitir" no encontrado.');
    }
  } */
}
