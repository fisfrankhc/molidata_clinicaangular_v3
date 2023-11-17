import { Component, OnInit } from '@angular/core';
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
        this.nombreSucursal = sucursalEncontrada ? sucursalEncontrada.suc_nombre : '';
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
}
