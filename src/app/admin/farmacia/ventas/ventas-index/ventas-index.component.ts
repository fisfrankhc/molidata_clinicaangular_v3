import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { VentasService } from 'src/app/shared/services/farmacia/ventas/ventas.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Ventas } from 'src/app/shared/interfaces/farmacia';
import { ClientesService } from 'src/app/shared/services/farmacia/clientes/clientes.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-ventas-index',
  templateUrl: './ventas-index.component.html',
  styleUrls: ['./ventas-index.component.scss'],
})
export class VentasIndexComponent implements OnInit {
  public ruta = rutas;
  datosVENTA: Ventas[] = [];

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    public ventasService: VentasService,
    public clientesService: ClientesService,
    public sucursalService: SucursalService,
    public generalService: GeneralService
  ) {}

  public ventasList: Array<Ventas> = [];
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
  fechaFormateada = this.datePipe.transform(this.fechaActual, 'MM/dd/yyyy');
  ngOnInit(): void {
    this.fechaVisual = this.fechaFormateada;
    this.clientesAll();
    this.sucursalAll();
    this.usuariosAll();
  }

  datosUSER: any;
  usuariosAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSER: any) => {
        this.datosUSER = datosUSER;
      },
      error: () => {},
      complete: () => {},
    });
  }

  datosCLI: any;
  clientesAll(): void {
    this.clientesService.getClientesAll().subscribe({
      next: (datosCLI: any) => {
        this.datosCLI = datosCLI;
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
          this.ventasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
        }
      },
      error: () => {},
      complete: () => {},
    });
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

  fechaVisual: any;
  fechaVisualInicio: any;
  fechaVisualFin: any;
  fechaI: any;
  fechaF: any;
  resultadoMostrar: any;
  private ventasAll(fechaInicio: string, fechaFin: string): void {
    this.ventasList = [];
    this.serialNumberArray = [];

    this.fechaVisualInicio = this.datePipe.transform(fechaInicio, 'dd/MM/yyyy');
    this.fechaVisualFin = this.datePipe.transform(fechaFin, 'dd/MM/yyyy');
    this.fechaI = this.datePipe.transform(fechaInicio, 'yyyy-MM-dd');
    this.fechaF = this.datePipe.transform(fechaFin, 'yyyy-MM-dd');
    console.log(this.fechaI, this.fechaF);
    //console.log(this.fechaVisualInicio, this.fechaVisualFin);
    this.ventasService.getVentasAll().subscribe({
      next: (datosVENTA: any) => {
        this.datosVENTA = datosVENTA;

        if (fechaInicio && fechaFin) {
          this.resultadoMostrar = true;
          console.log(this.resultadoMostrar);
        }
        const dataVentaFinal = this.datosVENTA.filter(
          (vent: any) =>
            vent.venta_fecha >= this.fechaI && vent.venta_fecha <= this.fechaF
        );
        if (dataVentaFinal) {
          this.datosVENTA = dataVentaFinal;
          this.totalData = this.datosVENTA.length;
        }
        // Mapea los nombres de los clientes a los datos de ventas
        this.datosVENTA = this.datosVENTA.map((venta: Ventas) => {
          //PARA CLIENTES
          const cliente = this.datosCLI.find(
            (cli: any) => cli.cli_id === venta.cliente_id
          );
          if (cliente) {
            venta.nombreCliente = cliente.cli_nombre;
          }
          //PARA SUCURSALES
          const sucursal = this.datosSUC.find(
            (suc: any) => suc.suc_id === venta.sucursal_id
          );
          if (sucursal) {
            venta.nombreSucursal = sucursal.suc_nombre;
          }

          //PARA SUCURSALES
          const usuario = this.datosUSER.find(
            (user: any) => user.user_id === venta.usuario_id
          );
          if (usuario) {
            venta.nombreUsuarioVenta = usuario.user_nombre;
          }

          return venta;
        });
        console.log(this.datosVENTA);
        console.log(this.totalData);
        this.datosVENTA.map((res: Ventas, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.ventasList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Ventas>(this.ventasList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  form = this.fb.group({
    fechaventainicio: ['', Validators.required],
    fechaventafin: ['', Validators.required],
  });

  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.ventasList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.ventasList.slice();

    if (!sort.active || sort.direction === '') {
      this.ventasList = data;
    } else {
      this.ventasList = data.sort((a, b) => {
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
    //this.ventasAll();
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.ventasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
    }
    this.dataSource = new MatTableDataSource<Ventas>(this.ventasList); // Agregar esta línea
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
    //this.ventasAll();
    const fechaSeleccionadaInicio = this.form.value.fechaventainicio;
    const fechaSeleccionadaFin = this.form.value.fechaventafin;
    if (
      fechaSeleccionadaInicio !== null &&
      fechaSeleccionadaInicio !== undefined &&
      fechaSeleccionadaFin !== null &&
      fechaSeleccionadaFin !== undefined
    ) {
      this.ventasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
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
      this.ventasAll(fechaSeleccionadaInicio, fechaSeleccionadaFin);
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
      this.ventasAll(fechaInicio, fechaFin);
    }
  }
  estadoExcel: any;
  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow([
      'REPORTE DE VENTAS DEL ' +
        this.fechaVisualInicio +
        ' AL ' +
        this.fechaVisualFin,
    ]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${titleRow.number}:G${titleRow.number}`);
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
      { header: 'ID', key: 'venta_id' },
      { header: 'FECHA', key: 'venta_fecha' },
      { header: 'CLIENTE', key: 'cliente_id' },
      { header: 'PROCESO DE VENTA', key: 'venta_proceso' },
      { header: 'USUARIO', key: 'usuario_id' },
      { header: 'SUCURSAL', key: 'sucursal_id' },
      { header: 'ESTADO', key: 'venta_estado' },
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
    this.ventasList.forEach((data) => {
      // Redondea el valor de data.montotal a 2 decimales
      if (data.venta_estado === '1') {
        this.estadoExcel = 'ACTIVO';
      } else {
        this.estadoExcel = 'INACTIVO';
      }
      const row = [
        +data.venta_id,

        
        data.venta_fecha,
        data.nombreCliente,
        data.venta_proceso,
        data.nombreUsuarioVenta,
        data.nombreSucursal,
        this.estadoExcel,
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
      }; // VENTAID
      excelRow.getCell(2).alignment = {
        vertical: 'middle',
      }; // FECHA
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'justify',
      }; // CLIENTE
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // PROCESO DE VENTA
      excelRow.getCell(5).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // USUARIO
      excelRow.getCell(6).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // SUCURSAL
      excelRow.getCell(7).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // ESTADO
      const montoCell1 = excelRow.getCell(1);
      montoCell1.numFmt = '#,##0'; // Formato de número
    });

    // Ajustar el ancho de las columnas A, B y C
    worksheet.getColumn('A').width = 10; // Ancho de la columna A
    worksheet.getColumn('B').width = 15; // Ancho de la columna B
    worksheet.getColumn('C').width = 45; // Ancho de la columna C
    worksheet.getColumn('D').width = 20; // Ancho de la columna D
    worksheet.getColumn('E').width = 20; // Ancho de la columna E
    worksheet.getColumn('F').width = 35; // Ancho de la columna F
    worksheet.getColumn('G').width = 18; // Ancho de la columna G

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Reporte de Ventas x del ' +
        this.fechaVisualInicio +
        ' al ' +
        this.fechaVisualFin +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
