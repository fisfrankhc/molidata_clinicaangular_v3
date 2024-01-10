import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
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
  public ruta = rutas;
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
        this.datosCLIENTE.map((res: Clientes, index: number) => {
          const serialNumber = index + 1;
          if (index >= this.skip && serialNumber <= this.limit) {
            this.clientesList.push(res);
            this.serialNumberArray.push(serialNumber);
          }
        });
      },
      error: (errorData) => {
        console.error(errorData);
        this.clienteallError = errorData;
      },
      complete: () => {
        this.dataSource = new MatTableDataSource<Clientes>(this.clientesList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      },
    });
  }

  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.clientesList = this.dataSource.filteredData;
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

