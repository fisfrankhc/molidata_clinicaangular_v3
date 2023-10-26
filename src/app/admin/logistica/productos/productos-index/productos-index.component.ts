import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ProductoService } from 'src/app/shared/services/logistica/producto/producto.service';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection, Producto } from 'src/app/shared/interfaces/logistica';

@Component({
  selector: 'app-productos-index',
  templateUrl: './productos-index.component.html',
  styleUrls: ['./productos-index.component.scss'],
})
export class ProductosIndexComponent {
  public ruta = rutas;
  datosPRO: Producto[] = [];
  productoallError: string = '';

  public productoList: Array<Producto> = [];
  dataSource!: MatTableDataSource<Producto>;

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

  constructor(public productoService: ProductoService) {}
  ngOnInit(): void {
    this.productosAll();
  }

  private productosAll(): void {
    this.productoList = [];
    this.serialNumberArray = [];

    this.productoService.getProductosAll().subscribe(
      {
        next: (datosPRO: any) => {
          this.datosPRO = datosPRO;
          this.totalData = this.datosPRO.length;

          this.datosPRO.map((res: Producto, index: number) => {
            const serialNumber = index + 1;
            if (index >= this.skip && serialNumber <= this.limit) {
              this.productoList.push(res);
              //console.log(this.productoList.push(res));
              this.serialNumberArray.push(serialNumber);
            }
          });
        },
        error: (errorData) => {
          console.error(errorData);
          this.productoallError = errorData;
        },
        complete: () => {
          this.dataSource = new MatTableDataSource<Producto>(this.productoList);
          this.calculateTotalPages(this.totalData, this.pageSize);
        },
      }
      /* (datosPRO: any) => {
      this.datosPRO = datosPRO;
      this.totalData = this.datosPRO.length;

      this.datosPRO.map((res: Producto, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.productoList.push(res);
          //console.log(this.productoList.push(res));
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<Producto>(this.productoList);
      this.calculateTotalPages(this.totalData, this.pageSize);
      } */
    );
  }

  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.productoList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.productoList.slice();

    if (!sort.active || sort.direction === '') {
      this.productoList = data;
    } else {
      this.productoList = data.sort((a, b) => {
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
      this.productosAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.productosAll();
    }
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
    this.productosAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.productosAll();
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
}
