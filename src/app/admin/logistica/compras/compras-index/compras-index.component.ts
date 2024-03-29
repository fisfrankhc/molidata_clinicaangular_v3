import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ComprasService } from 'src/app/shared/services/logistica/compra/compras.service';
import { ComprasDetalleService } from 'src/app/shared/services/logistica/compra/compras-detalle.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Compra } from 'src/app/shared/interfaces/logistica';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';

import * as ExcelJS from 'exceljs';
import * as Notiflix from 'notiflix';
import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-compras-index',
  templateUrl: './compras-index.component.html',
  styleUrls: ['./compras-index.component.scss'],
})
export class ComprasIndexComponent implements OnInit {
  public ruta = rutas;

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public comprasService: ComprasService,
    public proveedoresService: ProveedoresService,
    private sucursalService: SucursalService,
    private comprasDetalleService: ComprasDetalleService
  ) {}

  public comprasList: Array<Compra> = [];
  dataSource!: MatTableDataSource<Compra>;

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

  ngOnInit(): void {
    this.fechaVisual = this.fechaFormateada;
    this.proveedoresAll();
    this.sucursalesAll();
  }

  datosPROVEEDOR: any;
  proveedoresAll(): void {
    this.proveedoresService.getProveedoresAll().subscribe({
      next: (datosPROVEEDOR: any) => {
        this.datosPROVEEDOR = datosPROVEEDOR;

        // Obtener la fecha seleccionada del formulario
        const fechaSeleccionadaInicio = this.form.value.fechacomprainicio;
        const fechaSeleccionadaFin = this.form.value.fechacomprafin;
        console.log(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        // Asegurarse de que fechaSeleccionada no sea null ni undefined antes de llamar a sucursalesAll
        if (
          fechaSeleccionadaInicio !== null &&
          fechaSeleccionadaInicio !== undefined &&
          fechaSeleccionadaFin !== null &&
          fechaSeleccionadaFin !== undefined
        ) {
          console.log(fechaSeleccionadaInicio, fechaSeleccionadaFin);
          this.comprasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosSUC: any;
  sucursalesAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (responseSUC: any) => {
        this.datosSUC = responseSUC;
      },
      error: () => {},
      complete: () => {},
    });
  }

  form = this.fb.group({
    fechacomprainicio: ['', Validators.required],
    fechacomprafin: ['', Validators.required],
  });

  fechaVisual: any;
  fechaVisualInicio: any;
  fechaVisualFin: any;
  fechaI: any;
  fechaF: any;
  resultadoMostrar: any;
  datosCOMPRA: Compra[] = [];
  private comprasAll(fechaInicio: string, fechaFin: string): void {
    Notiflix.Loading.standard('Loading...');
    this.comprasList = [];
    this.serialNumberArray = [];

    this.fechaVisualInicio = this.datePipe.transform(fechaInicio, 'dd/MM/yyyy');
    this.fechaVisualFin = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
    this.fechaI = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd');
    this.fechaF = this.datePipe.transform(fechaFin, 'yyyy-MM-dd');
    // Obtener datos sin aplicar el filtro
    this.comprasService.getComprasAll().subscribe({
      next: (datosCOMPRA: any) => {
        this.datosCOMPRA = datosCOMPRA;

        if (fechaInicio && fechaFin) {
          this.resultadoMostrar = true;
          //console.log(this.resultadoMostrar);
        }
        const dataCompraFinal = this.datosCOMPRA.filter(
          (comp: any) =>
            comp.compra_fecha >= this.fechaI && comp.compra_fecha <= this.fechaF
        );
        if (dataCompraFinal) {
          this.datosCOMPRA = dataCompraFinal;
          this.totalData = this.datosCOMPRA.length;
        }

        // Mapea los nombres de datos de ventas
        this.datosCOMPRA = this.datosCOMPRA.map((compra: Compra) => {
          //PARA PROVEEDOR
          const proveedor = this.datosPROVEEDOR.find(
            (prov: any) => prov.proveedor_id === compra.proveedor_id
          );
          if (proveedor) {
            compra.nombreProveedor = proveedor.razon_social;
          }
          //PARA DESTINO/SUCURSAL
          const sucursal = this.datosSUC.find(
            (suc: any) => suc.suc_id === compra.destino_id
          );
          if (sucursal) {
            compra.nombreSucursalDestino = sucursal.suc_nombre;
          }

          return compra;
        });
        Notiflix.Loading.remove();
        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosCOMPRA.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Compra>(this.comprasList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosCOMPRA.map((res: Compra, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.comprasList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();
    //this.comprasList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)
    const filteredData = this.datosCOMPRA.filter((compra: Compra) => {
      return (
        (compra.compra_id &&
          compra.compra_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (compra.nombreProveedor &&
          compra.nombreProveedor.toLowerCase().includes(value.toLowerCase())) ||
        (compra.compra_fecha &&
          compra.compra_fecha
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (compra.tipo_pago &&
          compra.tipo_pago.toLowerCase().includes(value.toLowerCase())) ||
        (compra.proceso &&
          compra.proceso.toLowerCase().includes(value.toLowerCase())) ||
        (compra.nombreSucursalDestino &&
          compra.nombreSucursalDestino
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        ((compra.estado === 1 ? 'activo' : 'inactivo') &&
          (compra.estado === 1 ? 'activo' : 'inactivo')
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.comprasList
    this.comprasList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosCOMPRA.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Compra>(this.comprasList);
  }

  public sortData(sort: Sort) {
    const data = this.comprasList.slice();

    if (!sort.active || sort.direction === '') {
      this.comprasList = data;
    } else {
      this.comprasList = data.sort((a, b) => {
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
    //this.comprasAll();
    const fechaSeleccionadaInicio = this.form.value.fechacomprainicio;
    const fechaSeleccionadaFin = this.form.value.fechacomprafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
    this.dataSource = new MatTableDataSource<Compra>(this.comprasList); // Agregar esta línea
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
    //
    const fechaSeleccionadaInicio = this.form.value.fechacomprainicio;
    const fechaSeleccionadaFin = this.form.value.fechacomprafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    //
    const fechaSeleccionadaInicio = this.form.value.fechacomprainicio;
    const fechaSeleccionadaFin = this.form.value.fechacomprafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.comprasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    //this.totalPages = Math.ceil(totalData / pageSize);
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  public recargarCompras(): void {
    const fechaInicio = this.datePipe.transform(
      this.form.value.fechacomprainicio,
      'yyyy-MM-dd'
    );
    const fechaFin = this.datePipe.transform(
      this.form.value.fechacomprafin,
      'yyyy-MM-dd'
    );

    if (
      fechaInicio !== null &&
      fechaInicio !== undefined &&
      fechaFin !== null &&
      fechaFin !== undefined
    ) {
      // Realizar la lógica de filtrado según el rango de fechas (fechaInicio y fechaFin)
      this.comprasAll(fechaInicio, fechaFin);
    }
  }

  verFecha() {
    const fechaInicio = this.datePipe.transform(
      this.form.value.fechacomprainicio,
      'yyyy-MM-dd'
    );
    const fechaFin = this.datePipe.transform(
      this.form.value.fechacomprafin,
      'yyyy-MM-dd'
    );

    if (
      fechaInicio !== null &&
      fechaInicio !== undefined &&
      fechaFin !== null &&
      fechaFin !== undefined
    ) {
      // Realizar la lógica de filtrado según el rango de fechas (fechaInicio y fechaFin)
      this.comprasAll(fechaInicio, fechaFin);
    }
  }
  dataReporte: any;
  reporteDataDetalleReporte: any;
  exportReporteProductosExcel(): void {
    Notiflix.Loading.pulse('Generando reporte de compra...');
    const fechaInicio = this.form.value.fechacomprainicio;
    const fechaFinal = this.form.value.fechacomprafin;
    if (fechaInicio && fechaFinal) {
      this.dataReporte = {
        proceso: 'CONFIRMADO',
        estado: '1',
        fechaInicio: this.datePipe.transform(fechaInicio, 'yyyy-MM-dd'),
        fechaFinal: this.datePipe.transform(fechaFinal, 'yyyy-MM-dd'),
      };
    }
    console.log(this.dataReporte);

    this.comprasDetalleService
      .getCompraDetalleReporte(
        this.dataReporte.proceso,
        this.dataReporte.estado,
        this.dataReporte.fechaInicio,
        this.dataReporte.fechaFinal
      )
      .subscribe({
        next: (responseDataDetalleReporte) => {
          this.reporteDataDetalleReporte = responseDataDetalleReporte;
          console.log(
            'SOLCIITUD RECIBIDA CON EXITO ',
            responseDataDetalleReporte
          );
        },
        error: (errorData) => {
          Notiflix.Loading.remove();
          console.log('ALGO SALIO MAL EN EL REPORTE', errorData);
        },
        complete: () => {
          //EXCEL
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Sheet1');

          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // Agrega una fila para el título del reporte
          const titleRow = worksheet.addRow([
            '',
            'REPORTE DE PRODUCTOS COMPRADOS POR SUCURSAL Y FECHAS',
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
            'PROVEEDOR',
            'TODOS',
            'DEL',
            this.datePipe.transform(this.dataReporte.fechaInicio, 'dd-MM-yyyy'),
            'AL',
            this.datePipe.transform(this.dataReporte.fechaFinal, 'dd-MM-yyyy'),
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
            { header: 'ID COMPRA', key: 'compra_id' },
            { header: 'PROVEEDOR', key: 'razon_social' },
            { header: 'FECHA COMPRA', key: 'compra_fecha' },
            { header: 'MONEDA', key: ' compra_moneda' },
            { header: 'TIPO DE PAGO', key: 'tipo_pago' },
            { header: 'PROCESO', key: 'proceso' },
            { header: 'USUARIO VENTA', key: 'user_nombre' },
            { header: 'CODIGO DE PRODUCTO', key: 'prod_codigo' },
            { header: 'PRODUCTO NOMBRE', key: 'prod_nombre' },
            { header: 'DESCRIPCION PRODUCTO', key: 'prod_descripcion' },
            { header: 'CANTIDAD', key: 'cantidad' },
            { header: 'MEDIDA', key: 'med_nombre' },
            { header: 'PRECIO COMPRA', key: 'precio_compra' },
            { header: 'TIPO COMPROBANTE', key: 'comprobante_tipo' },
            { header: 'SERIE DE COMPROBANTE', key: 'comprobante_serie' },
            { header: 'NRO DE SERIE', key: 'comprobante_numero' },
            { header: 'DESTINO', key: 'suc_nombre' },
          ];

          // Ajusta la altura de la fila de encabezados
          const headerRow = worksheet.addRow(
            headers.map((header) => header.header)
          );
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
          this.reporteDataDetalleReporte.forEach((data: any) => {
            // Redondea el valor de data.montotal a 2 decimales
            //const precio_venta = data.precio_venta.toFixed(2);
            if (
              data.comprobante_tipo === '' ||
              data.comprobante_tipo === null
            ) {
              data.comprobante_tipo = '-';
            }
            if (
              data.comprobante_serie === '' ||
              data.comprobante_serie === null
            ) {
              data.comprobante_serie = '-';
            }
            if (
              data.comprobante_numero === '' ||
              data.comprobante_numero === null
            ) {
              data.comprobante_numero = '-';
            }
            if (data.suc_nombre === '' || data.suc_nombre === null) {
              data.suc_nombre = '-';
            }
            const row = [
              parseInt(data.compra_id),
              data.razon_social,
              data.compra_fecha,
              data.compra_moneda,
              data.tipo_pago,
              data.proceso,
              data.user_nombre,
              data.prod_codigo,
              data.prod_nombre,
              data.prod_descripcion,
              parseInt(data.cantidad),
              data.med_nombre,
              parseFloat(data.precio_compra),
              data.comprobante_tipo,
              data.comprobante_serie,
              data.comprobante_numero,
              data.suc_nombre,
            ];

            const excelRow = worksheet.addRow(row);
            excelRow.height = 28.5; // Altura del header

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
            }; // ID COMPRA
            excelRow.getCell(2).alignment = {
              vertical: 'middle',
              horizontal: 'justify',
            }; // PROVEEDOR
            excelRow.getCell(3).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // FECHA COMPRA
            excelRow.getCell(4).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // MONEDA
            excelRow.getCell(5).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // TIPO DE PAGO
            excelRow.getCell(6).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // PROCESO
            excelRow.getCell(7).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // USUARIO VENTA
            excelRow.getCell(8).alignment = {
              vertical: 'middle',
              horizontal: 'center',
              wrapText: true, // Habilitar ajuste de texto
            }; // CODIGO DE PRODUCTO
            excelRow.getCell(9).alignment = {
              vertical: 'middle',
              horizontal: 'center',
              wrapText: true, // Habilitar ajuste de texto
            }; // PRODUCTO NOMBRE
            excelRow.getCell(10).alignment = {
              vertical: 'middle',
              horizontal: 'center',
              wrapText: true, // Habilitar ajuste de texto
            }; // DESCRIPCION PRODUCTO
            excelRow.getCell(11).alignment = {
              vertical: 'middle',
              horizontal: 'right',
              indent: 1, // Ajusta el valor según sea necesario (sangria a la derecha)
            }; // CANTIDAD
            excelRow.getCell(12).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // MEDIDA
            excelRow.getCell(13).alignment = {
              vertical: 'middle',
              horizontal: 'right',
              indent: 1, // Ajusta el valor según sea necesario (sangria a la derecha)
            }; // PRECIO COMPRA
            excelRow.getCell(14).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // TIPO COMPROBANTE
            excelRow.getCell(15).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // SERIE DE COMPROBANTE
            excelRow.getCell(16).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // NRO DE SERIE
            excelRow.getCell(17).alignment = {
              vertical: 'middle',
              horizontal: 'center',
            }; // DESTINO
            // Configura el formato de la celda para la columna del monto
            const montoCell1 = excelRow.getCell(11);
            montoCell1.numFmt = '#,##0'; // Formato de número
            const montoCell2 = excelRow.getCell(13);
            montoCell2.numFmt = '#,##0.00'; // Formato de número con 2 decimales
          });

          // Ajustar el ancho de las columnas A, B y C
          worksheet.getColumn('A').width = 11; // Ancho de la columna A
          worksheet.getColumn('B').width = 40; // Ancho de la columna B
          worksheet.getColumn('C').width = 18; // Ancho de la columna C
          worksheet.getColumn('D').width = 15; // Ancho de la columna D
          worksheet.getColumn('E').width = 18; // Ancho de la columna E
          worksheet.getColumn('F').width = 20; // Ancho de la columna F
          worksheet.getColumn('G').width = 18; // Ancho de la columna G
          worksheet.getColumn('H').width = 15; // Ancho de la columna H
          worksheet.getColumn('I').width = 35; // Ancho de la columna I
          worksheet.getColumn('J').width = 45; // Ancho de la columna J
          worksheet.getColumn('K').width = 15; // Ancho de la columna K
          worksheet.getColumn('L').width = 16; // Ancho de la columna L
          worksheet.getColumn('M').width = 14; // Ancho de la columna M
          worksheet.getColumn('N').width = 16; // Ancho de la columna N
          worksheet.getColumn('O').width = 16; // AOcho de la columna N
          worksheet.getColumn('P').width = 13; // AnchP de la columna O
          worksheet.getColumn('Q').width = 20; // Ancho de la columna K

          // Descargar el archivo Excel
          workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
            const blob = new Blob([data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download =
              'Reporte de Compras x Producto del ' +
              this.dataReporte.fechaInicio +
              ' al ' +
              this.dataReporte.fechaFinal +
              '.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
            Notiflix.Loading.remove();
            Notiflix.Notify.success('Descargado con &eacute;xito.', {
              position: 'right-bottom',
            });
          });
        },
      });
  }
}
