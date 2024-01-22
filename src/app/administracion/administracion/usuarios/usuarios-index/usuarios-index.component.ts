import { Component, OnInit } from '@angular/core';
import { rutasadministracion } from 'src/app/shared/routes/rutasadministracion';
import { pageSelection, User } from 'src/app/shared/interfaces/user';
import { GeneralService } from 'src/app/shared/services/general.service';
import { RolesService } from 'src/app/shared/services/roles/roles.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-usuarios-index',
  templateUrl: './usuarios-index.component.html',
  styleUrls: ['./usuarios-index.component.scss'],
})
export class UsuariosIndexComponent implements OnInit {
  public rutaadministracion = rutasadministracion;
  datosUSUARIOS: User[] = [];
  clienteallError: string = '';

  public usuariosList: Array<User> = [];
  dataSource!: MatTableDataSource<User>;

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

  constructor(
    public generalService: GeneralService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.rolesAll();
  }

  datosROLES: any;
  rolesAll(): void {
    this.rolesService.getRolesAll().subscribe({
      next: (datosROLES: any) => {
        this.datosROLES = datosROLES;
      },
      error: (errorData) => {},
      complete: () => {
        this.usuariosAll();
      },
    });
  }

  private usuariosAll(): void {
    this.usuariosList = [];
    this.serialNumberArray = [];

    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSUARIOS: any) => {
        this.datosUSUARIOS = datosUSUARIOS;

        // Mapea los nombres de los clientes a los datos de ventas
        this.datosUSUARIOS = this.datosUSUARIOS.map((usuario: User) => {
          //PARA ROLES
          const role = this.datosROLES.find(
            (rol: any) => rol.rol_id === usuario.rol_id
          );
          if (role) {
            usuario.nombreRol = role.rol_nombre;
          }
          return usuario;
        });

        this.totalData = this.datosUSUARIOS.length;

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosUSUARIOS.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
        this.clienteallError = errorData;
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<User>(this.usuariosList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosUSUARIOS.map((res: User, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.usuariosList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase(); this.usuariosList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)

    const filteredData = this.datosUSUARIOS.filter((user: User) => {
      return (
        (user.user_id &&
          user.user_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (user.user_name &&
          user.user_name.toLowerCase().includes(value.toLowerCase())) ||
        (user.user_nombre &&
          user.user_nombre.toLowerCase().includes(value.toLowerCase())) ||
        (user.user_correo &&
          user.user_correo.toLowerCase().includes(value.toLowerCase())) ||
        (user.fecha_registro &&
          user.fecha_registro
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (user.user_panel === '1' &&
          'ventas'.toLowerCase().includes(value.toLowerCase())) ||
        (user.user_panel === '2' &&
          'clinica'.toLowerCase().includes(value.toLowerCase())) ||
        (user.user_panel === '3' &&
          'administracion'.toLowerCase().includes(value.toLowerCase())) ||
        (user.user_correo &&
          user.user_correo.toLowerCase().includes(value.toLowerCase())) ||
        ((user.user_estado === 1 ? 'activo' : 'inactivo') &&
          (user.user_estado === 1 ? 'activo' : 'inactivo')
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.usuariosList
    this.usuariosList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosUSUARIOS.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<User>(this.usuariosList);
  }

  public sortData(sort: Sort) {
    const data = this.usuariosList.slice();

    if (!sort.active || sort.direction === '') {
      this.usuariosList = data;
    } else {
      this.usuariosList = data.sort((a, b) => {
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
      this.usuariosAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.usuariosAll();
    }
    this.dataSource = new MatTableDataSource<User>(this.usuariosList); // Agregar esta línea
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
    this.usuariosAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.usuariosAll();
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
