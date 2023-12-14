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
import { pageSelection, Ventas } from 'src/app/shared/interfaces/farmacia';
import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { VentasItemService } from 'src/app/shared/services/farmacia/ventas/ventas-item.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { OperacionService } from 'src/app/shared/services/farmacia/caja/operacion.service';
import { forkJoin, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-r-v-s-p-index',
  templateUrl: './r-v-s-p-index.component.html',
  styleUrls: ['./r-v-s-p-index.component.scss'],
})
export class RVSPIndexComponent implements OnInit {
  public ruta = rutas;
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private ventasService: VentasService,
    private ventasItemService: VentasItemService,
    private sucursalService: SucursalService,
    private clientesService: ClientesService,
    private generalService: GeneralService,
    private productoService: ProductoService,
    private operacionService: OperacionService
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
    //this.form.patchValue({ fechaventa: this.fechaFormateada });
    this.fechaVisual = this.fechaFormateada;
    this.ventasAll();
    this.clientesAll();
  }
  fechaVisual: any;
  fechaVisualInicio: any;
  fechaVisualFin: any;
  datosVenta: Ventas[] = [];
  ventasAll() {
    this.ventasService.getVentasAll().subscribe({
      next: (response0: any) => {
        this.datosVenta = response0;
        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
        const fechaSeleccionadaFin = this.form.value.fechaventafin;
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a sucursalesAll
        if (
          fechaSeleccionadaInicio !== null &&
          fechaSeleccionadaInicio !== undefined &&
          fechaSeleccionadaFin !== null &&
          fechaSeleccionadaFin !== undefined
        ) {
          this.sucursalesAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        }
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  clientesAll(): void {
    this.clientesService.getClientesAll().subscribe({
      next: (response0: any) => {},
      error: (errorData) => {},
      complete: () => {},
    });
  }

  datosSUC: any[] = [];
  sumatotal = 0;
  resultadoMostrar: any;
  sucursalesAll(fechaInicio: string, fechaFin: string) {
    this.sucursalVentasList = [];
    this.serialNumberArray = [];
    this.fechaVisualInicio = this.datePipe.transform(fechaInicio, 'dd/MM/yyyy');
    this.fechaVisualFin = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
    this.sucursalService.getSucursalAll().subscribe({
      next: (response: any) => {
        this.datosSUC = response;
        //console.log(response);
        if (fechaInicio && fechaFin) {
          this.resultadoMostrar = true;
          //console.log(this.resultadoMostrar);
        }
        const observables = this.datosSUC.map((sucursal: any) => {
          const dataSucursal = this.datosVenta.filter(
            (vent: any) =>
              vent.venta_fecha >= fechaInicio &&
              vent.venta_fecha <= fechaFin &&
              vent.venta_proceso == 'PAGADO' &&
              vent.sucursal_id === sucursal.suc_id
          );
          //console.log(dataSucursal);
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
                sucursal.fechaBusquedaInicio = fechaInicio;
                sucursal.fechaBusquedaFin = fechaFin;
                return sucursal;
              })
            );
          } else {
            sucursal.fechaBusquedaInicio = fechaInicio;
            sucursal.fechaBusquedaFin = fechaFin;
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
    fechaventainicio: ['', Validators.required],
    fechaventafin: ['', Validators.required],
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
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.sucursalesAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
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
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.sucursalesAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
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
      this.sucursalesAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
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
      this.sucursalesAll(fechaInicio, fechaFin);
    }
  }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow(['REPORTE DE VENTAS POR SUCURSAL']);
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

    // Aplica estilo al fondo del título solo a las celdas combinadas
    titleRange.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
    };

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
      { header: 'SUCURSAL', key: 'sucursal', width: 35 },
      { header: 'FECHA INICIO', key: 'fecha', width: 20 },
      { header: 'FECHA FIN', key: 'fecha', width: 20 },
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
    this.sucursalVentasList.forEach((data) => {
      // Redondea el valor de data.montotal a 2 decimales
      //const montoFormateado = data.montotal.toFixed(2);
      const row = [
        (this.currentPage - 1) * this.pageSize +
          this.sucursalVentasList.indexOf(data) +
          1,
        data.suc_nombre,
        data.fechaBusquedaInicio,
        data.fechaBusquedaFin,
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
      }; // SUCURSAL
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // FECHA INICIO
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // FECHA FIN
      // Configura el formato de la celda para la columna del monto
      const montoCell = excelRow.getCell(5);
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
      a.download =
        'Reporte de Ventas x Sucursal del ' +
        this.fechaVisualInicio +
        ' al ' +
        this.fechaVisualFin +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  ventaItems: any;
  /*   ventasExcelAll(suc_id: any, fechaInicio: any, fechaFin: any): void {
    const dataSucursal = this.datosVenta.filter(
      (vent: any) =>
        vent.venta_fecha >= fechaInicio &&
        vent.venta_fecha <= fechaFin &&
        vent.venta_proceso == 'PAGADO' &&
        vent.sucursal_id === suc_id
    );
    console.log(dataSucursal);
    if (dataSucursal.length > 0) {
      dataSucursal.forEach((responseVenta: any) => {
        this.ventasItemService.getVentaItem(responseVenta.venta_id).subscribe({
          next: (response) => {
            console.log(response);
            this.ventaItems = response;
          },
          error: (errorData) => {console.log(errorData);},
          complete: () => {},
        });
      });
    }
  } */
  /*  ventasExcelAll(suc_id: any, fechaInicio: any, fechaFin: any): void {
    const dataSucursal = this.datosVenta.filter(
      (vent: any) =>
        vent.venta_fecha >= fechaInicio &&
        vent.venta_fecha <= fechaFin &&
        vent.venta_proceso == 'PAGADO' &&
        vent.sucursal_id === suc_id
    );
    console.log(dataSucursal);

    if (dataSucursal.length > 0) {
      //Se crea un array de observables (observables) utilizando el método map. Cada observable corresponde a la llamada a this.ventasItemService.getVentaItem(responseVenta.venta_id)
      const observables = dataSucursal.map((responseVenta: any) =>
        this.ventasItemService.getVentaItem(responseVenta.venta_id)
      );

      //Promise.all para esperar a que todas las observaciones se completen.
      //lastValueFrom se utiliza para convertir cada observable en una promesa y obtener su último valor emitido
      //bloque then, donde se mapea la información para asignar los productos correspondientes a cada venta en this.ventaItems
      Promise.all(observables.map((observable) => lastValueFrom(observable)))
        .then((responses) => {
          // Mapear la información
          this.ventaItems = dataSucursal.map((venta, index) => {
            return {
              ...venta,
              productos: responses[index],
            };
          });

          console.log(this.ventaItems);
        })
        .catch((errorData) => {
          console.log(errorData);
        });
    }
  } */

  ventasExcelAll(suc_id: any, fechaInicio: any, fechaFin: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dataSucursal = this.datosVenta.filter(
        (vent: any) =>
          vent.venta_fecha >= fechaInicio &&
          vent.venta_fecha <= fechaFin &&
          vent.venta_proceso == 'PAGADO' &&
          vent.sucursal_id === suc_id
      );
      //console.log(dataSucursal);

      if (dataSucursal.length > 0) {
        const observables = dataSucursal.map((responseVenta: any) =>
          this.ventasItemService.getVentaItem(responseVenta.venta_id)
        );

        Promise.all(observables.map((observable) => lastValueFrom(observable)))
          .then((responses) => {
            this.ventaItems = dataSucursal.map((venta, index) => {
              const ventaConProductos = {
                ...venta,
                productos: responses[index].map((producto: any) => {
                  const productoConNombre = {
                    ...producto,
                    nombreProducto: '', // inicializar el nombre del producto
                  };

                  // Obtener el nombre del producto
                  this.productoService.getProducto(producto.prod_id).subscribe({
                    next: (response: any) => {
                      productoConNombre.nombreProducto =
                        response[0]?.prod_nombre;
                    },
                    error: (errorData) => {},
                    complete: () => {},
                  });

                  return productoConNombre;
                }),
              };

              console.log(index);
              console.log(responses[0]);

              /*
this.productoService.getProducto(productoId).susbcribe({
  next: (response: any) => {
                  responses.nombreProducto = response[0]?.prod_nombre;
                },
                error: (errorData) => {},
                complete: () => {},
})
              */

              // Agregar propiedades a cada venta en this.ventaItems
              this.clientesService.getCliente(venta.cliente_id).subscribe({
                next: (response: any) => {
                  ventaConProductos.nombreCliente = response[0]?.cli_nombre;
                },
                error: (errorData) => {},
                complete: () => {},
              });
              this.generalService.getUsuario(venta.usuario_id).subscribe({
                next: (response: any) => {
                  ventaConProductos.nombreUsuarioVenta =
                    response[0]?.user_nombre;
                },
                error: (errorData) => {},
                complete: () => {},
              });

              return ventaConProductos;
            });

            console.log(this.ventaItems);
            resolve(); // Resuelve la promesa cuando todo está completo
          })
          .catch((errorData) => {
            console.log(errorData);
            reject(errorData); // Rechaza la promesa si hay un error
          });
      } else {
        resolve(); // Si no hay datos, resuelve la promesa inmediatamente
      }
    });
  }
}

