import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { StockService } from 'src/app/shared/services/logistica/stock/stock.service';
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
      next: (datosSTOCK: any) => {
        this.datosSTOCK = datosSTOCK;
        this.totalData = this.datosSTOCK.length;

        // Mapear nombres
        this.datosSTOCK = this.datosSTOCK.map((stock: Stock) => {
          //PARA productos
          const producto = this.datosPRO.find(
            (pro: any) => pro.prod_id === stock.producto_id
          );
          if (producto) {
            stock.codigoProducto = producto.prod_codigo;
            stock.nombreProducto = producto.prod_nombre;
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

        datosSTOCK.map((res: Stock, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.stockList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        //console.log(this.usersucursal);
        /* this.stockList = this.datosSTOCK.filter(
          (data) => data.almacen_id === sucursalId
        ); */
        this.stockList = this.datosSTOCK.filter(
          (data) => data.almacen_id === this.usersucursal
        );
        this.dataSource = new MatTableDataSource<Stock>(this.stockList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }
  public searchData(value: string): void {
    console.log('searchDataValue:', value);
    this.dataSource.filter = value.trim().toLowerCase();
    this.stockList = this.dataSource.filteredData;
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

  public actualizarStock(): void {
    this.stockAll();
  }

  @ViewChild('table') table!: ElementRef;
  /*   public exportarAExcel(): void {
    const header = ['#', 'CODIGO', 'PRODUCTO', 'STOCK', 'UNIDAD MEDIDA'];
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );

    // Modificar los encabezados de las columnas
    ws['A1'] = { v: header[0], t: 's' };
    ws['B1'] = { v: header[1], t: 's' };
    ws['C1'] = { v: header[2], t: 's' };
    ws['D1'] = { v: header[3], t: 's' };
    ws['E1'] = { v: header[4], t: 's' };

    // Iterar sobre los datos y asignarlos a las celdas correspondientes
    for (let i = 0; i < this.stockList.length; i++) {
      ws[`A${i + 2}`] = {
        v: (this.currentPage - 1) * this.pageSize + i + 1,
        t: 'n',
      };
      ws[`B${i + 2}`] = { v: this.stockList[i].codigoProducto, t: 's' };
      ws[`C${i + 2}`] = { v: this.stockList[i].nombreProducto, t: 's' };
      ws[`D${i + 2}`] = { v: this.stockList[i].cantidad, t: 'n' };
      ws[`E${i + 2}`] = { v: this.stockList[i].nombreMedida, t: 's' };
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported-data.xlsx');
  } */

  public exportarAExcel(): void {
    const header0 = [this.nombreSucursal];
    const header = ['#', 'CODIGO', 'PRODUCTO', 'STOCK', 'UNIDAD MEDIDA'];
    const data: any[][] = [];

    // Agregar encabezados a los datos
    data.push(header0);
    data.push(header);

    // Iterar sobre los datos y agregarlos a la matriz
    for (let i = 0; i < this.stockList.length; i++) {
      const rowData = [
        (this.currentPage - 1) * this.pageSize + i + 1,
        this.stockList[i].codigoProducto,
        this.stockList[i].nombreProducto,
        this.stockList[i].cantidad,
        this.stockList[i].nombreMedida,
      ];

      data.push(rowData);
    }

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    // Combinar celdas para header0
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

    // Aplicar estilos a header0 para centrar
    for (let i = 0; i < 5; i++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: i });
      if (!ws[cell]) {
        ws[cell] = { s: {} }; // Crea la celda si no existe
      }
      Object.assign(ws[cell], {
        s: { alignment: { horizontal: 'center' }, font: { bold: true } },
      });
    }

    // Aplicar estilos a los encabezados
    ws['!cols'] = [
      { width: 10 }, // A
      { width: 20 }, // B
      { width: 50 }, // C
      { width: 15 }, // D
      { width: 25 }, // E
    ];
    // Iterar sobre las celdas de los encabezados para aplicar estilos individualmente
    for (let i = 0; i < header.length; i++) {
      const cell = XLSX.utils.encode_cell({ r: 1, c: i });
      Object.assign(ws[cell], {
        s: { alignment: { horizontal: 'center' }, font: { bold: true } },
      });
    }

    ws['!rows'] = [{ hpx: 20 }]; // Altura de la primera fila (encabezados)

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.nombreSucursal);
    XLSX.writeFile(wb, 'Stock de Sucursal '+this.nombreSucursal+'.xlsx');
  }
}
