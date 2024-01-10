import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';

import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { pageSelection, Ventas } from 'src/app/shared/interfaces/despacho';
import { VentasService } from 'src/app/shared/services/despacho/ventas/ventas.service';
import { VentasItemService } from 'src/app/shared/services/despacho/ventas/ventas-item.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { forkJoin, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { catchError, map } from 'rxjs/operators';

import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-reporte-ventas-index',
  templateUrl: './reporte-ventas-index.component.html',
  styleUrls: ['./reporte-ventas-index.component.scss'],
})
export class ReporteVentasIndexComponent implements OnInit {
  public ruta = rutas;
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private ventasService: VentasService,
    private ventasItemService: VentasItemService,
    private sucursalService: SucursalService
  ) {}

  public sucursalVentasList: Array<any> = [];
  dataSource!: MatTableDataSource<Ventas>;

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

  //fechaFormateada = this.datePipe.transform(this.fechaActual, 'yyyy-MM-dd');
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'MM/dd/yyyy');
  ngOnInit(): void {
    this.form.patchValue({ fechaventa: this.fechaFormateada });
    this.fechaVisual = this.fechaFormateada;
    this.ventasAll();
  }
  fechaVisual: any;
  datosVenta: Ventas[] = [];
  ventasAll() {
    this.ventasService.getVentasAll().subscribe({
      next: (response0: any) => {
        this.datosVenta = response0;
        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionada = this.form.value.fechaventa;
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a sucursalesAll
        if (fechaSeleccionada !== null && fechaSeleccionada !== undefined) {
          this.sucursalesAll(fechaSeleccionada);
        }
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datosSUC: any[] = [];
  sumatotal = 0;

  sucursalesAll(fecha: string) {
    this.sucursalVentasList = [];
    this.serialNumberArray = [];
    this.sucursalService.getSucursalAll().subscribe({
      next: (response: any) => {
        this.datosSUC = response;
        //console.log(response);

        const observables = this.datosSUC.map((sucursal: any) => {
          const dataSucursal = this.datosVenta.filter(
            (vent: any) =>
              vent.venta_fecha === fecha && vent.sucursal_id === sucursal.suc_id
          );

          let sumaPrecioVenta = 0;
          let sumaCantidaPrecio: number = 0; // Inicializa con 0 o el valor inicial que desees
          if (dataSucursal.length > 0) {
            const observablesVentaItem = dataSucursal.map((datoVenta: any) => {
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
                    //sumaPrecioVenta += sumaCantidaPrecio;
                  });
                });
                sucursal.montotal = sumaCantidaPrecio;
                sucursal.fechaBusqueda = fecha;
                return sucursal;
              })
            );
          } else {
            sucursal.fechaBusqueda = fecha;
            sucursal.montotal = 0;
            return of(sucursal);
          }
        });

        forkJoin(observables).subscribe({
          next: (sucursales: any) => {
            this.datosSUC = sucursales;
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
        //console.log(this.datosSUC);
        //AHORA SI PASAMOS DATOS A LA TABLA
        this.totalData = this.datosSUC.length;

        this.datosSUC.map((res: any, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.sucursalVentasList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Ventas>(
          this.sucursalVentasList
        );
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  form = this.fb.group({
    fechaventa: ['', Validators.required],
  });

  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.sucursalVentasList = this.dataSource.filteredData;
  }
  public sortData(sort: Sort) {
    const data = this.sucursalVentasList.slice();

    if (!sort.active || sort.direction === '') {
      this.sucursalVentasList = data;
    } else {
      this.sucursalVentasList = data.sort((a, b) => {
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
    //this.sucursalesAll();
    const fechaSeleccionada = this.form.value.fechaventa;
    if (fechaSeleccionada !== null && fechaSeleccionada !== undefined) {
      this.sucursalesAll(fechaSeleccionada);
    }
    this.dataSource = new MatTableDataSource<any>(this.sucursalVentasList); // Agregar esta línea
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
    //this.sucursalesAll();
    const fechaSeleccionada = this.form.value.fechaventa;
    if (fechaSeleccionada !== null && fechaSeleccionada !== undefined) {
      this.sucursalesAll(fechaSeleccionada);
    }
  }
  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    //
    const fechaSeleccionada = this.form.value.fechaventa;
    if (fechaSeleccionada !== null && fechaSeleccionada !== undefined) {
      this.sucursalesAll(fechaSeleccionada);
    }
    //this.sucursalesAll();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    //eslint no-var: off
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  verFecha() {
    console.log(this.form.value.fechaventa);
    const fechaBuscada = this.datePipe.transform(
      this.form.value.fechaventa,
      'yyyy-MM-dd'
    );

    if (fechaBuscada !== null && fechaBuscada !== undefined) {
      this.fechaVisual = fechaBuscada;
      // Filtrar los datos según la fecha seleccionada
      this.sucursalesAll(fechaBuscada);
    }
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow(['REPORTE DE VENTAS POR SUCURSAL']);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:D${titleRow.number}`);

    // Espaciador entre el título y los encabezados
    worksheet.addRow([]); // Esto agrega una fila vacía

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
      { header: '#', key: '#', width: 10 },
      { header: 'SUCURSAL', key: 'sucursal', width: 35 },
      { header: 'FECHA', key: 'fecha', width: 20 },
      { header: 'MONTO', key: 'monto', width: 20 },
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
    this.sucursalVentasList.forEach((data) => {
      // Redondea el valor de data.montotal a 2 decimales
      //const montoFormateado = data.montotal.toFixed(2);
      const row = [
        (this.currentPage - 1) * this.pageSize +
          this.sucursalVentasList.indexOf(data) +
          1,
        data.suc_nombre,
        data.fechaBusqueda,
        data.montotal,
      ];

      const excelRow = worksheet.addRow(row);
      excelRow.height = 20; // Altura del header

      // Centra las celdas específicas en la fila de datos
      excelRow.getCell(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // #
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
      }; // SUCURSAL
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // FECHA
      // Configura el formato de la celda para la columna del monto
      const montoCell = excelRow.getCell(4);
      montoCell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // MONTO
      montoCell.numFmt = '#,##0.00'; // Formato de número con 2 decimales
    });

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Reporte de Ventas ' + this.fechaVisual + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
