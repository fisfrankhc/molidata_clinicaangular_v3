import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import {
  pageSelection,
  Requerimientos,
} from 'src/app/shared/interfaces/almacen';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { GenerarRequerimientoService } from 'src/app/shared/services/almacen/generar-requerimiento/generar-requerimiento.service';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'app-generar-requerimiento-index',
  templateUrl: './generar-requerimiento-index.component.html',
  styleUrls: ['./generar-requerimiento-index.component.scss'],
})
export class GenerarRequerimientoIndexComponent implements OnInit {
  public ruta = rutas;
  datosREQUERIMIENTOS: Requerimientos[] = [];

  public requerimientosList: Array<Requerimientos> = [];
  dataSource!: MatTableDataSource<Requerimientos>;

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
    public generarRequerimientoService: GenerarRequerimientoService,
    public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.userAll();
  }

  datosUSUARIOS: any;
  userAll(): void {
    this.generalService.getUsuariosAll().subscribe({
      next: (datosUSUARIOS: any) => {
        this.datosUSUARIOS = datosUSUARIOS;
        this.requerimientosAll();
      },
      error: () => {},
      complete: () => {},
    });
  }

  private requerimientosAll(): void {
    this.requerimientosList = [];
    this.serialNumberArray = [];
    this.generarRequerimientoService.getRequerimientosAll().subscribe({
      next: (datosREQUERIMIENTOS: any) => {
        this.datosREQUERIMIENTOS = datosREQUERIMIENTOS;
        this.totalData = this.datosREQUERIMIENTOS.length;

        if (datosREQUERIMIENTOS === 'no hay resultados') {
          this.totalData = 0;
        }

        // Mapea los nombres de datos de ventas
        this.datosREQUERIMIENTOS = this.datosREQUERIMIENTOS.map(
          (requerimiento: Requerimientos) => {
            //PARA PROVEEDOR
            const usuario = this.datosUSUARIOS.find(
              (user: any) => user.user_id === requerimiento.usuario_id
            );
            //requerimiento;
            if (usuario) {
              requerimiento.nombreUsuario = usuario.user_name;
            }
            //console.log(usuario);
            return requerimiento;
          }
        );

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosREQUERIMIENTOS.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Requerimientos>(
          this.requerimientosList
        );
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosREQUERIMIENTOS.map((res: Requerimientos, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.requerimientosList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: string): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.requerimientosList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCOMPRA)
    const filteredData = this.datosREQUERIMIENTOS.filter(
      (requerimiento: Requerimientos) => {
        return (
          (requerimiento.requerimiento_id &&
            requerimiento.requerimiento_id
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (requerimiento.requerimiento_fecha &&
            requerimiento.requerimiento_fecha
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (requerimiento.nombreUsuario &&
            requerimiento.nombreUsuario
              .toLowerCase()
              .includes(value.toLowerCase()))
        );
      }
    );

    // Asigna los datos filtrados a this.comprasList
    this.requerimientosList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosREQUERIMIENTOS.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Requerimientos>(
      this.requerimientosList
    );
  }

  public sortData(sort: Sort) {
    const data = this.requerimientosList.slice();

    if (!sort.active || sort.direction === '') {
      this.requerimientosList = data;
    } else {
      this.requerimientosList = data.sort((a, b) => {
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
    this.requerimientosAll();
    this.dataSource = new MatTableDataSource<Requerimientos>(
      this.requerimientosList
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
    this.requerimientosAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.requerimientosAll();
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
