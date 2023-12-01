import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  pageSelection,
  Requerimientos,
} from 'src/app/shared/interfaces/almacen';
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
    public generarRequerimientoService: GenerarRequerimientoService,
    public generalService: GeneralService,
    private sucursalService: SucursalService,
    private datePipe: DatePipe
  ) {}

  fechaActual = new Date();
  fechaFormateada = this.datePipe.transform(
    this.fechaActual,
    'yyyy/MM/dd HH:mm'
  );

  ngOnInit(): void {
    this.sucursalAll();
    this.userAll();
  }

  datosSUC: any;
  sucursalAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
        //this.requerimientosAll();
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
        this.requerimientosAll();
      },
      error: () => {},
      complete: () => {},
    });
  }

  private requerimientosAll(): void {
    this.requerimientosList = [];
    this.serialNumberArray = [];
    this.generarRequerimientoService.getRequerimientosAll().subscribe({
      next: (datosREQUERIMIENTOS: any) => {
        this.datosREQUERIMIENTOS = datosREQUERIMIENTOS;
        this.totalData = this.datosREQUERIMIENTOS.length;

        if (datosREQUERIMIENTOS === 'no hay resultados') {
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

        datosREQUERIMIENTOS.map((res: Requerimientos, index: number) => {
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
    this.requerimientosAll();
    this.dataSource = new MatTableDataSource<Requerimientos>(
      this.requerimientosList
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
    this.requerimientosAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.requerimientosAll();
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

  /* 
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Estilo para los encabezados
    const headerStyle = {
      font: { bold: true, size: 12 },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Color de fondo amarillo (puedes cambiarlo según tus preferencias)
      } as ExcelJS.Fill,
    };

    // Agrega encabezados con estilo y asigna anchos
    const headers = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 25 },
      { header: 'Usuario', key: 'usuario', width: 30 },
      { header: 'Proceso', key: 'proceso', width: 15 },
      { header: 'Agencia', key: 'agencia', width: 40 },
    ];

    // Añade los encabezados en la siguiente fila
    const headerRow = worksheet.addRow(headers.map((header) => header.header));
    headerRow.height = 30; // Puedes ajustar la altura según tus preferencias
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;

      // Configura el ancho de la columna
      worksheet.getColumn(colNumber).width = headers[colNumber - 1].width;

      // Centra el texto en la celda
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Agrega datos
    this.requerimientosList.forEach((data) => {
      const row = [
        (this.currentPage - 1) * this.pageSize +
          this.requerimientosList.indexOf(data) +
          1,
        data.requerimiento_fecha,
        data.nombreUsuario,
        data.requerimiento_proceso,
        data.nombreSucursal,
      ];
      worksheet.addRow(row);
    });

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'table-export.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
 */

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Estilo para los encabezados
    const headerStyle = {
      font: { bold: true, size: 12 },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' }, // Color de fondo amarillo
      } as ExcelJS.Fill,
    };

    // Agrega encabezados con estilo y asigna anchos
    const headers = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 25 },
      { header: 'Usuario', key: 'usuario', width: 30 },
      { header: 'Proceso', key: 'proceso', width: 20 },
      { header: 'Agencia', key: 'agencia', width: 40 },
    ];

    // Ajusta la altura de la fila de encabezados
    const headerRow = worksheet.addRow(headers.map((header) => header.header));
    headerRow.height = 30; // Altura del header

    headerRow.eachCell((cell, colNumber) => {
      cell.fill = headerStyle.fill;
      cell.font = headerStyle.font;

      // Configura el ancho de la columna
      worksheet.getColumn(colNumber).width = headers[colNumber - 1].width;

      // Centra el texto en la celda
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Agrega datos
    this.requerimientosList.forEach((data) => {
      const row = [
        (this.currentPage - 1) * this.pageSize +
          this.requerimientosList.indexOf(data) +
          1,
        data.requerimiento_fecha,
        data.nombreUsuario,
        data.requerimiento_proceso,
        data.nombreSucursal,
      ];

      const excelRow = worksheet.addRow(row);
      excelRow.height = 20; // Altura del header

      // Centra las celdas específicas en la fila de datos
      excelRow.getCell(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // ID
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
      }; // FECHA
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
      }; // USUARIO
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // Proceso
      excelRow.getCell(5).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // AGENCIA
    });

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Lista de Requerimientos '+this.fechaFormateada+'.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
