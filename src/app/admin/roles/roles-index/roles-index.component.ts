import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { RolesService } from 'src/app/shared/services/roles/roles.service';
import { pageSelection, Roles } from 'src/app/shared/interfaces/roles';

@Component({
  selector: 'app-roles-index',
  templateUrl: './roles-index.component.html',
  styleUrls: ['./roles-index.component.scss'],
})
export class RolesIndexComponent implements OnInit {
  constructor(private rolesService: RolesService) {}
  public ruta = rutas;
  public rolesList: Array<Roles> = [];
  dataSource!: MatTableDataSource<Roles>;

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
    this.rolesAll();
  }
  datosRoles: Roles[] = [];

  private rolesAll(): void {
    this.rolesList = [];
    this.serialNumberArray = [];
    this.rolesService.getRolesAll().subscribe({
      next: (datosRoles: any) => {
        this.datosRoles = datosRoles;
        this.totalData = this.datosRoles.length;

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosRoles.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Roles>(this.rolesList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosRoles.map((res: Roles, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.rolesList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase(); this.rolesList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)

    const filteredData = this.datosRoles.filter((roles: Roles) => {
      return (
        (roles.rol_id &&
          roles.rol_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (roles.rol_nombre &&
          roles.rol_nombre.toLowerCase().includes(value.toLowerCase())) ||
        (roles.rol_descripcion &&
          roles.rol_descripcion
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        ((roles.rol_estado === '1' ? 'activo' : 'inactivo') &&
          (roles.rol_estado === '1' ? 'activo' : 'inactivo')
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.comprasList
    this.rolesList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosRoles.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Roles>(this.rolesList);
  }

  public sortData(sort: Sort) {
    const data = this.rolesList.slice();

    if (!sort.active || sort.direction === '') {
      this.rolesList = data;
    } else {
      this.rolesList = data.sort((a, b) => {
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
      this.rolesAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.rolesAll();
    }
    this.dataSource = new MatTableDataSource<Roles>(this.rolesList); // Agregar esta línea
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
    this.rolesAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.rolesAll();
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
