import { Component, OnInit } from '@angular/core';
import { rutasclinica } from 'src/app/shared/routes/rutasclinica';
import { pageSelection, Clientes } from 'src/app/shared/interfaces/despacho';
import { ClientesService } from 'src/app/shared/services/despacho/clientes/clientes.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-clientes-index',
  templateUrl: './clientes-index.component.html',
  styleUrls: ['./clientes-index.component.scss'],
})
export class ClientesIndexComponent implements OnInit {
  public rutaclinica = rutasclinica;
  datosCLIENTE: Clientes[] = [];
  clienteallError: string = '';

  public clientesList: Array<Clientes> = [];
  dataSource!: MatTableDataSource<Clientes>;

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

  constructor(public clientesService: ClientesService) {}

  ngOnInit(): void {
    this.clientesAll();
  }

  private clientesAll(): void {
    this.clientesList = [];
    this.serialNumberArray = [];

    this.clientesService.getClientesAll().subscribe({
      next: (datosCLIENTE: any) => {
        this.datosCLIENTE = datosCLIENTE;
        this.totalData = this.datosCLIENTE.length;

        // Aplicar filtro solo si searchDataValue está definido
        if (this.searchDataValue) {
          this.searchData(this.searchDataValue);
        } else {
          // Si no hay filtro, mostrar todos los datos paginados
          this.paginateData();
          this.totalFilteredData = this.datosCLIENTE.length;
        }
      },
      error: (errorData) => {
        console.error(errorData);
        this.clienteallError = errorData;
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Clientes>(this.clientesList);
        this.calculateTotalPages(this.totalFilteredData, this.pageSize);
      },
    });
  }

  totalFilteredData: any;
  private paginateData(): void {
    this.datosCLIENTE.map((res: Clientes, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.clientesList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
  }

  public searchData(value: any): void {
    //this.dataSource.filter = value.trim().toLowerCase();this.clientesList = this.dataSource.filteredData;
    this.searchDataValue = value; // Almacena el valor de búsqueda
    // Realiza el filtro en todos los datos (this.datosCLIENTE)
    const filteredData = this.datosCLIENTE.filter((cliente: Clientes) => {
      return (
        (cliente.cli_id &&
          cliente.cli_id
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (cliente.tipo_documento &&
          cliente.tipo_documento.toLowerCase().includes(value.toLowerCase())) ||
        (cliente.numero_documento &&
          cliente.numero_documento
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())) ||
        (cliente.cli_nombre &&
          cliente.cli_nombre.toLowerCase().includes(value.toLowerCase())) ||
        (cliente.cli_direccion &&
          cliente.cli_direccion.toLowerCase().includes(value.toLowerCase())) ||
        (cliente.cli_email &&
          cliente.cli_email.toLowerCase().includes(value.toLowerCase())) ||
        (cliente.cli_telefono &&
          cliente.cli_telefono.toLowerCase().includes(value.toLowerCase())) ||
        ((cliente.cli_estado === '1' ? 'activo' : 'inactivo') &&
          (cliente.cli_estado === '1' ? 'activo' : 'inactivo')
            .toLowerCase()
            .includes(value.toLowerCase()))
      );
    });

    // Asigna los datos filtrados a this.clientesList
    this.clientesList = filteredData.slice(this.skip, this.limit);

    if (value.trim() === '') {
      // Si el filtro está vacío, recupera todos los datos y recalcule las páginas
      this.calculateTotalPages(this.totalData, this.pageSize);
      this.totalFilteredData = this.datosCLIENTE.length;
    } else {
      this.totalFilteredData = filteredData.length;
      // Recalcula las páginas disponibles para los resultados filtrados
      this.calculateTotalPages(filteredData.length, this.pageSize);
    }
    // Actualiza la vista
    this.dataSource = new MatTableDataSource<Clientes>(this.clientesList);
  }

  public sortData(sort: Sort) {
    const data = this.clientesList.slice();

    if (!sort.active || sort.direction === '') {
      this.clientesList = data;
    } else {
      this.clientesList = data.sort((a, b) => {
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
      this.clientesAll();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.clientesAll();
    }
    this.dataSource = new MatTableDataSource<Clientes>(this.clientesList); // Agregar esta línea
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
    this.clientesAll();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.clientesAll();
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
