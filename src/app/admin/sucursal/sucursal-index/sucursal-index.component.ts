import { Component, OnInit } from '@angular/core';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { rutas } from 'src/app/shared/routes/rutas';
import { pageSelection, Sucursal } from 'src/app/shared/interfaces/sucursal';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-sucursal-index',
  templateUrl: './sucursal-index.component.html',
  styleUrls: ['./sucursal-index.component.scss'],
})
export class SucursalIndexComponent implements OnInit {
  constructor(private sucursalService: SucursalService) {}
  public ruta = rutas;
  datosSUCURSAL: Sucursal[] = [];

  public sucursalList: Array<Sucursal> = [];
  dataSource!: MatTableDataSource<Sucursal>;

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

  ngOnInit(): void {
    this.sucursalAll();
  }

  private sucursalAll(): void {
    this.sucursalList = [];
    this.serialNumberArray = [];
    this.sucursalService.getSucursalAll().subscribe({
      next: (datosSUCURSAL: any) => {
        this.datosSUCURSAL = datosSUCURSAL;
        this.totalData = this.datosSUCURSAL.length;

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosSUCURSAL.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Sucursal>(this.sucursalList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosSUCURSAL.map((res: Sucursal, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.sucursalList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.sucursalList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)

    const filteredData = this.datosSUCURSAL.filter((sucursal: Sucursal) => {
      return (
        (sucursal.suc_id &&
          sucursal.suc_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (sucursal.suc_nombre &&
          sucursal.suc_nombre.toLowerCase().includes(value.toLowerCase())) ||
        (sucursal.suc_direccion &&
          sucursal.suc_direccion
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        ((sucursal.suc_estado === '1' ? 'activo' : 'inactivo') &&
          (sucursal.suc_estado === '1' ? 'activo' : 'inactivo')
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.comprasList
    this.sucursalList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosSUCURSAL.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Sucursal>(this.sucursalList);
  }

  public sortData(sort: Sort) {
    const data = this.sucursalList.slice();

    if (!sort.active || sort.direction === '') {
      this.sucursalList = data;
    } else {
      this.sucursalList = data.sort((a, b) => {
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
      this.sucursalAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.sucursalAll();
    }
    this.dataSource = new MatTableDataSource<Sucursal>(this.sucursalList); // Agregar esta línea
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
    this.sucursalAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.sucursalAll();
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
