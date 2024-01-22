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
import { VentasDetalleService } from 'src/app/shared/services/despacho/ventas/ventas-detalle.service';
import { VentasItemService } from 'src/app/shared/services/despacho/ventas/ventas-item.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ClientesService } from 'src/app/shared/services/despacho/clientes/clientes.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { OperacionService } from 'src/app/shared/services/despacho/caja/operacion.service';
import { forkJoin, of, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import * as ExcelJS from 'exceljs';

interface DatoVentasItem {
  cantidad_venta: string;
  cliente_id: string;
  codigoProducto?: string;
  descuento: string;
  det_id: string;
  nombreCliente?: string;
  nombreProducto?: string;
  nombreUsuarioVenta?: string;
  precio_venta: string;
  prod_id: string;
  sucursal_id: string;
  tipoPago?: string;
  usuario_id: string;
  venta_estado?: string;
  venta_fecha: string;
  venta_id: string;
  venta_proceso?: string;
}

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
    private operacionService: OperacionService,
    private ventasDetalleService: VentasDetalleService
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
    this.operacionesAll();
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
  datosOPERACION: any;
  operacionesAll() {
    this.operacionService.getOperacionAll().subscribe({
      next: (responseOperacion: any) => {
        this.datosOPERACION = responseOperacion;
      },
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

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosSUC.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Ventas>(
          this.sucursalVentasList
        );
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  form = this.fb.group({
    fechaventainicio: ['', Validators.required],
    fechaventafin: ['', Validators.required],
  });

  totalFilteredData: any;
  private paginateData(): void {
    this.datosSUC.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.sucursalVentasList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.sucursalVentasList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosSUC)
    const filteredData = this.datosSUC.filter((sucursalVenta: any) => {
      return (
        (sucursalVenta.suc_nombre &&
          sucursalVenta.suc_nombre
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (sucursalVenta.fechaBusquedaInicio &&
          sucursalVenta.fechaBusquedaInicio
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (sucursalVenta.fechaBusquedaFin &&
          sucursalVenta.fechaBusquedaFin
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (sucursalVenta.montotal &&
          sucursalVenta.montotal
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.sucursalVentasList
    this.sucursalVentasList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosSUC.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<any>(this.sucursalVentasList);
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
    this.totalPages = Math.ceil(totalData / pageSize);
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
    const titleRow = worksheet.addRow([
      'REPORTE DE VENTAS CONCRETADAS POR SUCURSAL',
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
        'Reporte de Ventas Concretadas x Sucursal del ' +
        this.fechaVisualInicio +
        ' al ' +
        this.fechaVisualFin +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  ventaItems: any[] = [];
  /* ventasExcelAll(
    suc_id: any,
    suc_nombre: any,
    fechaInicio: any,
    fechaFin: any
  ) {
    this.operacionesAll();
    this.ventasDetalleService
      .getVentaReporte('PAGADO', '1', suc_id, fechaInicio, fechaFin)
      .subscribe({
        next: (response) => {
          //console.log(response);
          this.ventaItems = response;

          this.ventaItems.forEach((responseVenta: any) => {
            //PARA ASGINAR EL NOMBRE DEL PRODUCTO
            this.productoService.getProducto(responseVenta.prod_id).subscribe({
              next: (response) => {
                //console.log(response);
                response.forEach((productoVenta: any) => {
                  responseVenta.codigoProducto = productoVenta.prod_codigo;
                  responseVenta.nombreProducto = productoVenta.prod_nombre;
                });
              },
              error: (errorData) => {
                console.log(errorData);
              },
              complete: () => {},
            });
            //PARA CLIENTE
            this.clientesService
              .getCliente(responseVenta.cliente_id)
              .subscribe({
                next: (response1: any) => {
                  //console.log(response1);
                  responseVenta.nombreCliente = response1[0].cli_nombre;
                },
                error: (errorData) => {},
                complete: () => {},
              });
            //PARA USUARIO
            this.generalService.getUsuario(responseVenta.usuario_id).subscribe({
              next: (response2: any) => {
                //console.log(response2);
                responseVenta.nombreUsuarioVenta = response2[0].user_nombre;
              },
              error: (errorData) => {},
              complete: () => {},
            });
            //PARA TIPO PAGO
            const operacion = this.datosOPERACION.find(
              (ope: any) =>
                ope.motivo_codigo === responseVenta.venta_id &&
                ope.fecha_pago === responseVenta.venta_fecha &&
                ope.motivo_pago === 'VENTA'
            );
            responseVenta.tipoPago = operacion.medio_pago;

            //console.log(operacion);
          });
        },
        error: (errorData) => {
          console.log(errorData);
        },
        complete: () => {
          this.exportProductosToExcel();
        },
      });
  } */
  ventasExcelAll(
    suc_id: any,
    suc_nombre: any,
    fechaInicio: any,
    fechaFin: any
  ) {
    this.operacionesAll();
    this.ventasDetalleService
      .getVentaReporte('PAGADO', '1', suc_id, fechaInicio, fechaFin)
      .subscribe({
        next: (response) => {
          this.ventaItems = response;

          // Obtener un array de observables para las llamadas asincrónicas
          const observables: Observable<any>[] = this.ventaItems.map(
            (responseVenta: any) => {
              return forkJoin([
                this.productoService.getProducto(responseVenta.prod_id),
                this.clientesService.getCliente(responseVenta.cliente_id),
                this.generalService.getUsuario(responseVenta.usuario_id),
              ]);
            }
          );

          // Utilizar forkJoin para esperar a que todas las llamadas asíncronas se completen
          forkJoin(observables).subscribe((results: any) => {
            // Iterar sobre los resultados y asignar valores a los elementos correspondientes de this.ventaItems
            results.forEach((result: any, index: number) => {
              const responseVenta = this.ventaItems[index];

              responseVenta.codigoProducto = result[0][0]?.prod_codigo;
              responseVenta.nombreProducto = result[0][0]?.prod_nombre;
              responseVenta.descripcionProducto =
                result[0][0]?.prod_descripcion;
              responseVenta.nombreCliente = result[1][0]?.cli_nombre;
              responseVenta.nombreUsuarioVenta = result[2][0]?.user_nombre;

              // Agregar la parte que falta
              //ope.fecha_pago === responseVenta.venta_fecha &&
              const operacion = this.datosOPERACION.find(
                (ope: any) =>
                  ope.motivo_codigo === responseVenta.venta_id &&
                  ope.motivo_pago === 'VENTA'
              );
              if (operacion) {
                responseVenta.tipoPago = operacion.medio_pago;
              }
              //console.log(responseVenta);
            });

            // Llamar a la función exportProductosToExcel después de que todas las operaciones estén completas
            this.exportProductosToExcel(
              suc_id,
              suc_nombre,
              fechaInicio,
              fechaFin
            );
          });
        },
        error: (errorData) => {
          console.log(errorData);
        },
        complete: () => {},
      });
  }

  exportProductosToExcel(
    suc_id: any,
    suc_nombre: any,
    fechaInicio: any,
    fechaFin: any
  ): void {
    //console.log(this.ventaItems);

    /* this.ventaItems.forEach((datoD: DatoVentasItem) => {
      console.log('Complete Object:', datoD);
      console.log('codigoProducto:', datoD?.codigoProducto);
      console.log('nombreProducto:', datoD.nombreProducto);
      console.log('venta_id:', datoD.venta_id);
      console.log('nombreCliente:', datoD.nombreCliente);
      console.log('venta_fecha:', datoD.venta_fecha);
      console.log('cantidad_venta:', datoD.cantidad_venta);
      console.log('precio_venta:', datoD.precio_venta);
      console.log('nombreUsuarioVenta:', datoD.nombreUsuarioVenta);
      console.log('tipoPago:', datoD.tipoPago);
      console.log('venta_proceso:', datoD.venta_proceso);
    }); */

    //EXCEL
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow([
      '',
      'REPORTE DE PRODUCTOS VENDIDOS POR SUCURSAL Y FECHAS',
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
      suc_nombre,
      'DEL',
      fechaInicio,
      'AL',
      fechaFin,
    ]);
    /* const datosRow = worksheet.addRow([
      '',
      'SUCURSAL',
      'suc_nombre',
      'DEL',
      'fechaBusquedaInicio',
      'AL',
      'fechaBusquedaFin',
    ]); */
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
      if (col == 2 || col == 4 || col == 6) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DCE6F1' }, // Color de fondo azul claro
        };
      }
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
      { header: 'CODIGO DE PRODUCTO', key: 'codigoProducto' },
      { header: 'PRODUCTO NOMBRE', key: 'nombreProducto' },
      { header: 'DESCRIPCION PRODUCTO', key: 'descripcionProducto' },
      { header: 'CODIGO DE VENTA', key: 'venta_id' },
      { header: 'CLIENTE NOMBRE', key: 'nombreCliente' },
      { header: 'FECHA DE VENTA', key: 'venta_fecha' },
      { header: 'CANTIDAD DE VENTA', key: 'cantidad_venta' },
      { header: 'PRECIO DE VENTA', key: 'precio_venta' },
      { header: 'USUARIO VENTA', key: 'nombreUsuarioVenta' },
      { header: 'TIPO DE PAGO', key: 'tipoPago' },
      { header: 'ESTADO DE VENTA', key: 'venta_proceso' },
    ];

    // Ajusta la altura de la fila de encabezados
    const headerRow = worksheet.addRow(headers.map((header) => header.header));
    headerRow.height = 35; // Altura del header

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
    this.ventaItems.forEach((data: any) => {
      // Redondea el valor de data.montotal a 2 decimales
      //const precio_venta = data.precio_venta.toFixed(2);

      const row = [
        data.codigoProducto,
        data.nombreProducto,
        data.descripcionProducto,
        parseInt(data.venta_id),
        data.nombreCliente,
        data.venta_fecha,
        parseInt(data.cantidad_venta),
        parseFloat(data.precio_venta),
        data.nombreUsuarioVenta,
        data.tipoPago,
        data.venta_proceso,
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
      }; // CODIGO DE PRODUCTO
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // PRODUCTO NOMBRE
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'justify',
      }; // DESCRIPCION DE PRPDUCTO
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // CODIGO DE VENTA
      excelRow.getCell(5).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // CLIENTE NOMBRE
      excelRow.getCell(6).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // FECHA DE VENTA
      excelRow.getCell(7).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // CANTIDAD DE VENTA
      excelRow.getCell(8).alignment = {
        vertical: 'middle',
        horizontal: 'right',
        wrapText: true, // Habilitar ajuste de texto
        indent: 1, // Ajusta el valor según sea necesario
      }; // PRECIO DE VENTA
      excelRow.getCell(9).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // USUARIO DE VENTA
      excelRow.getCell(10).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // TIPO DE PAGO
      excelRow.getCell(11).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // ESTADO DE VENTA
      // Configura el formato de la celda para la columna del monto
      const montoCell1 = excelRow.getCell(7);
      montoCell1.numFmt = '#,##0'; // Formato de número
      const montoCell2 = excelRow.getCell(8);
      montoCell2.numFmt = '#,##0.00'; // Formato de número con 2 decimales
    });

    // Ajustar el ancho de las columnas A, B y C
    worksheet.getColumn('A').width = 15; // Ancho de la columna A
    worksheet.getColumn('B').width = 40; // Ancho de la columna B
    worksheet.getColumn('C').width = 45; // Ancho de la columna C
    worksheet.getColumn('D').width = 20; // Ancho de la columna D
    worksheet.getColumn('E').width = 40; // Ancho de la columna E
    worksheet.getColumn('F').width = 20; // Ancho de la columna F
    worksheet.getColumn('G').width = 17; // Ancho de la columna G
    worksheet.getColumn('H').width = 15; // Ancho de la columna H
    worksheet.getColumn('I').width = 15; // Ancho de la columna I
    worksheet.getColumn('J').width = 25; // Ancho de la columna J
    worksheet.getColumn('K').width = 15; // Ancho de la columna K

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Reporte de Ventas Pagadas de la Sucursal ' +
        suc_nombre +
        ' del ' +
        fechaInicio +
        ' al ' +
        fechaFin +
        '.xlsx';
      //a.download = 'Reporte de Ventas Pagadas de la Sucursal.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
