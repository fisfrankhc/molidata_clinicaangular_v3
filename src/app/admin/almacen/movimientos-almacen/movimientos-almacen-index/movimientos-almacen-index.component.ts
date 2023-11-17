import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { pageSelection, Movimientos } from 'src/app/shared/interfaces/almacen';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MovimientosAlmacenService } from '../../../../shared/services/almacen/movimientos-almacen/movimientos-almacen.service';

@Component({
  selector: 'app-movimientos-almacen-index',
  templateUrl: './movimientos-almacen-index.component.html',
  styleUrls: ['./movimientos-almacen-index.component.scss'],
})
export class MovimientosAlmacenIndexComponent implements OnInit {
  public ruta = rutas;

  datosINGRESO: Movimientos[] = [];

  public ingresoList: Array<Movimientos> = [];
  dataSource!: MatTableDataSource<Movimientos>;

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

  constructor(public movimientosAlmacenService: MovimientosAlmacenService) {}

  ngOnInit(): void {
    this.ingresosAll();
  }

  private ingresosAll(): void {
    this.ingresoList = [];
    this.serialNumberArray = [];
    this.movimientosAlmacenService.getMovimientosAll().subscribe({
      next: (datosINGRESO: any) => {
        this.datosINGRESO = datosINGRESO;
        this.totalData = this.datosINGRESO.length;
      /*
          if (datosINGRESO.includes('no hay resultados')) {
          this.totalData = 0;
          }
      */
        if (datosINGRESO === 'no hay resultados') {
          this.totalData = 0;
        }

        datosINGRESO.map((res: Movimientos, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.ingresoList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Movimientos>(this.ingresoList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }
  public searchData(value: string): void {
    console.log('searchDataValue:', value);
    this.dataSource.filter = value.trim().toLowerCase();
    this.ingresoList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.ingresoList.slice();

    if (!sort.active || sort.direction === '') {
      this.ingresoList = data;
    } else {
      this.ingresoList = data.sort((a, b) => {
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
    this.ingresosAll();
    this.dataSource = new MatTableDataSource<Movimientos>(this.ingresoList); // Agregar esta línea
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
    this.ingresosAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.ingresosAll();
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

  public actualizarIngresos(): void {
    this.ingresosAll();
  }
}
