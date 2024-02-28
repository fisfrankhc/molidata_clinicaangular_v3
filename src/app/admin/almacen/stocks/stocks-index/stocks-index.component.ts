import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { StockService } from 'src/app/shared/services/almacen/stock/stock.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { MedidaService } from 'src/app/shared/services/logistica/producto/medida.service';
import { pageSelection, Stock } from 'src/app/shared/interfaces/logistica';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-stocks-index',
  templateUrl: './stocks-index.component.html',
  styleUrls: ['./stocks-index.component.scss'],
})
export class StocksIndexComponent implements OnInit {
  public ruta = rutas;
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
    this.form.patchValue({ sucursalid: '1' }); // Establecer valor predeterminado de la sucursal a 1
    this.verSucursal(); // Llamarfunción verSucursal para filtrar los datos/dfecto de la sucursal 1
  }

  datosSUC: any;
  sucursalAll() {
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUC: any) => {
        this.datosSUC = datosSUC;
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

        // Obtener la fecha seleccionada del formulario
        const sucursalB = this.form.value.sucursalid;
        if (sucursalB !== null && sucursalB !== undefined) {
          console.log(sucursalB);
          this.stockAll(sucursalB);
        }
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

  private stockAll(sucursalB: any): void {
    this.stockList = [];
    this.serialNumberArray = [];

    this.stockService.getStockAll().subscribe({
      next: (datosSTOCK: any) => {
        this.datosSTOCK = datosSTOCK;
        this.totalData = this.datosSTOCK.length;

        const dataStockFinal = this.datosSTOCK.filter(
          (st: any) => st.almacen_id === sucursalB
        );
        if (dataStockFinal) {
          this.datosSTOCK = dataStockFinal;
          this.totalData = this.datosSTOCK.length;
        }

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

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase(); this.rolesList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)

    const filteredData = this.datosSTOCK.filter((roles: Stock) => {
      return (
        (roles.stock_id &&
          roles.stock_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (roles.codigoProducto &&
          roles.codigoProducto.toLowerCase().includes(value.toLowerCase())) ||
        (roles.nombreProducto &&
          roles.nombreProducto.toLowerCase().includes(value.toLowerCase())) ||
        (roles.cantidad &&
          roles.cantidad
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (roles.stock_minimo &&
          roles.stock_minimo
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (roles.nombreMedida &&
          roles.nombreMedida.toLowerCase().includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.comprasList
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
    //this.stockAll();
    // Obtener la fecha seleccionada del formulario
    const sucursalB = this.form.value.sucursalid;
    if (sucursalB !== null && sucursalB !== undefined) {
      console.log(sucursalB);
      this.stockAll(sucursalB);
    }
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
    //this.stockAll();
    // Obtener la fecha seleccionada del formulario
    const sucursalB = this.form.value.sucursalid;
    if (sucursalB !== null && sucursalB !== undefined) {
      console.log(sucursalB);
      this.stockAll(sucursalB);
    }
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    //this.stockAll();
    // Obtener la fecha seleccionada del formulario
    const sucursalB = this.form.value.sucursalid;
    if (sucursalB !== null && sucursalB !== undefined) {
      console.log(sucursalB);
      this.stockAll(sucursalB);
    }
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    /* this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    } */
    this.totalPages = Math.ceil(totalData / pageSize);
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  verSucursal() {
    // Obtener la fecha seleccionada del formulario
    const sucursalB = this.form.value.sucursalid;
    if (sucursalB !== null && sucursalB !== undefined) {
      console.log(sucursalB);
      this.stockAll(sucursalB);
    }
  }

  actualizarStock(): void {
    // Obtener la fecha seleccionada del formulario
    const sucursalB = this.form.value.sucursalid;
    if (sucursalB !== null && sucursalB !== undefined) {
      console.log(sucursalB);
      this.stockAll(sucursalB);
    }
  }
}
