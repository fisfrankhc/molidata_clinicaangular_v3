import { Component, OnInit } from '@angular/core';

import { rutas } from 'src/app/shared/routes/rutas';
import { StockCentralService } from 'src/app/shared/services/logistica/stock-central/stock-central.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import {
  pageSelection,
  StockCentral,
} from 'src/app/shared/interfaces/logistica';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-stock-central-index',
  templateUrl: './stock-central-index.component.html',
  styleUrls: ['./stock-central-index.component.scss'],
})
export class StockCentralIndexComponent implements OnInit {
  public ruta = rutas;
  usersucursal = localStorage.getItem('usersucursal');
  datosSTOCK: StockCentral[] = [];

  public stockCentralList: Array<StockCentral> = [];
  dataSource!: MatTableDataSource<StockCentral>;

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
    public stockCentralService: StockCentralService,
    private productoService: ProductoService,
    private medidaService: MedidaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productosAll();
    this.medidasAll();
    //this.form.patchValue({ sucursalid: '1' }); Establecer valor predeterminado de la sucursal a 1
  }

  datosPRO: any;
  productosAll() {
    this.productoService.getProductosAll().subscribe({
      next: (datosPRO: any) => {
        this.datosPRO = datosPRO;
        this.stockCentralAll();
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

  private stockCentralAll(): void {
    this.stockCentralList = [];
    this.serialNumberArray = [];
    this.stockCentralService.getStockCentralAll().subscribe({
      next: (responseSTOCK: any) => {
        this.datosSTOCK = responseSTOCK;
        this.totalData = this.datosSTOCK.length;
        //console.log(this.datosSTOCK);

        // Mapear nombres
        this.datosSTOCK = this.datosSTOCK.map((stock: StockCentral) => {
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
        this.dataSource = new MatTableDataSource<StockCentral>(
          this.stockCentralList
        );
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosSTOCK.map((res: StockCentral, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.stockCentralList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.stockCentralList = this.dataSource.filteredData;
    // Realiza el filtro en todos los datos (this.datosSTOCK)
    const filteredData = this.datosSTOCK.filter((stock: StockCentral) => {
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
        (stock.nombreMedida &&
          stock.nombreMedida.toLowerCase().includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.stockCentralList
    this.stockCentralList = filteredData.slice(this.skip, this.limit);

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
    this.dataSource = new MatTableDataSource<StockCentral>(
      this.stockCentralList
    );
  }

  public sortData(sort: Sort) {
    const data = this.stockCentralList.slice();

    if (!sort.active || sort.direction === '') {
      this.stockCentralList = data;
    } else {
      this.stockCentralList = data.sort((a, b) => {
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
    this.stockCentralAll();
    this.dataSource = new MatTableDataSource<StockCentral>(
      this.stockCentralList
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
    this.stockCentralAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.stockCentralAll();
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
    this.stockCentralAll();
  }
}
