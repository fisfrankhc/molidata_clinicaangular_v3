import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  pageSelection,
  Requerimientos,
} from 'src/app/shared/interfaces/almacen';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { GenerarRequerimientoService } from 'src/app/shared/services/almacen/generar-requerimiento/generar-requerimiento.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { GeneralService } from 'src/app/shared/services/general.service';

import * as ExcelJS from 'exceljs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-requerimientos-index',
  templateUrl: './requerimientos-index.component.html',
  styleUrls: ['./requerimientos-index.component.scss'],
})
export class RequerimientosIndexComponent {
  public ruta = rutas;
  datosREQUERIMIENTOS: Requerimientos[] = [];

  public requerimientosList: Array<Requerimientos> = [];
  dataSource!: MatTableDataSource<Requerimientos>;

  public showFilter = false;
  public searchDataValue: string = '';
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

  constructor(
    private fb: FormBuilder,
    public generarRequerimientoService: GenerarRequerimientoService,
    public generalService: GeneralService,
    private sucursalService: SucursalService,
    private datePipe: DatePipe
  ) {}

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'dd/MM/yyyy HH:mm'
  );

  ngOnInit(): void {
    this.fechaVisual = this.fechaFormateada;
    this.sucursalAll();
    this.userAll();
  }

  datosSUC: any;
  sucursalAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosUSUARIOS: any;
  userAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSUARIOS: any) => {
        this.datosUSUARIOS = datosUSUARIOS;

        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
        const fechaSeleccionadaFin = this.form.value.fechaventafin;
        console.log(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a sucursalesAll
        if (
          fechaSeleccionadaInicio !== null &&
          fechaSeleccionadaInicio !== undefined &&
          fechaSeleccionadaFin !== null &&
          fechaSeleccionadaFin !== undefined
        ) {
          console.log(fechaSeleccionadaInicio, fechaSeleccionadaFin);
          this.requerimientosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  form = this.fb.group({
    fechaventainicio: ['', Validators.required],
    fechaventafin: ['', Validators.required],
  });

  fechaVisual: any;
  fechaVisualInicio: any;
  fechaVisualFin: any;
  fechaI: any;
  fechaF: any;
  resultadoMostrar: any;
  private requerimientosAll(fechaInicio: string, fechaFin: string): void {
    this.requerimientosList = [];
    this.serialNumberArray = [];

    this.fechaVisualInicio = this.datePipe.transform(fechaInicio, 'dd/MM/yyyy');
    this.fechaVisualFin = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
    this.fechaI =
      this.datePipe.transform(fechaInicio, 'yyyy-MM-dd') + ' 00:00:00';
    this.fechaF = this.datePipe.transform(fechaFin, 'yyyy-MM-dd') + ' 23:59.59';
    console.log(this.fechaI, this.fechaF);
    this.generarRequerimientoService.getRequerimientosAll().subscribe({
      next: (datosREQUERIMIENTOS: any) => {
        this.datosREQUERIMIENTOS = datosREQUERIMIENTOS;

        /* if (datosREQUERIMIENTOS === 'no hay resultados') {
          this.totalData = 0;
        } */
        if (fechaInicio && fechaFin) {
          this.resultadoMostrar = true;
          console.log(this.resultadoMostrar);
        }
        const dataRequeFinal = this.datosREQUERIMIENTOS.filter(
          (req: any) =>
            req.requerimiento_fecha >= this.fechaI &&
            req.requerimiento_fecha <= this.fechaF
        );
        if (dataRequeFinal) {
          this.datosREQUERIMIENTOS = dataRequeFinal;
          this.totalData = this.datosREQUERIMIENTOS.length;
        }
        if (dataRequeFinal.length === 0) {
          this.totalData = 0;
        }
        // Mapea los nombres de datos de ventas
        this.datosREQUERIMIENTOS = this.datosREQUERIMIENTOS.map(
          (requerimiento: Requerimientos) => {
            //PARA USUARIO
            const usuario = this.datosUSUARIOS.find(
              (user: any) => user.user_id === requerimiento.usuario_id
            );
            requerimiento;
            if (usuario) {
              requerimiento.nombreUsuario = usuario.user_name;
            }

            //PARA SUCURSAL
            const sucursal = this.datosSUC.find(
              (suc: any) => suc.suc_id === requerimiento.sucursal_id
            );
            if (sucursal) {
              requerimiento.nombreSucursal = sucursal.suc_nombre;
            }
            return requerimiento;
          }
        );
        console.log(this.datosREQUERIMIENTOS);
        console.log(this.totalData);
        this.datosREQUERIMIENTOS.map((res: Requerimientos, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.requerimientosList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Requerimientos>(
          this.requerimientosList
        );
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.requerimientosList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.requerimientosList.slice();

    if (!sort.active || sort.direction === '') {
      this.requerimientosList = data;
    } else {
      this.requerimientosList = data.sort((a, b) => {
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
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.requerimientosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
    this.dataSource = new MatTableDataSource<Requerimientos>(
      this.requerimientosList
    );
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
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.requerimientosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    //
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.requerimientosAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
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
      this.form.value.fechaventainicio,
      'yyyy-MM-dd'
    );
    const fechaFin = this.datePipe.transform(
      this.form.value.fechaventafin,
      'yyyy-MM-dd'
    );

    if (
      fechaInicio !== null &&
      fechaInicio !== undefined &&
      fechaFin !== null &&
      fechaFin !== undefined
    ) {
      // Realizar la lógica de filtrado según el rango de fechas (fechaInicio y fechaFin)
      this.requerimientosAll(fechaInicio, fechaFin);
    }
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow([
      'LISTA DE REQUERIMIENTOS DEL ' +
        this.fechaVisualInicio +
        ' AL ' +
        this.fechaVisualFin,
    ]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:E${titleRow.number}`);
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
      { header: 'ID', key: 'id' },
      { header: 'Fecha', key: 'fecha' },
      { header: 'Usuario', key: 'usuario' },
      { header: 'Proceso', key: 'proceso' },
      { header: 'Agencia', key: 'agencia' },
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
    //(this.currentPage - 1) * this.pageSize + this.requerimientosList.indexOf(data) + 1;
    this.requerimientosList.forEach((data) => {
      const row = [
        +data.requerimiento_id,
        data.requerimiento_fecha,
        data.nombreUsuario,
        data.requerimiento_proceso,
        data.nombreSucursal,
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
        horizontal: 'center',
      }; // FECHA
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // USUARIO
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // Proceso
      excelRow.getCell(5).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // AGENCIA
      const montoCell1 = excelRow.getCell(1);
      montoCell1.numFmt = '#,##0'; // Formato de número
    });

    // Ajustar el ancho de las columnas
    worksheet.getColumn('A').width = 8; // Ancho de la columna A
    worksheet.getColumn('B').width = 25; // Ancho de la columna B
    worksheet.getColumn('C').width = 35; // Ancho de la columna C
    worksheet.getColumn('D').width = 20; // Ancho de la columna D
    worksheet.getColumn('E').width = 30; // Ancho de la columna E

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Lista de Requerimientos del ' +
        this.fechaVisualInicio +
        ' al ' +
        this.fechaVisualFin +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
