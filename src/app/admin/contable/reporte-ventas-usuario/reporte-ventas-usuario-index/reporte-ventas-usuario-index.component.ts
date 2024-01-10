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
import { GeneralService } from 'src/app/shared/services/general.service';
import { forkJoin, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-reporte-ventas-usuario-index',
  templateUrl: './reporte-ventas-usuario-index.component.html',
  styleUrls: ['./reporte-ventas-usuario-index.component.scss'],
})
export class ReporteVentasUsuarioIndexComponent implements OnInit {
  public ruta = rutas;
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private ventasService: VentasService,
    private ventasItemService: VentasItemService,
    private sucursalService: SucursalService,
    private generalService: GeneralService
  ) {}

  public usuarioVentasList: Array<any> = [];
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
        console.log(this.datosVenta);
        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionada = this.form.value.fechaventa;
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a usuariosAll
        if (fechaSeleccionada !== null && fechaSeleccionada !== undefined) {
          this.usuariosAll(fechaSeleccionada);
        }
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datosUSUARIO: any[] = [];
  sumatotal = 0;

  usuariosAll(fecha: string) {
    this.usuarioVentasList = [];
    this.serialNumberArray = [];
    this.generalService.getUsuariosAll().subscribe({
      next: (response: any) => {
        this.datosUSUARIO = response;
        //console.log(response);
        console.log(this.datosUSUARIO);
        const observables = this.datosUSUARIO.map((usuario: any) => {
          const dataSucursal = this.datosVenta.filter(
            (vent: any) =>
              vent.venta_fecha === fecha && vent.usuario_id === usuario.user_id
          );
          console.log(dataSucursal);

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
                usuario.montotal = sumaCantidaPrecio;
                usuario.fechaBusqueda = fecha;
                return usuario;
              })
            );
          } else {
            usuario.fechaBusqueda = fecha;
            usuario.montotal = 0;
            return of(usuario);
          }
        });

        forkJoin(observables).subscribe({
          next: (sucursales: any) => {
            this.datosUSUARIO = sucursales;
            // Ahora puedes acceder a this.datosUSUARIO con los valores actualizados
            //console.log(this.datosUSUARIO);
          },
          error: (errorData) => {
            console.error(errorData);
          },
          complete: () => {
            // El código después de que todas las operaciones asíncronas se completen
          },
        });
        //console.log(this.datosUSUARIO);
        //AHORA SI PASAMOS DATOS A LA TABLA
        this.totalData = this.datosUSUARIO.length;

        this.datosUSUARIO.map((res: any, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.usuarioVentasList.push(res);
            console.log(this.usuarioVentasList);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Ventas>(
          this.usuarioVentasList
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
    this.usuarioVentasList = this.dataSource.filteredData;
  }
  public sortData(sort: Sort) {
    const data = this.usuarioVentasList.slice();

    if (!sort.active || sort.direction === '') {
      this.usuarioVentasList = data;
    } else {
      this.usuarioVentasList = data.sort((a, b) => {
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
    //this.usuariosAll();
    const fechaSeleccionada = this.form.value.fechaventa;
    if (fechaSeleccionada !== null && fechaSeleccionada !== undefined) {
      this.usuariosAll(fechaSeleccionada);
    }
    this.dataSource = new MatTableDataSource<any>(this.usuarioVentasList); // Agregar esta línea
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
    //this.usuariosAll();
    const fechaSeleccionada = this.form.value.fechaventa;
    if (fechaSeleccionada !== null && fechaSeleccionada !== undefined) {
      this.usuariosAll(fechaSeleccionada);
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
      this.usuariosAll(fechaSeleccionada);
    }
    //this.usuariosAll();
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
      this.usuariosAll(fechaBuscada);
    }
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow(['REPORTE DE VENTAS POR USUARIO']);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:D${titleRow.number}`);

    // Configura bordes para la fila del título
    /* titleRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }); */

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
      { header: '#', key: '#', width: 10 },
      { header: 'USUARIO', key: 'usuario', width: 35 },
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
    this.usuarioVentasList.forEach((data) => {
      // Redondea el valor de data.montotal a 2 decimales
      //const montoFormateado = data.montotal.toFixed(2);
      const row = [
        (this.currentPage - 1) * this.pageSize +
          this.usuarioVentasList.indexOf(data) +
          1,
        data.user_nombre,
        data.fechaBusqueda,
        data.montotal,
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
      }; // #
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
      }; // USUARIO
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
      a.download = 'Reporte de Ventas x Usuario' + this.fechaVisual + '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
