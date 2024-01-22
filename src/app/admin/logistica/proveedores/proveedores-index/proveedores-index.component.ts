import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { ProveedoresService } from 'src/app/shared/services/logistica/proveedor/proveedores.service';
import {
  pageSelection,
  Proveedor,
} from '../../../../shared/interfaces/logistica';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-proveedores-index',
  templateUrl: './proveedores-index.component.html',
  styleUrls: ['./proveedores-index.component.scss'],
})
export class ProveedoresIndexComponent implements OnInit {
  public ruta = rutas;
  datosPROVEEDOR: Proveedor[] = [];

  public proveedorList: Array<Proveedor> = [];
  dataSource!: MatTableDataSource<Proveedor>;

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

  constructor(public proveedoresService: ProveedoresService) {}

  ngOnInit(): void {
    this.proveedoresAll();
  }

  private proveedoresAll(): void {
    this.proveedorList = [];
    this.serialNumberArray = [];
    this.proveedoresService.getProveedoresAll().subscribe({
      next: (datosPROVEEDOR: any) => {
        this.datosPROVEEDOR = datosPROVEEDOR;
        this.totalData = this.datosPROVEEDOR.length;

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosPROVEEDOR.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Proveedor>(this.proveedorList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosPROVEEDOR.map((res: Proveedor, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.proveedorList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.proveedorList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)
    const filteredData = this.datosPROVEEDOR.filter((proveedor: Proveedor) => {
      return (
        (proveedor.proveedor_id &&
          proveedor.proveedor_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (proveedor.documento_tipo &&
          proveedor.documento_tipo
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (proveedor.documento_numero &&
          proveedor.documento_numero
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (proveedor.razon_social &&
          proveedor.razon_social.toLowerCase().includes(value.toLowerCase())) ||
        (proveedor.proveedor_descripcion &&
          proveedor.proveedor_descripcion
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (proveedor.proveedor_direccion &&
          proveedor.proveedor_direccion
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (proveedor.proveedor_email &&
          proveedor.proveedor_email
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        ((proveedor.proveedor_estado === 1 ? 'activo' : 'inactivo') &&
          (proveedor.proveedor_estado === 1 ? 'activo' : 'inactivo')
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.proveedorList
    this.proveedorList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosPROVEEDOR.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Proveedor>(this.proveedorList);
  }

  public sortData(sort: Sort) {
    const data = this.proveedorList.slice();

    if (!sort.active || sort.direction === '') {
      this.proveedorList = data;
    } else {
      this.proveedorList = data.sort((a, b) => {
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
    this.proveedoresAll();
    this.dataSource = new MatTableDataSource<Proveedor>(this.proveedorList); // Agregar esta línea
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
    this.proveedoresAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.proveedoresAll();
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
