import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
import { MatTableDataSource } from '@angular/material/table';
import {
  pageSelection,
  ComprobanteNumeracion,
} from 'src/app/shared/interfaces/contable';
import { Sort } from '@angular/material/sort';
import { ComprobanteNumeracionService } from 'src/app/shared/services/contable/asignacion-serie/comprobante-numeracion.service';
import { ComprobanteTipoService } from 'src/app/shared/services/contable/asignacion-serie/comprobante-tipo.service';
import { SucursalService } from 'src/app/shared/services/sucursal/sucursal.service';
import { ComprobanteTipos } from '../../../../shared/interfaces/contable';

@Component({
  selector: 'app-asignacion-series-index',
  templateUrl: './asignacion-series-index.component.html',
  styleUrls: ['./asignacion-series-index.component.scss'],
})
export class AsignacionSeriesIndexComponent implements OnInit {
  constructor(
    private comprobanteNumeracionService: ComprobanteNumeracionService,
    private sucursalService: SucursalService,
    private comprobanteTipoService: ComprobanteTipoService
  ) {}
  public ruta = rutas;
  datosComprobNumeracion: ComprobanteNumeracion[] = [];

  public comprobNumeracionList: Array<ComprobanteNumeracion> = [];
  dataSource!: MatTableDataSource<ComprobanteNumeracion>;

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
    this.comprobantesTiposAll();
  }
  datosSUC: any;
  sucursalAll(): void {
    this.sucursalService.getSucursalAll().subscribe({
      next: (response0: any) => {
        this.datosSUC = response0;
        this.comprobantesNumeracionAll();
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {},
    });
  }

  datosCTIPOS: any;
  comprobantesTiposAll(): void {
    this.comprobanteTipoService.getComprobanteTiposAll().subscribe({
      next: (response1: any) => {
        this.datosCTIPOS = response1;
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {},
    });
  }

  comprobantesNumeracionAll(): void {
    this.comprobNumeracionList = [];
    this.serialNumberArray = [];
    this.comprobanteNumeracionService.getComprobanteNumeracionAll().subscribe({
      next: (response: any) => {
        this.datosComprobNumeracion = response;
        console.log(this.datosComprobNumeracion.length);
        this.totalData = this.datosComprobNumeracion.length;
        // Mapea los nombres de los clientes a los datos de ventas
        this.datosComprobNumeracion = this.datosComprobNumeracion.map(
          (comprobNumero: ComprobanteNumeracion) => {
            const sucursal = this.datosSUC.find(
              (suc: any) => suc.suc_id === comprobNumero.sede_id
            );
            if (sucursal) {
              comprobNumero.nombreSede = sucursal.suc_nombre;
            }
            const ctipos = this.datosCTIPOS.find(
              (ctipo: any) => ctipo.tipo_id === comprobNumero.comprobante_tipo
            );
            if (ctipos) {
              comprobNumero.nombreComprobanteTipo = ctipos.tipo_nombre;
            }
            return comprobNumero;
          }
        );

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosComprobNumeracion.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<ComprobanteNumeracion>(
          this.comprobNumeracionList
        );
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosComprobNumeracion.map(
      (res: ComprobanteNumeracion, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.comprobNumeracionList.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      }
    );
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.comprobNumeracionList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosComprobNumeracion)
    const filteredData = this.datosComprobNumeracion.filter(
      (cnum: ComprobanteNumeracion) => {
        return (
          (cnum.numeracion_id &&
            cnum.numeracion_id
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (cnum.nombreSede &&
            cnum.nombreSede.toLowerCase().includes(value.toLowerCase())) ||
          (cnum.nombreComprobanteTipo &&
            cnum.nombreComprobanteTipo
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (cnum.serie &&
            cnum.serie.toLowerCase().includes(value.toLowerCase())) ||
          (cnum.numero &&
            cnum.numero.toLowerCase().includes(value.toLowerCase()))
        );
      }
    );

    // Asigna los datos filtrados a this.comprobNumeracionList
    this.comprobNumeracionList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosComprobNumeracion.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<ComprobanteNumeracion>(
      this.comprobNumeracionList
    );
  }

  public sortData(sort: Sort) {
    const data = this.comprobNumeracionList.slice();

    if (!sort.active || sort.direction === '') {
      this.comprobNumeracionList = data;
    } else {
      this.comprobNumeracionList = data.sort((a, b) => {
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
      this.comprobantesNumeracionAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.comprobantesNumeracionAll();
    }
    this.dataSource = new MatTableDataSource<ComprobanteNumeracion>(
      this.comprobNumeracionList
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
    this.comprobantesNumeracionAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.comprobantesNumeracionAll();
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
}
