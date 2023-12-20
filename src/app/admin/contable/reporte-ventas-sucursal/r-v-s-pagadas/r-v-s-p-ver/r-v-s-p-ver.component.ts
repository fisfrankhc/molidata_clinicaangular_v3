import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { rutas } from 'src/app/shared/routes/rutas';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { VentasItemService } from 'src/app/shared/services/farmacia/ventas/ventas-item.service';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { OperacionService } from 'src/app/shared/services/farmacia/caja/operacion.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { DatePipe } from '@angular/common';
import { mergeMap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-r-v-s-p-ver',
  templateUrl: './r-v-s-p-ver.component.html',
  styleUrls: ['./r-v-s-p-ver.component.scss'],
})
export class RVSPVerComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  usersucursal = localStorage.getItem('usersucursal');
  userid = localStorage.getItem('userid');
  ventasList = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sucursalService: SucursalService,
    private ventasService: VentasService,
    private ventasItemService: VentasItemService,
    private clientesService: ClientesService,
    private operacionService: OperacionService,
    private generalService: GeneralService,
    private datePipe: DatePipe
  ) {}

  sucursalID: number = 0;
  fechainicio: any;
  fechafin: any;
  fechaInicioFormato: any;
  fechaFinFormato: any;
  public ruta = rutas;
  datoPRODUCTO: any[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const sucursalID = params.get('sucursal_id');
      if (sucursalID !== null) {
        this.sucursalID = +sucursalID;
      }
      /* const sucursalID = params.get('sucursal_id');
      this.sucursalID = sucursalID !== null ? parseInt(sucursalID, 10) : 0; */

      const fechainicio = params.get('fechainicio');
      if (fechainicio !== null) {
        this.fechainicio = fechainicio;
      }
      //this.fechainicio = params.get('fechainicio');
      this.fechaInicioFormato = this.datePipe.transform(
        this.fechainicio,
        'dd/MM/yyyy'
      );

      const fechafin = params.get('fechafin');
      if (fechafin !== null) {
        this.fechafin = fechafin;
      }
      //this.fechafin = params.get('fechafin');
      this.fechaFinFormato = this.datePipe.transform(
        this.fechafin,
        'dd/MM/yyyy'
      );
    });

    const initialForm = this.fb.group({
      datosGenerales: this.fb.group({
        sucursalNombre: [''],
        sucursalDireccion: [''],
        fechaBusqueda: [''],
      }),
      listaVenta: this.fb.array([]), // FormArray para la lista de compra
    });

    // Asignar el formulario
    this.form = initialForm;
    this.sucursalInfo();
    this.clienteInfo();
    this.operacionAll();
    this.ventasAll();
    this.usuariosAll();
  }

  datoSUCURSAL: any;
  datoNombreSucursal: string = '';
  sucursalInfo(): void {
    this.sucursalService.getSucursal(this.sucursalID).subscribe({
      next: (datoSUCURSAL: any) => {
        this.datoSUCURSAL = datoSUCURSAL[0];
        console.log(this.datoSUCURSAL);
        this.form
          .get('datosGenerales.sucursalNombre')
          ?.setValue(this.datoSUCURSAL.suc_nombre);
        this.datoNombreSucursal = this.datoSUCURSAL.suc_nombre;
        this.form
          .get('datosGenerales.sucursalDireccion')
          ?.setValue(this.datoSUCURSAL.suc_direccion);
        this.form
          .get('datosGenerales.fechaBusqueda')
          ?.setValue(
            'Del ' + this.fechaInicioFormato + ' al ' + this.fechaFinFormato
          );
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosUSER: any;
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (response: any) => {
        this.datosUSER = response;
      },
      error: () => {},
      complete: () => {},
    });
  }
  datosCLI: any;
  clienteInfo(): void {
    this.clientesService.getClientesAll().subscribe({
      next: (response: any) => {
        this.datosCLI = response;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosOPERACION: any;
  operacionAll(): void {
    this.operacionService.getOperacionAll().subscribe({
      next: (response: any) => {
        this.datosOPERACION = response;
      },
      error: () => {},
      complete: () => {},
    });
  }

  /*   datosVENTA: any;
  ventasAll(): void {
    this.ventasService.getVentasAll().subscribe({
      next: (datosVENTA: any) => {
        this.datosVENTA = datosVENTA;
        const dataSucursal = this.datosVENTA.filter(
          (vent: any) =>
            vent.venta_fecha >= this.fechainicio &&
            vent.venta_fecha <= this.fechafin &&
            vent.venta_proceso == 'PAGADO' &&
            vent.sucursal_id == this.sucursalID
        );

        this.datosVENTA = dataSucursal;
        this.datosVENTA.forEach((datoVentaItem: any) => {
          this.ventasItemService
            .getVentaItem(datoVentaItem.venta_id)
            .subscribe({
              next: (response: any) => {
                console.log(response);
                // Inicializa la suma total para cada venta_id
                let sumaCantidaPrecio: number = 0;

                // Itera sobre cada objeto en el array de respuesta
                response.forEach((item: any) => {
                  // Verifica si las propiedades necesarias están presentes y son numéricas
                  if (
                    item.hasOwnProperty('cantidad_venta') &&
                    item.hasOwnProperty('precio_venta') &&
                    !isNaN(item.cantidad_venta) &&
                    !isNaN(item.precio_venta)
                  ) {
                    const cantidadVenta = parseFloat(item.cantidad_venta);
                    const precioVenta = parseFloat(item.precio_venta);

                    // Suma el producto de cantidad_venta y precio_venta al total
                    sumaCantidaPrecio += cantidadVenta * precioVenta;
                  } else {
                    console.error('Error: Datos de venta_item no válidos.');
                  }
                });
                // Limita el número de decimales a 2
                const sumaTotalConDecimales = sumaCantidaPrecio.toFixed(2);
                // Asigna la suma total formateada a la propiedad sumatotal
                datoVentaItem.sumatotal = parseFloat(sumaTotalConDecimales);
              },
              error: () => {},
              complete: () => {
                // Puedes hacer algo aquí después de procesar cada item, si es necesario
              },
            });
        });
        console.log(this.datosVENTA);

        this.datosVENTA.forEach((datoVentac: any) => {
          const cliente = this.datosCLI.find(
            (cli: any) => cli.cli_id === datoVentac.cliente_id
          );
          if (cliente) {
            datoVentac.tipoDocumento = cliente.tipo_documento;
            datoVentac.numeroDocumento = cliente.numero_documento;
            datoVentac.clienteNombre = cliente.cli_nombre;
          }
          
        });

        this.ventasList = this.datosVENTA;
      },
      error: () => {},
      complete: () => {
        // Puedes hacer algo aquí después de procesar todas las ventas
      },
    });
  } */

  /*   datosVENTA: any;
  async ventasAll(): Promise<void> {
    try {
      this.datosVENTA = await this.ventasService.getVentasAll().toPromise();

      const dataSucursal = this.datosVENTA.filter(
        (vent: any) =>
          vent.venta_fecha >= this.fechainicio &&
          vent.venta_fecha <= this.fechafin &&
          vent.venta_proceso == 'PAGADO' &&
          vent.sucursal_id == this.sucursalID
      );

      this.datosVENTA = dataSucursal;

      await Promise.all(
        this.datosVENTA.map(async (datoVentaItem: any) => {
          const response = await this.ventasItemService
            .getVentaItem(datoVentaItem.venta_id)
            .toPromise();

          let sumaCantidaPrecio: number = 0;

          response.forEach((item: any) => {
            if (
              item.hasOwnProperty('cantidad_venta') &&
              item.hasOwnProperty('precio_venta') &&
              !isNaN(item.cantidad_venta) &&
              !isNaN(item.precio_venta)
            ) {
              const cantidadVenta = parseFloat(item.cantidad_venta);
              const precioVenta = parseFloat(item.precio_venta);
              sumaCantidaPrecio += cantidadVenta * precioVenta;
            } else {
              console.error('Error: Datos de venta_item no válidos.');
            }
          });

          const sumaTotalConDecimales = sumaCantidaPrecio.toFixed(2);
          datoVentaItem.sumatotal = parseFloat(sumaTotalConDecimales);
        })
      );

      console.log(this.datosVENTA);

      this.datosVENTA.forEach((datoVentac: any) => {
        const cliente = this.datosCLI.find(
          (cli: any) => cli.cli_id === datoVentac.cliente_id
        );
        if (cliente) {
          datoVentac.tipoDocumento = cliente.tipo_documento;
          datoVentac.numeroDocumento = cliente.numero_documento;
          datoVentac.clienteNombre = cliente.cli_nombre;
        }
      });

      this.ventasList = this.datosVENTA;
    } catch (error) {
      console.error('Error en ventasAll:', error);
    }
  } */

  datosVENTA: any;

  ventasAll(): void {
    this.ventasService
      .getVentasAll()
      .pipe(
        mergeMap(async (datosVENTA: any) => {
          this.datosVENTA = datosVENTA;
          const datosDeVenta = this.datosVENTA.filter(
            (vent: any) =>
              vent.venta_fecha >= this.fechainicio &&
              vent.venta_fecha <= this.fechafin &&
              vent.venta_proceso == 'PAGADO' &&
              vent.sucursal_id == this.sucursalID
          );

          this.datosVENTA = datosDeVenta;

          // Utilizar Promise.all para manejar múltiples peticiones simultáneas
          await Promise.all(
            this.datosVENTA.map(async (datoVentaItem: any) => {
              try {
                const response = await firstValueFrom(
                  this.ventasItemService.getVentaItem(datoVentaItem.venta_id)
                );

                console.log(response);
                let sumaCantidaPrecio: number = 0;

                response.forEach((item: any) => {
                  if (
                    item.hasOwnProperty('cantidad_venta') &&
                    item.hasOwnProperty('precio_venta') &&
                    !isNaN(item.cantidad_venta) &&
                    !isNaN(item.precio_venta)
                  ) {
                    const cantidadVenta = parseFloat(item.cantidad_venta);
                    const precioVenta = parseFloat(item.precio_venta);

                    sumaCantidaPrecio += cantidadVenta * precioVenta;
                  } else {
                    console.error('Error: Datos de venta_item no válidos.');
                  }
                });

                const sumaTotalConDecimales = sumaCantidaPrecio.toFixed(2);
                datoVentaItem.sumatotal = parseFloat(sumaTotalConDecimales);
              } catch (error) {
                console.error('Error obteniendo datos de venta_item:', error);
              }
            })
          );

          console.log(this.datosVENTA);

          this.datosVENTA.forEach((datoVentac: any) => {
            const cliente = this.datosCLI.find(
              (cli: any) => cli.cli_id === datoVentac.cliente_id
            );
            if (cliente) {
              datoVentac.tipoDocumento = cliente.tipo_documento;
              datoVentac.numeroDocumento = cliente.numero_documento;
              datoVentac.clienteNombre = cliente.cli_nombre;
            }

            const operacion = this.datosOPERACION.find(
              (ope: any) =>
                ope.motivo_codigo === datoVentac.venta_id &&
                ope.motivo_pago == 'VENTA'
            );
            if (operacion) {
              datoVentac.tipoPago = operacion.medio_pago;
              datoVentac.usuarioCobro = operacion.user_id;
            }

            const usuarioVenta = this.datosUSER.find(
              (usventa: any) => usventa.user_id === datoVentac.usuario_id
            );
            if (usuarioVenta) {
              datoVentac.usuarioIdNombre = usuarioVenta.user_nombre;
            }
            const usuarioCobro = this.datosUSER.find(
              (uscobro: any) => uscobro.user_id === datoVentac.usuarioCobro
            );
            if (usuarioCobro) {
              datoVentac.usuarioCobroNombre = usuarioCobro.user_nombre;
            }
          });

          this.ventasList = this.datosVENTA;
        })
      )
      .subscribe({
        error: () => {},
        complete: () => {
          // Puedes hacer algo aquí después de procesar todas las ventas
        },
      });
  }

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  calcularSubtotalTotal(): number {
    if (!this.datosVENTA) {
      return 0;
    }

    // Proporciona tipos explícitos para los parámetros total y venta
    return this.datosVENTA.reduce(
      (total: number, venta: any) => total + venta.sumatotal,
      0
    );
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow([
      '',
      'REPORTE DE VENTAS CONCRETADAS POR SUCURSAL',
    ]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`B${titleRow.number}:G${titleRow.number}`);
    // Aplica estilo al fondo del título solo a las celdas combinadas
    const titleRange = worksheet.getCell(`B${titleRow.number}`);
    titleRange.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
    };
    // Aplica bordes delgados a las celdas combinadas
    titleRange.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    titleRow.height = 30;

    const datosRow = worksheet.addRow([
      '',
      'SUCURSAL',
      this.datoNombreSucursal,
      'DEL',
      this.fechaInicioFormato,
      'AL',
      this.fechaFinFormato,
    ]);
    datosRow.height = 20;

    // Configura bordes para las columnas B a G
    for (let col = 2; col <= 7; col++) {
      const cell = datosRow.getCell(col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    // Espaciador entre el título y los encabezados
    worksheet.addRow([]); // Esto agrega una fila vacía

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Estilo para los encabezados
    const headerStyle = {
      font: { bold: true, size: 12 },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
      } as ExcelJS.Fill,
    };

    // Agrega encabezados con estilo y asigna anchos
    const headers = [
      { header: 'CODIGO DE VENTA', key: 'codigo de venta' },
      { header: 'CLIENTE DOCUMENTO', key: 'cliente documento' },
      { header: 'DOCUMENTO NUMERO', key: 'documento numero' },
      { header: 'CLIENTE NOMBRE', key: 'cliente nombre' },
      { header: 'FECHA DE VENTA', key: 'fecha de venta' },
      { header: 'TIPO DE PAGO', key: 'tipo de pago' },
      { header: 'ESTADO DE VENTA', key: 'estado de venta' },
      { header: 'MONTO', key: 'monto' },
      { header: 'USUARIO VENTA', key: 'usuario venta' },
      { header: 'USUARIO COBRO', key: 'usuario cobro' },
    ];

    // Ajusta la altura de la fila de encabezados
    const headerRow = worksheet.addRow(headers.map((header) => header.header));
    headerRow.height = 30; // Altura del header

    headerRow.eachCell((cell, colNumber) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;

      // Centra el texto en la celda
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Configura bordes para la fila de encabezados
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega datos
    this.datosVENTA.forEach((data: any) => {
      // Redondea el valor de data.montotal a 2 decimales
      //const montoFormateado = data.montotal.toFixed(2);
      const row = [
        data.venta_id,
        data.tipoDocumento,
        data.numeroDocumento,
        data.clienteNombre,
        data.venta_fecha,
        data.tipoPago,
        data.venta_proceso,
        data.sumatotal,
        data.usuarioIdNombre,
        data.usuarioCobroNombre,
      ];

      const excelRow = worksheet.addRow(row);
      excelRow.height = 20; // Altura del header

      // Configura bordes para las celdas en la fila de datos
      excelRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // Centra las celdas específicas en la fila de datos
      excelRow.getCell(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // CODIGO DE VENTA
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // CLIENTE DOCUMENTO
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // DOCUMENTO NUMERO
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // CLIENTE NOMBRE
      excelRow.getCell(5).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // FECHA DE VENTA
      excelRow.getCell(6).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // TIPO DE PAGO
      excelRow.getCell(7).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // ESTADO DE VENTA
      excelRow.getCell(8).alignment = {
        vertical: 'middle',
        horizontal: 'right',
      }; // MONTO
      excelRow.getCell(9).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // USUARIO VENTA
      excelRow.getCell(10).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // USUARIO COBRO
      // Configura el formato de la celda para la columna del monto
      const montoCell = excelRow.getCell(8);
      //montoCell.alignment = {vertical: 'middle',horizontal: 'center',}; // MONTO
      montoCell.numFmt = '#,##0.00'; // Formato de número con 2 decimales
    });

    // Ajustar el ancho de las columnas A, B y C
    worksheet.getColumn('A').width = 20; // Ancho de la columna A
    worksheet.getColumn('B').width = 25; // Ancho de la columna B
    worksheet.getColumn('C').width = 27; // Ancho de la columna C
    worksheet.getColumn('D').width = 35; // Ancho de la columna D
    worksheet.getColumn('E').width = 20; // Ancho de la columna E
    worksheet.getColumn('F').width = 25; // Ancho de la columna F
    worksheet.getColumn('G').width = 20; // Ancho de la columna G
    worksheet.getColumn('H').width = 15; // Ancho de la columna H
    worksheet.getColumn('I').width = 20; // Ancho de la columna I
    worksheet.getColumn('J').width = 20; // Ancho de la columna J

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Reporte detalle de Ventas Concretadas de la Sucursal ' +
        this.datoNombreSucursal +
        ' del ' +
        this.fechaInicioFormato +
        ' al ' +
        this.fechaFinFormato +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
