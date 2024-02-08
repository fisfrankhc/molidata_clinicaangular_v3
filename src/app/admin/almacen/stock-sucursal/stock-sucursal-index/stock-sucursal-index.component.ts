import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { pageSelection, Stock } from '../../../../shared/interfaces/logistica';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-stock-sucursal-index',
  templateUrl: './stock-sucursal-index.component.html',
  styleUrls: ['./stock-sucursal-index.component.scss'],
})
export class StockSucursalIndexComponent implements OnInit {
  public ruta = rutas;
  usersucursal = localStorage.getItem('usersucursal');
  datosSTOCK: Stock[] = [];

  public stockList: Array<Stock> = [];
  dataSource!: MatTableDataSource<Stock>;

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
    public stockService: StockService,
    public sucursalService: SucursalService,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productosAll();
    this.sucursalAll();
    this.medidasAll();
    //this.form.patchValue({ sucursalid: '1' }); Establecer valor predeterminado de la sucursal a 1
  }

  datosSUC: any;
  nombreSucursal!: string;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;

        // Realiza la lógica para obtener el nombre de la sucursal aquí
        const sucursalEncontrada = this.datosSUC.find(
          (sucursal: any) => sucursal.suc_id === this.usersucursal
        );
        this.nombreSucursal = sucursalEncontrada
          ? sucursalEncontrada.suc_nombre
          : '';
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }
  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.stockAll();
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }
  datosMED: any;
  medidasAll() {
    this.medidaService.getMedidasAll().subscribe({
      next: (datosMED: any) => {
        this.datosMED = datosMED;
      },
      error: (errorData) => {},
      complete: () => {},
    });
  }

  form = this.fb.group({
    sucursalid: ['', Validators.required],
  });

  private stockAll(): void {
    this.stockList = [];
    this.serialNumberArray = [];
    const sucursalId = this.form.value.sucursalid;
    this.stockService.getStockAll().subscribe({
      next: (responseSTOCK: any) => {
        this.datosSTOCK = responseSTOCK;
        this.totalData = this.datosSTOCK.length;
        this.datosSTOCK = this.datosSTOCK.filter(
          (data) => data.almacen_id === this.usersucursal
        );

        // Mapear nombres
        this.datosSTOCK = this.datosSTOCK.map((stock: Stock) => {
          //PARA productos
          const producto = this.datosPRO.find(
            (pro: any) => pro.prod_id === stock.producto_id
          );
          if (producto) {
            stock.codigoProducto = producto.prod_codigo;
            stock.nombreProducto = producto.prod_nombre;
            stock.descripcionProducto = producto.prod_descripcion;
          }
          //PARA Medidas
          const medida = this.datosMED.find(
            (med: any) => med.med_id === stock.unidad_medida
          );
          if (medida) {
            stock.nombreMedida = medida.med_nombre;
          }
          return stock;
        });

        this.datosSTOCK.forEach((dataStockVer: any) => {
          //console.log(dataStockVer);
          if (
            parseFloat(dataStockVer.cantidad) <=
            parseFloat(dataStockVer.stock_minimo)
          ) {
            dataStockVer.lineaRoja = true;
          }
        });
        //console.log(this.datosSTOCK);

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosSTOCK.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Stock>(this.stockList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosSTOCK.map((res: Stock, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.stockList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.stockList = this.dataSource.filteredData;
    // Realiza el filtro en todos los datos (this.datosSTOCK)
    const filteredData = this.datosSTOCK.filter((stock: Stock) => {
      return (
        (stock.stock_id &&
          stock.stock_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (stock.codigoProducto &&
          stock.codigoProducto.toLowerCase().includes(value.toLowerCase())) ||
        (stock.nombreProducto &&
          stock.nombreProducto.toLowerCase().includes(value.toLowerCase())) ||
        (stock.descripcionProducto &&
          stock.descripcionProducto
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (stock.cantidad &&
          stock.cantidad
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (stock.stock_minimo &&
          stock.stock_minimo
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (stock.stock_minimo &&
          stock.stock_minimo
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.stockList
    this.stockList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosSTOCK.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Stock>(this.stockList);
  }

  public sortData(sort: Sort) {
    const data = this.stockList.slice();

    if (!sort.active || sort.direction === '') {
      this.stockList = data;
    } else {
      this.stockList = data.sort((a, b) => {
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
    this.stockAll();
    this.dataSource = new MatTableDataSource<Stock>(this.stockList); // Agregar esta línea
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
    this.stockAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.stockAll();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = Math.ceil(totalData / pageSize);
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  public actualizarStock(): void {
    this.stockAll();
  }

  //@ViewChild('table') table!: ElementRef;

  public exportarAExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(this.nombreSucursal);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow(['REPORTE STOCK DE PRODUCTOS']);
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
    // Aplica estilo al fondo del título solo a las celdas combinadas
    titleRange.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
    };
    titleRow.height = 30;

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
      { header: 'ID', key: '#' },
      { header: 'CODIGO', key: 'codigo' },
      { header: 'PRODUCTO', key: 'producto' },
      { header: 'DESCRIPCION', key: 'descripcion' },
      { header: 'STOCK ACTUAL', key: 'stock_actual' },
      { header: 'STOCK MINIMO PERMITIDO', key: 'stock_minimo' },
      { header: 'UNIDAD MEDIDA', key: 'unidadmedida' },
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
    this.datosSTOCK.forEach((data: any) => {
      const row = [
        parseInt(data.producto_id),
        data.codigoProducto,
        data.nombreProducto,
        data.descripcionProducto,
        parseInt(data.cantidad),
        parseFloat(data.stock_minimo),
        data.nombreMedida,
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
      }; // CODIGO
      excelRow.getCell(3).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; //PRODUCTO
      excelRow.getCell(4).alignment = {
        vertical: 'middle',
        horizontal: 'justify',
      }; // DESCRIPCION PRODUCTO
      excelRow.getCell(5).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // STOCK ACTUAL
      excelRow.getCell(6).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // STOCK MINIMO PERMITIDO
      excelRow.getCell(7).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      }; // UNIDAD MEDIDA
      // Configura el formato de la celda para la columna del monto
      const montoCell1 = excelRow.getCell(5);
      montoCell1.numFmt = '#,##0'; // Formato de número
      const montoCell2 = excelRow.getCell(6);
      montoCell2.numFmt = '#,##0.00'; // Formato de número con 2 decimales
    });

    // Ajustar el ancho de las columnas A, B y C
    worksheet.getColumn('A').width = 10; // Ancho de la columna A
    worksheet.getColumn('B').width = 15; // Ancho de la columna B
    worksheet.getColumn('C').width = 45; // Ancho de la columna C
    worksheet.getColumn('D').width = 50; // Ancho de la columna D
    worksheet.getColumn('E').width = 14; // Ancho de la columna E
    worksheet.getColumn('F').width = 18; // Ancho de la columna F
    worksheet.getColumn('G').width = 22; // Ancho de la columna G

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Reporte de Stock de productos de la sucursal ' +
        this.nombreSucursal +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  exportarStockMinExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(this.nombreSucursal);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Agrega una fila para el título del reporte
    const titleRow = worksheet.addRow(['REPORTE PRODUCTOS CON STOCK MINIMO']);
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
    // Aplica estilo al fondo del título solo a las celdas combinadas
    titleRange.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'A1C1E7' }, // Color de fondo azul claro
    };
    titleRow.height = 30;

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
      { header: 'ID', key: '#' },
      { header: 'CODIGO', key: 'codigo' },
      { header: 'PRODUCTO', key: 'producto' },
      { header: 'DESCRIPCION', key: 'descripcion' },
      { header: 'STOCK ACTUAL', key: 'stock_actual' },
      { header: 'STOCK MINIMO PERMITIDO', key: 'stock_minimo' },
      { header: 'UNIDAD MEDIDA', key: 'unidadmedida' },
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

    let row: any;
    // Agrega datos
    this.datosSTOCK.forEach((data: any) => {
      if (parseInt(data.cantidad) <= parseFloat(data.stock_minimo)) {
        const row = [
          parseInt(data.producto_id),
          data.codigoProducto,
          data.nombreProducto,
          data.descripcionProducto,
          parseInt(data.cantidad),
          parseFloat(data.stock_minimo),
          data.nombreMedida,
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
        }; // CODIGO
        excelRow.getCell(3).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }; //PRODUCTO
        excelRow.getCell(4).alignment = {
          vertical: 'middle',
          horizontal: 'justify',
        }; // DESCRIPCION PRODUCTO
        excelRow.getCell(5).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }; // STOCK ACTUAL
        excelRow.getCell(6).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }; // STOCK MINIMO PERMITIDO
        excelRow.getCell(7).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        }; // UNIDAD MEDIDA
        // Configura el formato de la celda para la columna del monto
        const montoCell1 = excelRow.getCell(5);
        montoCell1.numFmt = '#,##0'; // Formato de número
        const montoCell2 = excelRow.getCell(6);
        montoCell2.numFmt = '#,##0.00'; // Formato de número con 2 decimales
      }
    });

    // Ajustar el ancho de las columnas A, B y C
    worksheet.getColumn('A').width = 10; // Ancho de la columna A
    worksheet.getColumn('B').width = 15; // Ancho de la columna B
    worksheet.getColumn('C').width = 45; // Ancho de la columna C
    worksheet.getColumn('D').width = 50; // Ancho de la columna D
    worksheet.getColumn('E').width = 14; // Ancho de la columna E
    worksheet.getColumn('F').width = 18; // Ancho de la columna F
    worksheet.getColumn('G').width = 22; // Ancho de la columna G

    // Descargar el archivo Excel
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        'Reporte de Productos con Stock Minimo de la Sucursal ' +
        this.nombreSucursal +
        '.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
