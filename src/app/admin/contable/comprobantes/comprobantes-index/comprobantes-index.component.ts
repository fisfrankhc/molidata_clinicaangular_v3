import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  pageSelection,
  Comprobantes,
} from 'src/app/shared/interfaces/contable';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ComprobantesService } from 'src/app/shared/services/contable/comprobantes/comprobantes.service';
import { ComprobanteTipoService } from 'src/app/shared/services/contable/asignacion-serie/comprobante-tipo.service';
import { DatePipe } from '@angular/common';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-comprobantes-index',
  templateUrl: './comprobantes-index.component.html',
  styleUrls: ['./comprobantes-index.component.scss'],
})
export class ComprobantesIndexComponent implements OnInit {
  public ruta = rutas;
  datosCOMPROBANTES: Comprobantes[] = [];

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public comprobantesService: ComprobantesService,
    private comprobanteTipoService: ComprobanteTipoService
  ) {}

  public comprobantesList: Array<Comprobantes> = [];
  dataSource!: MatTableDataSource<Comprobantes>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'MM/dd/yyyy');

  form = this.fb.group({
    fechaemisioninicio: ['', Validators.required],
    fechaemisionfin: ['', Validators.required],
  });

  ngOnInit(): void {
    this.fechaVisual = this.fechaFormateada;
    this.comprobantesTiposAll();
  }

  datosCOMPTIPOS: any;
  comprobantesTiposAll(): void {
    this.comprobanteTipoService.getComprobanteTiposAll().subscribe({
      next: (responseTipo: any) => {
        this.datosCOMPTIPOS = responseTipo;

        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionadaInicio = this.form.value.fechaemisioninicio;
        const fechaSeleccionadaFin = this.form.value.fechaemisionfin;
        console.log(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a sucursalesAll
        if (
          fechaSeleccionadaInicio !== null &&
          fechaSeleccionadaInicio !== undefined &&
          fechaSeleccionadaFin !== null &&
          fechaSeleccionadaFin !== undefined
        ) {
          console.log(fechaSeleccionadaInicio, fechaSeleccionadaFin);
          this.comprobantesAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  fechaVisual: any;
  fechaVisualInicio: any;
  fechaVisualFin: any;
  fechaI: any;
  fechaF: any;
  resultadoMostrar: any;
  comprobantesAll(fechaInicio: string, fechaFin: string): void {
    this.comprobantesList = [];
    this.serialNumberArray = [];

    this.fechaVisualInicio = this.datePipe.transform(fechaInicio, 'dd/MM/yyyy');
    this.fechaVisualFin = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
    this.fechaI = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd');
    this.fechaF = this.datePipe.transform(fechaFin, 'yyyy-MM-dd');
    console.log(this.fechaI, this.fechaF);

    this.comprobantesService.getComprobantesAll().subscribe({
      next: (responseCOMP: any) => {
        this.datosCOMPROBANTES = responseCOMP;

        if (fechaInicio && fechaFin) {
          this.resultadoMostrar = true;
          console.log(this.resultadoMostrar);
        }
        const dataComprobanteFinal = this.datosCOMPROBANTES.filter(
          (compr: any) =>
            compr.fecha_emision >= this.fechaI &&
            compr.fecha_emision <= this.fechaF
        );
        if (dataComprobanteFinal) {
          this.datosCOMPROBANTES = dataComprobanteFinal;
          this.totalData = this.datosCOMPROBANTES.length;
        }

        // Mapea los nombres de los clientes a los datos de ventas
        this.datosCOMPROBANTES = this.datosCOMPROBANTES.map(
          (dataComprobante: Comprobantes) => {
            //PARA TIPO DE COMPROBANTE
            const dataCOMTIP = this.datosCOMPTIPOS.find(
              (dataCOMTIP: any) =>
                dataCOMTIP.tipo_id === dataComprobante.comprobante_tipo
            );
            if (dataCOMTIP) {
              dataComprobante.nombreCOMPROBTIPO = dataCOMTIP.tipo_nombre;
            }

            return dataComprobante;
          }
        );

        this.datosCOMPROBANTES.map((res: Comprobantes, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.comprobantesList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Comprobantes>(
          this.comprobantesList
        );
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.comprobantesList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.comprobantesList.slice();

    if (!sort.active || sort.direction === '') {
      this.comprobantesList = data;
    } else {
      this.comprobantesList = data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
    }
    //this.comprobantesAll();
    const fechaSeleccionadaInicio = this.form.value.fechaemisioninicio;
    const fechaSeleccionadaFin = this.form.value.fechaemisionfin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprobantesAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
    this.dataSource = new MatTableDataSource<Comprobantes>(
      this.comprobantesList
    ); // Agregar esta línea
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    //this.comprobantesAll();
    const fechaSeleccionadaInicio = this.form.value.fechaemisioninicio;
    const fechaSeleccionadaFin = this.form.value.fechaemisionfin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprobantesAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    //
    const fechaSeleccionadaInicio = this.form.value.fechaemisioninicio;
    const fechaSeleccionadaFin = this.form.value.fechaemisionfin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprobantesAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  verFecha() {
    const fechaInicio = this.datePipe.transform(
      this.form.value.fechaemisioninicio,
      'yyyy-MM-dd'
    );
    const fechaFin = this.datePipe.transform(
      this.form.value.fechaemisionfin,
      'yyyy-MM-dd'
    );

    if (
      fechaInicio !== null &&
      fechaInicio !== undefined &&
      fechaFin !== null &&
      fechaFin !== undefined
    ) {
      // Realizar la lógica de filtrado según el rango de fechas (fechaInicio y fechaFin)
      this.comprobantesAll(fechaInicio, fechaFin);
    }
  }

  //////////////////////////////////////
  estadoExcel: any;
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow([
      'REPORTE DE COMPROBANTES DEL ' +
        this.fechaVisualInicio +
        ' AL ' +
        this.fechaVisualFin,
    ]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:I${titleRow.number}`);
    // Aplica estilo al fondo del título solo a las celdas combinadas
    const titleRange = worksheet.getCell(`A${titleRow.number}`);
    titleRange.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    titleRow.height = 40;
    // Aplica estilo al fondo del título solo a las celdas combinadas
    titleRange.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
    };

    // Espaciador entre el título y los encabezados
    //worksheet.addRow([]); // Esto agrega una fila vacía

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
      { header: 'ID', key: 'comprobante_id' },
      { header: 'TIPO DE COMPROBANTE', key: 'TIPO_COMPROBANTE' },
      { header: 'DETALLE DE COMPROBANTE', key: 'DETALLE_COMPROBANTE' },
      { header: 'FECHA DE EMISION', key: 'FECHA_EMISION' },
      { header: 'TIPO DE DOCUMENTO', key: 'TIPO_DOCUMENTO' },
      { header: '# DOCUMENTO', key: 'N_DOCUMENTO' },
      { header: 'CLIENTE', key: 'CLIENTE' },
      { header: 'ID VENTA', key: 'ID_VENTA' },
      { header: 'ESTADO SUNAT', key: 'ESTADO_SUNAT' },
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

    // Configura el formato de la fila de encabezado
    headerRow.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true, // Ajustar Texto
    };

    // Agrega datos
    this.comprobantesList.forEach((data) => {
      const comprobanteyserie =
        data.comprobante_serie + ' - ' + data.comprobante_numero;
      // Asegúrate de que el número de documento del cliente sea una cadena (string)
      const documentoCliente = String(data.cliente_documento_numero);

      const row = [
        +data.comprobante_id,
        data.nombreCOMPROBTIPO,
        comprobanteyserie,
        data.fecha_emision,
        data.cliente_documento_tipo,
        documentoCliente,
        data.cliente_razon_social,
        +data.venta_id,
        data.envio_sunat,
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
      }; // ID
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
        horizontal: 'justify',
      }; // TIPO_COMPROBANTE
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // DETALLE_COMPROBANTE
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // FECHA_EMISION
      excelRow.getCell(5).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // TIPO_DOCUMENTO
      excelRow.getCell(6).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // N_DOCUMENTO
      excelRow.getCell(7).alignment = {
        vertical: 'middle',
        horizontal: 'justify',
      }; // CLIENTE
      excelRow.getCell(8).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // ID_VENTA
      excelRow.getCell(9).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // ESTADO_SUNAT
      const montoCell1 = excelRow.getCell(1);
      montoCell1.numFmt = '#,##0'; // Formato de número
      const documentoClienteCell = excelRow.getCell(6);
      documentoClienteCell.numFmt = '@'; // Formato de texto
      const montoCell8 = excelRow.getCell(8);
      montoCell8.numFmt = '#,##0'; // Formato de número
    });

    // Ajustar el ancho de las columnas A, B y C
    worksheet.getColumn('A').width = 10; // Ancho de la columna A
    worksheet.getColumn('B').width = 35; // Ancho de la columna B
    worksheet.getColumn('C').width = 20; // Ancho de la columna C
    worksheet.getColumn('D').width = 20; // Ancho de la columna D
    worksheet.getColumn('E').width = 20; // Ancho de la columna E
    worksheet.getColumn('F').width = 20; // Ancho de la columna F
    worksheet.getColumn('G').width = 40; // Ancho de la columna G
    worksheet.getColumn('H').width = 12; // Ancho de la columna G
    worksheet.getColumn('I').width = 20; // Ancho de la columna G

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Reporte de Comprobantes del ' +
        this.fechaVisualInicio +
        ' al ' +
        this.fechaVisualFin +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
