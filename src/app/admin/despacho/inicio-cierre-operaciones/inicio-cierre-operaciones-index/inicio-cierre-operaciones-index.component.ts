import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { GeneralService } from 'src/app/shared/services/general.service';
import { InicioCierreOperacionesService } from 'src/app/shared/services/despacho/inicio-cierre-operaciones/inicio-cierre-operaciones.service';
import { VentasService } from 'src/app/shared/services/despacho/ventas/ventas.service';
import { VentasItemService } from 'src/app/shared/services/despacho/ventas/ventas-item.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { OperacionService } from 'src/app/shared/services/despacho/caja/operacion.service';

import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-inicio-cierre-operaciones-index',
  templateUrl: './inicio-cierre-operaciones-index.component.html',
  styleUrls: ['./inicio-cierre-operaciones-index.component.scss'],
})
export class InicioCierreOperacionesIndexComponent implements OnInit {
  form: FormGroup = new FormGroup({}); // Declaración con valor inicial;
  public ruta = rutas;
  userid = localStorage.getItem('userid');
  usersucursal: any = localStorage.getItem('usersucursal');
  fechaActual = new Date();
  fechaFormateadaver = this.datePipe.transform(this.fechaActual, 'dd/MM/yyyy');
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'yyyy/MM/dd');
  fechaFormateadaVTabla = this.datePipe.transform(
    this.fechaActual,
    'yyyy-MM-dd'
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private generalService: GeneralService,
    private inicioCierreOperacionesService: InicioCierreOperacionesService,
    private ventasService: VentasService,
    private ventasItemService: VentasItemService,
    private sucursalService: SucursalService,
    private operacionService: OperacionService
  ) {}

  ngOnInit(): void {
    const initialForm = this.fb.group({
      aperturaCaja: this.fb.group({
        usuario: ['', Validators.required],
        nombreUsuario: [''],
        fecha: [''],
        tipo: ['APERTURA'],
        monto: [''],
      }),
      cierreCaja: this.fb.group({
        usuario: ['', Validators.required],
        nombreUsuario: [''],
        fecha: [''],
        tipo: ['CIERRE'],
      }),
    });
    // Asignar el formulario
    this.form = initialForm;

    this.sucursalGet(this.usersucursal);
    this.usuariosGet(this.userid);
    this.inicioCierreOperacionesServiceAll();
  }

  dataSUC: any;
  dataNombreSucursal: string = '';
  sucursalGet(usersucursal: number): void {
    this.sucursalService.getSucursal(usersucursal).subscribe({
      next: (response: any) => {
        //console.log(response);
        this.dataNombreSucursal = response[0].suc_nombre;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosUSER: any;
  dataNombreUsuario: string = '';
  usuariosGet(usuarioId: string | null): void {
    this.generalService.getUsuario(usuarioId).subscribe({
      next: (datosUSER: any) => {
        this.datosUSER = datosUSER;
        //console.log(this.datosUSER);
        const usuarioEncontrado = this.datosUSER[0];
        this.dataNombreUsuario = this.datosUSER[0].user_nombre;
        //console.log(usuarioEncontrado);
        if (usuarioEncontrado) {
          this.form.get('aperturaCaja')?.patchValue({
            usuario: usuarioEncontrado.user_id,
            nombreUsuario: usuarioEncontrado.user_nombre,
            fecha: this.fechaFormateada,
          });
          this.form.get('cierreCaja')?.patchValue({
            usuario: usuarioEncontrado.user_id,
            nombreUsuario: usuarioEncontrado.user_nombre,
            fecha: this.fechaFormateada,
          });
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosICOperaciones: any;
  ICOperacionesEncontrado1: any;
  ICOperacionesEncontrado2: any;
  inicioCierreOperacionesServiceAll(): void {
    this.inicioCierreOperacionesService
      .getInicioCierreOperacionesAll()
      .subscribe({
        next: (data) => {
          this.datosICOperaciones = data;

          //VALIDACION 1
          this.ICOperacionesEncontrado1 = this.datosICOperaciones.find(
            (ICO: any) =>
              ICO.user_id === this.userid &&
              ICO.sesion_tipo == 'APERTURA' &&
              ICO.sesion_fecha == this.fechaFormateadaVTabla
          ); //this.fechaFormateadaVTabla
          if (this.ICOperacionesEncontrado1) {
            //console.log(this.ICOperacionesEncontrado1);
          }

          //VALIDACION 2
          this.ICOperacionesEncontrado2 = this.datosICOperaciones.find(
            (ICO: any) =>
              ICO.user_id === this.userid &&
              ICO.sesion_tipo == 'CIERRE' &&
              ICO.sesion_fecha == this.fechaFormateadaVTabla
          ); //this.fechaFormateadaVTabla
          if (this.ICOperacionesEncontrado2) {
            this.ventasAll();
            this.operacionesAll();
            //console.log(this.ICOperacionesEncontrado2);
          }
        },
        error: (errorData) => {
          console.log(errorData);
        },
        complete: () => {},
      });
  }

  dataApertura: any;
  apertura() {
    if (this.ICOperacionesEncontrado1) {
      Swal.fire('Ya ha realizado la apertura de CAJA en el dia!');
    } else {
      this.dataApertura = this.form.get('aperturaCaja')?.value;
      //console.log(this.dataApertura);
      this.inicioCierreOperacionesService
        .postInicioCierreOperaciones(this.dataApertura)
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (errorData) => {
            console.log(errorData);
          },
          complete: () => {
            this.inicioCierreOperacionesServiceAll();
            //this.router.navigate(['/despacho/inicio-cierre-operaciones']);
            this.router.navigate([rutas.despacho_iniciocierre_operaciones]);
          },
        });
    }
  }

  dataCierre: any;
  cierre() {
    //console.log(this.form.get('cierreCaja')?.value);
    if (this.ICOperacionesEncontrado2) {
      Swal.fire('Ya ha realizado el cierre de CAJA en el dia!');
    } else {
      this.dataCierre = this.form.get('cierreCaja')?.value;
      //console.log(this.dataApertura);
      this.inicioCierreOperacionesService
        .postInicioCierreOperaciones(this.dataCierre)
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (errorData) => {
            console.log(errorData);
          },
          complete: () => {
            this.inicioCierreOperacionesServiceAll();
            //this.router.navigate(['/despacho/inicio-cierre-operaciones']);
            this.router.navigate([rutas.despacho_iniciocierre_operaciones]);
          },
        });
    }
  }

  datosVENTAS: any = [];
  sumatotal = 0;
  ventasAll(): void {
    this.ventasService.getVentasAll().subscribe({
      next: (response) => {
        this.datosVENTAS = response;
        const observables = this.datosUSER.map((usuario: any) => {
          const dataVenta = this.datosVENTAS.filter(
            (vent: any) =>
              vent.venta_fecha === this.fechaFormateadaVTabla &&
              vent.usuario_id === this.userid &&
              vent.venta_proceso === 'PAGADO'
          );
          //console.log(dataVenta);
          let sumaPrecioVenta = 0;
          let sumaCantidaPrecio: number = 0; // Inicializa con 0 o el valor inicial que desees

          if (dataVenta.length > 0) {
            const observablesVentaItem = dataVenta.map((datoVenta: any) => {
              return this.ventasItemService.getVentaItem(datoVenta.venta_id);
            });
            return forkJoin(observablesVentaItem).pipe(
              map((responses: any) => {
                //console.log(responses);
                responses.forEach((responseVentaItem: any) => {
                  //console.log(responseVentaItem);
                  responseVentaItem.forEach((datoVentaItem: any) => {
                    const precioVenta = datoVentaItem.precio_venta;
                    const cantidadVenta = datoVentaItem.cantidad_venta;
                    sumaCantidaPrecio +=
                      precioVenta * datoVentaItem.cantidad_venta;
                  });
                });
                usuario.montoIngresoVentas = parseFloat(
                  sumaCantidaPrecio.toFixed(2)
                );
                usuario.fechaVenta = this.fechaFormateadaVTabla;
                return usuario;
              })
            );
          } else {
            usuario.montoIngresoVentas = 0;
            usuario.fechaVenta = this.fechaFormateadaVTabla;
            return of(usuario);
          }
        });
        forkJoin(observables).subscribe({
          next: (vusuarios: any) => {
            this.datosVENTAS = vusuarios;
            //console.log(this.datosVENTAS);
            // Ahora puedes acceder a this.datosSUC con los valores actualizados
            //console.log(this.datosSUC);
          },
          error: (errorData) => {
            console.error(errorData);
          },
          complete: () => {
            // El código después de que todas las operaciones asíncronas se completen
          },
        });
      },
      error: (errorData) => {
        console.log(errorData);
      },
      complete: () => {},
    });
  }

  datosOPERACION: any;
  operacionesAll(): void {
    this.operacionService.getOperacionAll().subscribe({
      next: (response) => {
        //console.log(response);
        this.datosOPERACION = response;
        const dataOPE = this.datosOPERACION.filter(
          (ope: any) =>
            ope.fecha_pago === this.fechaFormateadaVTabla &&
            ope.user_id === this.userid
        );
        this.datosOPERACION = dataOPE;
        console.log(this.datosOPERACION);
      },
      error: (errorData) => {
        console.log(errorData);
      },
      complete: () => {},
    });
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow([
      'REPORTE DEL DIA ' + this.fechaFormateadaver,
    ]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:C${titleRow.number}`);
    // Aplica estilo al fondo del título solo a las celdas combinadas
    const titleRange = worksheet.getRow(titleRow.number);
    titleRange.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
      };
    });
    // Configura bordes para la fila del título
    titleRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega una fila para el título del reporte
    const titleRow2 = worksheet.addRow(['INGRESOS']);
    titleRow2.font = { bold: true, size: 16 };
    titleRow2.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow2.number}:C${titleRow2.number}`);
    // Aplica estilo al fondo del título solo a las celdas combinadas
    const titleRange2 = worksheet.getRow(titleRow2.number);
    titleRange2.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
      };
    });
    // Configura bordes para la fila del título
    titleRow2.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    const montoApertura: number = this.ICOperacionesEncontrado1
      ? parseFloat(this.ICOperacionesEncontrado1.sesion_monto)
      : 0; // Verifica si se encontró una operación de apertura,
    // Agrega una fila para "APERTURA"
    const aperturaRow = worksheet.addRow(['', 'APERTURA', montoApertura]);
    aperturaRow.getCell(3).alignment = {
      vertical: 'middle',
      horizontal: 'right',
    };
    aperturaRow.getCell(3).numFmt = '#,##0.00';
    aperturaRow.eachCell((cell) => {
      // Configura bordes para la fila
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    const ventaTotalIngresos: number = this.datosVENTAS
      ? parseFloat(this.datosVENTAS[0].montoIngresoVentas)
      : 0;
    // Agrega una fila para "VENTAS"
    const ventasRow = worksheet.addRow(['', 'VENTAS', ventaTotalIngresos]);
    ventasRow.getCell(3).numFmt = '#,##0.00';
    ventasRow.eachCell((cell) => {
      // Configura bordes para la fila
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    const otros = 0;
    // Agrega una fila para "OTROS"
    const otrosRow = worksheet.addRow(['', 'OTROS', otros]);
    otrosRow.eachCell((cell) => {
      // Configura bordes para la fila
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    const totalIngresos = montoApertura + ventaTotalIngresos + otros;
    // Agrega una fila para "TOTAL INGRESOS"
    const totalIngresosRow = worksheet.addRow([
      'TOTAL INGRESOS',
      '',
      totalIngresos,
    ]);
    totalIngresosRow.font = { bold: true, size: 11 };
    totalIngresosRow.alignment = { vertical: 'middle' };
    // Alinea al centro las celdas de las columnas A y B
    totalIngresosRow.getCell(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    totalIngresosRow.getCell(2).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.mergeCells(
      `A${totalIngresosRow.number}:B${totalIngresosRow.number}`
    );
    totalIngresosRow.getCell(3).numFmt = '#,##0.00';
    totalIngresosRow.eachCell((cell) => {
      // Configura bordes para la fila
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega una fila para el título de EGRESOS
    const egresosRow = worksheet.addRow(['EGRESOS']);
    egresosRow.font = { bold: true, size: 16 };
    egresosRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${egresosRow.number}:C${egresosRow.number}`);
    // Aplica estilo al fondo del título solo a las celdas combinadas
    const titleEgresos = worksheet.getRow(egresosRow.number);
    titleEgresos.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
      };
    });
    // Configura bordes para la fila del título
    egresosRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega una fila para "GASTOS"
    const gastosRow = worksheet.addRow(['', 'GASTOS', 0]);
    gastosRow.eachCell((cell) => {
      // Configura bordes para la fila
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega una fila para "OTROSGASTOS"
    const otrosGastosRow = worksheet.addRow(['', 'OTROS', 0]);
    otrosGastosRow.eachCell((cell) => {
      // Configura bordes para la fila
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    const totalEgresos = 0;

    // Agrega una fila para "TOTAL INGRESOS"
    const totalEgresosRow = worksheet.addRow([
      'TOTAL EGRESOS',
      '',
      totalEgresos,
    ]);
    totalEgresosRow.font = { bold: true, size: 11 };
    totalEgresosRow.alignment = { vertical: 'middle' };
    // Alinea al centro las celdas de las columnas A y B
    totalEgresosRow.getCell(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    totalEgresosRow.getCell(2).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.mergeCells(
      `A${totalEgresosRow.number}:B${totalEgresosRow.number}`
    );
    totalEgresosRow.getCell(3).numFmt = '#,##0.00';
    totalEgresosRow.eachCell((cell) => {
      // Configura bordes para la fila
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega una fila para el título de SALDO
    const saldo = totalIngresos + totalEgresos;
    const saldoRow = worksheet.addRow(['SALDO', '', saldo]);
    saldoRow.font = { bold: true, size: 16 };
    saldoRow.getCell(3).numFmt = '#,##0.00';
    saldoRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${saldoRow.number}:B${saldoRow.number}`);
    // Aplica estilo al fondo del título solo a las celdas combinadas
    saldoRow.eachCell((cell) => {
      (cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
      }),
        (cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        });
    });

    // Ajustar la altura de la fila 1 (título del informe)
    const rowUno = worksheet.getRow(1);
    rowUno.height = 30; // Ajusta la altura según tus necesidades
    const rowDos = worksheet.getRow(2);
    rowDos.height = 25; // Ajusta la altura según tus necesidades
    const rowSiete = worksheet.getRow(7);
    rowSiete.height = 25; // Ajusta la altura según tus necesidades
    const rowOnce = worksheet.getRow(11);
    rowOnce.height = 25; // Ajusta la altura según tus necesidades

    // Ajustar el ancho de las columnas A, B y C
    worksheet.getColumn('A').width = 15; // Ancho de la columna A
    worksheet.getColumn('B').width = 30; // Ancho de la columna B
    worksheet.getColumn('C').width = 20; // Ancho de la columna C

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Reporte de Ventas del dia ' + this.fechaFormateadaver + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  exportOperacionesToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow([
      'REPORTE DE DETALLE DE OPERACIONES ' + this.fechaFormateadaver,
    ]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:J${titleRow.number}`);
    // Aplica estilo al fondo del título solo a las celdas combinadas
    const titleRange = worksheet.getRow(titleRow.number);
    titleRange.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
      };
    });
    // Configura bordes para la fila del título
    titleRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Agrega una fila para el título del reporte
    const titleRow2 = worksheet.addRow([
      'INGRESOS',
      this.dataNombreSucursal,
      '',
      '',
      '',
      '',
      'USUARIO',
      this.dataNombreUsuario,
    ]);
    titleRow2.font = { bold: true, size: 12 };
    titleRow2.alignment = { vertical: 'middle', horizontal: 'center' };
    // Configura bordes para las columnas A, B, G y H
    for (let col = 1; col <= titleRow2.actualCellCount; col++) {
      const cell = titleRow2.getCell(col);
      if (col === 1 || col === 2 || col === 7 || col === 8) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
      if (col === 1 || col === 7) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
        };
      }
    }

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
      { header: 'OPERACION ID', key: 'operacionid' },
      { header: 'USUARIO', key: 'usuario' },
      { header: 'FECHA PAGO', key: 'fechapago' },
      { header: 'TIPO', key: 'tipo' },
      { header: 'MONTO', key: 'monto' },
      { header: 'MOTIVO', key: 'motivo' },
      { header: 'MOTIVO CODIGO', key: 'motivocodigo' },
      { header: 'DESCRIPCION', key: 'descripcion' },
      { header: 'MEDIO DE PAGO', key: 'mediopago' },
      { header: 'MEDIO DETALLE', key: 'mediodetalle' },
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
    this.datosOPERACION.forEach((data: any) => {
      const montoPago = parseFloat(data.monto_pago);
      // Redondea el valor de data.montotal a 2 decimales
      //const montoFormateado = data.montotal.toFixed(2);
      const row = [
        data.ope_id,
        this.dataNombreUsuario,
        data.fecha_pago,
        data.ope_tipo,
        montoPago,
        data.motivo_pago,
        data.motivo_codigo,
        data.descripcion_pago,
        data.medio_pago,
        data.medio_detalle,
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
      }; // OPERACION ID
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // USUARIO
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // FECHA PAGO
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // TIPO
      excelRow.getCell(5).alignment = {
        vertical: 'middle',
        horizontal: 'right',
      }; // MONTO
      excelRow.getCell(6).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // MOTIVO
      excelRow.getCell(7).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // MOTIVO CODIGO
      excelRow.getCell(8).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // DESCRIPCION
      excelRow.getCell(9).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // MEDIO DE PAGO
      excelRow.getCell(10).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // MEDIO DETALLE
      // Configura el formato de la celda para la columna del monto
      const montoCell = excelRow.getCell(5);
      //montoCell.alignment = {vertical: 'middle',horizontal: 'center',}; // MONTO
      montoCell.numFmt = '#,##0.00'; // Formato de número con 2 decimales
    });

    // Ajustar la altura de la fila 1 (título del informe)
    const rowUno = worksheet.getRow(1);
    rowUno.height = 30; // Ajusta la altura según tus necesidades
    const rowDos = worksheet.getRow(2);
    rowDos.height = 25; // Ajusta la altura según tus necesidades
    const rowTres = worksheet.getRow(3);
    rowTres.height = 25; // Ajusta la altura según tus necesidades

    // Ajustar el ancho de las columnas A, B y C
    worksheet.getColumn('A').width = 15; // Ancho de la columna A
    worksheet.getColumn('B').width = 25; // Ancho de la columna B
    worksheet.getColumn('C').width = 20; // Ancho de la columna C
    worksheet.getColumn('D').width = 15; // Ancho de la columna D
    worksheet.getColumn('E').width = 15; // Ancho de la columna E
    worksheet.getColumn('F').width = 18; // Ancho de la columna F
    worksheet.getColumn('G').width = 20; // Ancho de la columna G
    worksheet.getColumn('H').width = 22; // Ancho de la columna H
    worksheet.getColumn('I').width = 25; // Ancho de la columna I
    worksheet.getColumn('J').width = 22; // Ancho de la columna J

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Reporte de Ventas del dia ' + this.fechaFormateadaver + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
